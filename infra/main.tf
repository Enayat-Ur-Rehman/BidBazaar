terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project = var.project
    }
  }
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "aws_profile" {
  type    = string
  default = "bidbazaar-lab"
}

variable "project" {
  type    = string
  default = "bidbazaar"
}

variable "github_repo" {
  description = "owner/name of the GitHub repository allowed to deploy"
  type        = string
  default     = "Enayat-Ur-Rehman/BidBazaar"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "app_secrets" {
  description = "Backend settings (JWT, Stripe, Cloudinary, SMTP) stored in SSM Parameter Store. Set in terraform.tfvars, never committed."
  type        = map(string)
  sensitive   = true
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

# Kernel 6.12 is pinned because MongoDB 8 refuses to start on kernel 6.19+.
data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.12-x86_64"
}

locals {
  azs          = slice(data.aws_availability_zones.available.names, 0, 2)
  account_id   = data.aws_caller_identity.current.account_id
  ecr_registry = "${local.account_id}.dkr.ecr.${var.region}.amazonaws.com"
  ami_id       = nonsensitive(data.aws_ssm_parameter.al2023_ami.value)
}

output "site_url" {
  value = "http://${aws_lb.web.dns_name}"
}

output "ecr_registry" {
  value = local.ecr_registry
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
}

output "db_instance_id" {
  value = aws_instance.db.id
}

output "db_private_ip" {
  value = aws_instance.db.private_ip
}
