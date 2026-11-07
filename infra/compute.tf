# ---------- Container registry ----------
resource "aws_ecr_repository" "repo" {
  for_each             = toset(["web", "app"])
  name                 = "${var.project}-${each.key}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "repo" {
  for_each   = aws_ecr_repository.repo
  repository = each.value.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep only the 5 most recent images"
      selection    = { tagStatus = "any", countType = "imageCountMoreThan", countNumber = 5 }
      action       = { type = "expire" }
    }]
  })
}

# ---------- Logs ----------
resource "aws_cloudwatch_log_group" "containers" {
  name              = "/${var.project}/containers"
  retention_in_days = 7
}

# ---------- Secrets (SSM Parameter Store) ----------
resource "random_password" "mongo_root" {
  length  = 24
  special = false
}

resource "random_password" "mongo_app" {
  length  = 24
  special = false
}

resource "aws_ssm_parameter" "app_secret" {
  for_each = nonsensitive(toset(keys(var.app_secrets)))
  name     = "/${var.project}/app/${each.key}"
  type     = "SecureString"
  value    = var.app_secrets[each.key]
}

resource "aws_ssm_parameter" "mongo_uri" {
  name  = "/${var.project}/app/MONGO_URI"
  type  = "SecureString"
  value = "mongodb://bidbazaar:${random_password.mongo_app.result}@${aws_instance.db.private_ip}:27017/MERN_AUCTION_PLATFORM?authSource=MERN_AUCTION_PLATFORM"
}

resource "aws_ssm_parameter" "frontend_url" {
  name  = "/${var.project}/app/FRONTEND_URL"
  type  = "String"
  value = "http://${aws_lb.web.dns_name}"
}

resource "aws_ssm_parameter" "port" {
  name  = "/${var.project}/app/PORT"
  type  = "String"
  value = "5000"
}

resource "aws_ssm_parameter" "mongo_root_password" {
  name  = "/${var.project}/db/MONGO_ROOT_PASSWORD"
  type  = "SecureString"
  value = random_password.mongo_root.result
}

resource "aws_ssm_parameter" "mongo_app_password" {
  name  = "/${var.project}/db/MONGO_APP_PASSWORD"
  type  = "SecureString"
  value = random_password.mongo_app.result
}

# ---------- IAM roles for the servers ----------
data "aws_iam_policy_document" "ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

locals {
  instance_roles = {
    app_host = { params_path = "app" }
    db       = { params_path = "db" }
    nat      = { params_path = null }
  }
}

resource "aws_iam_role" "instance" {
  for_each           = local.instance_roles
  name               = "${var.project}-${replace(each.key, "_", "-")}-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  for_each   = aws_iam_role.instance
  role       = each.value.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.instance["app_host"].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy" "params_and_logs" {
  for_each = { for k, v in local.instance_roles : k => v if v.params_path != null }
  name     = "read-own-params-and-write-logs"
  role     = aws_iam_role.instance[each.key].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["ssm:GetParameter", "ssm:GetParametersByPath"]
        Resource = [
          "arn:aws:ssm:${var.region}:${local.account_id}:parameter/${var.project}/${each.value.params_path}",
          "arn:aws:ssm:${var.region}:${local.account_id}:parameter/${var.project}/${each.value.params_path}/*",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:DescribeLogStreams"]
        Resource = "${aws_cloudwatch_log_group.containers.arn}:*"
      },
    ]
  })
}

resource "aws_iam_instance_profile" "app_host" {
  name = "${var.project}-app-host-profile"
  role = aws_iam_role.instance["app_host"].name
}

resource "aws_iam_instance_profile" "db" {
  name = "${var.project}-db-profile"
  role = aws_iam_role.instance["db"].name
}

resource "aws_iam_instance_profile" "nat" {
  name = "${var.project}-nat-profile"
  role = aws_iam_role.instance["nat"].name
}

# ---------- Database tier ----------
resource "aws_instance" "db" {
  ami                    = local.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private[0].id
  vpc_security_group_ids = [aws_security_group.db.id]
  iam_instance_profile   = aws_iam_instance_profile.db.name
  user_data = templatefile("${path.module}/templates/db.sh.tftpl", {
    region    = var.region
    project   = var.project
    log_group = aws_cloudwatch_log_group.containers.name
  })
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }
  metadata_options {
    http_tokens = "required"
  }
  tags = { Name = "${var.project}-db", Role = "db" }

  depends_on = [
    aws_route_table_association.private,
    aws_ssm_parameter.mongo_root_password,
    aws_ssm_parameter.mongo_app_password,
  ]
}

# ---------- Load balancer ----------
resource "aws_lb" "web" {
  name               = "${var.project}-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "web" {
  name                 = "${var.project}-web-tg"
  port                 = 80
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  deregistration_delay = 30
  health_check {
    path                = "/api/v1/health"
    matcher             = "200"
    interval            = 15
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.web.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# ---------- Web + App tier (Auto Scaling Group of container hosts) ----------
resource "aws_launch_template" "app_host" {
  name_prefix            = "${var.project}-app-host-"
  image_id               = local.ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.app_host.id]
  iam_instance_profile {
    name = aws_iam_instance_profile.app_host.name
  }
  metadata_options {
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }
  user_data = base64encode(templatefile("${path.module}/templates/app-host.sh.tftpl", {
    region       = var.region
    project      = var.project
    ecr_registry = local.ecr_registry
    log_group    = aws_cloudwatch_log_group.containers.name
  }))
  tag_specifications {
    resource_type = "instance"
    tags          = { Name = "${var.project}-app-host", Role = "app-host", Project = var.project }
  }
}

resource "aws_autoscaling_group" "app_host" {
  name                      = "${var.project}-app-asg"
  min_size                  = 1
  max_size                  = 2
  desired_capacity          = 1
  vpc_zone_identifier       = aws_subnet.private[*].id
  target_group_arns         = [aws_lb_target_group.web.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 600

  launch_template {
    id      = aws_launch_template.app_host.id
    version = aws_launch_template.app_host.latest_version
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 100
      max_healthy_percentage = 200
    }
  }

  tag {
    key                 = "Name"
    value               = "${var.project}-app-host"
    propagate_at_launch = true
  }

  depends_on = [
    aws_route_table_association.private,
    aws_ssm_parameter.app_secret,
    aws_ssm_parameter.mongo_uri,
    aws_ssm_parameter.frontend_url,
    aws_ssm_parameter.port,
  ]
}

resource "aws_autoscaling_policy" "cpu" {
  name                   = "${var.project}-cpu-target"
  autoscaling_group_name = aws_autoscaling_group.app_host.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 60
  }
}
