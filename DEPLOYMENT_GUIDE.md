# BidBazaar – Cloud Deployment Guide (CEA)

BidBazaar is deployed on **AWS** as a containerized **three-tier** application:
- **Terraform** creates all the infrastructure.
- **GitHub Actions** builds, tests and deploys the code when you start the workflow from the Actions tab.

| | |
|---|---|
| **Live site** | http://bidbazaar-alb-1215735136.us-east-1.elb.amazonaws.com |
| **Repository** | https://github.com/Enayat-Ur-Rehman/BidBazaar |
| **Pipeline runs** | https://github.com/Enayat-Ur-Rehman/BidBazaar/actions |
| **Region** | us-east-1 (N. Virginia) |

---

## 1. Architecture

```
                               Internet
                                  │ HTTP :80
┌─────────────────────────────────┼───────────────────────────────────────────┐
│ VPC 10.0.0.0/16                 │                                           │
│                                 ▼                                           │
│  PUBLIC SUBNETS  (10.0.1.0/24 – AZ a, 10.0.2.0/24 – AZ b)  → Internet Gateway│
│   ┌──────────────────────────────────────┐    ┌──────────────────┐          │
│   │ Application Load Balancer (alb-sg)   │    │ NAT instance     │          │
│   │ listener :80 → target group web-tg   │    │ (nat-sg)         │          │
│   └──────────────────┬───────────────────┘    └────────▲─────────┘          │
│                      │ :80 only from alb-sg            │ outbound internet  │
│  PRIVATE SUBNETS (10.0.11.0/24 – AZ a, 10.0.12.0/24 – AZ b) → NAT instance  │
│   ┌──────────────────▼───────────────────┐             │                    │
│   │ Auto Scaling Group (1–2 x t3.micro)  │─────────────┘                    │
│   │ app-host-sg                          │                                  │
│   │  ┌───────────────┐  ┌──────────────┐ │                                  │
│   │  │ WEB container │─▶│ APP container│ │  docker-compose on each host     │
│   │  │ nginx + React │  │ Node/Express │ │  (only nginx is exposed)         │
│   │  └───────────────┘  └──────┬───────┘ │                                  │
│   └────────────────────────────┼─────────┘                                  │
│                                │ :27017 only from app-host-sg               │
│   ┌────────────────────────────▼─────────┐                                  │
│   │ DB server – MongoDB 8.0 container    │  password-protected,             │
│   │ (db-sg), data on EBS volume          │  no public IP                    │
│   └──────────────────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘

CI/CD:  Run workflow (Actions tab) → GitHub Actions → build + test → push images to Amazon ECR
        → SSM Run Command on app hosts → pull new images → live site updated
Secrets: SSM Parameter Store (SecureString) → read by servers at start/deploy
Logs:    all containers → CloudWatch Logs group /bidbazaar/containers
```

### What each tier is

| Tier | What runs | Where | Who can reach it |
|---|---|---|---|
| Web | nginx container: serves the React build, forwards `/api` to the app container | Private subnets, behind the public load balancer | Only the load balancer (port 80) |
| Application | Node.js/Express container | Same hosts as web (docker-compose); not exposed on the host | Only the web container, over the internal Docker network |
| Database | MongoDB 8.0 container on its own server | Private subnet, no public IP | Only app hosts (port 27017), with a username and password |

---

## 2. How each CEA requirement is met

| # | Requirement | How we did it | Where in the code |
|---|---|---|---|
| 1 | VPC, public and private subnets, IGW, route tables, NAT | VPC `10.0.0.0/16`, 2 public and 2 private subnets in 2 AZs, Internet Gateway, public and private route tables, NAT instance | [infra/network.tf](infra/network.tf) |
| 2 | Web tier as a Docker container | Multi-stage Dockerfile: Node builds React, nginx serves it | [frontend/Dockerfile](frontend/Dockerfile), [frontend/nginx.conf.template](frontend/nginx.conf.template) |
| 3 | App tier as a Docker container, docker-compose | Node Dockerfile (runs as a non-root user); `docker-compose.yml` for local/CI, and a compose file on each AWS host | [backend/Dockerfile](backend/Dockerfile), [docker-compose.yml](docker-compose.yml), [infra/templates/app-host.sh.tftpl](infra/templates/app-host.sh.tftpl) |
| 4 | Secured database | Self-managed MongoDB in a private subnet, authentication on, separate app user with `readWrite` on one database only | [infra/templates/db.sh.tftpl](infra/templates/db.sh.tftpl) |
| 5 | Container registry | Amazon ECR repositories `bidbazaar-web` and `bidbazaar-app` (scan on push, keep last 5 images) | [infra/compute.tf](infra/compute.tf) |
| 6 | CI/CD pipeline | GitHub Actions: build images, start all 3 tiers, smoke test, push to ECR, deploy with SSM, check the live site | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) |
| 7 | Load balancer, target group, auto scaling | Application Load Balancer, target group with `/api/v1/health` health check, Auto Scaling Group (min 1, max 2, scales on CPU > 60%) | [infra/compute.tf](infra/compute.tf) |
| 8 | Security | One security group per tier; only the tier in front can connect; private subnets; no SSH open anywhere; secrets in SSM Parameter Store; GitHub logs in to AWS with OIDC (no AWS keys stored in GitHub) | [infra/security.tf](infra/security.tf), [infra/cicd.tf](infra/cicd.tf) |
| 9 | Enhancements | **Infrastructure-as-Code (Terraform)** (main one), **centralized logging (CloudWatch Logs)**, **cost estimate** (section 7). MongoDB data also sits on a 20 GB gp3 EBS volume, so it survives stop/start. | [infra/](infra/) |

---

## 3. Files we added

```
backend/Dockerfile               App tier image (Node 22, production deps, non-root user)
backend/.dockerignore            Keeps node_modules and config.env (secrets) out of the image
frontend/Dockerfile              Web tier image (build React, serve with nginx)
frontend/nginx.conf.template     nginx config; backend address comes from APP_UPSTREAM
docker-compose.yml               Runs mongo + app + web together locally and in CI
infra/main.tf                    Terraform provider, variables, outputs
infra/network.tf                 VPC, subnets, Internet Gateway, NAT instance, route tables
infra/security.tf                Security groups per tier
infra/compute.tf                 ECR, CloudWatch logs, SSM secrets, IAM roles, DB server,
                                 load balancer, launch template, Auto Scaling Group
infra/cicd.tf                    GitHub OIDC login + least-privilege deploy role
infra/templates/*.sh(.tftpl)     First-boot scripts for the NAT, DB and app hosts
.github/workflows/deploy.yml     The CI/CD pipeline
```

**Small code changes:**
- [backend/app.js](backend/app.js): added `GET /api/v1/health`, which the load balancer uses to check the app is alive.
- [backend/utils/cronLock.js](backend/utils/cronLock.js): the scheduled jobs (auction end, payment expiry, commission check) take a short lock in MongoDB, so they run **once** even when 2 app servers are running.
- [backend/database/connection.js](backend/database/connection.js): the backend keeps retrying the database connection if MongoDB isn't ready yet, e.g. right after servers start.

---

## 4. How the pipeline works

The pipeline does not start on its own. Start it by hand: **Actions → CI/CD - Build, Test, Deploy → Run workflow** (branch `main`) → **Run workflow**.

**Job 1 – Build, test and push images**
1. Check out the code.
2. `docker compose build`: builds the web and app images, tagged with the commit SHA.
3. `docker compose up -d`: starts all three tiers (web, app, MongoDB) on the GitHub runner.
4. **Smoke tests:**
   - health route returns `{"status":"ok"}`
   - home page serves the React app
   - a page route like `/auctions` returns 200
   - an API call that reads the database returns 200
5. Log in to AWS with **OIDC** (short-lived credentials, no stored keys) and push both images to ECR, tagged `:<commit-sha>` and `:latest`.

**Job 2 – Deploy to AWS** (runs only if job 1 passed)
1. Log in to AWS with OIDC.
2. **SSM Run Command** on every server tagged `Role=app-host` runs `/opt/bidbazaar/deploy.sh`, which:
   - reads the latest secrets from SSM Parameter Store into `.env`
   - logs in to ECR and runs `docker compose pull`
   - runs `docker compose up -d` to restart containers with the new images
3. Calls the live site's health route and home page to confirm the new version is up.

New servers started by the Auto Scaling Group run the same `deploy.sh` at first boot, so they always start with the latest images.

> **Note:** The smoke test uses `mongo:7.0` because GitHub's runners now have Linux kernel 6.19+, which MongoDB 8 refuses to start on. Production runs MongoDB 8.0 on Amazon Linux 2023 with kernel 6.12, pinned in Terraform for the same reason.

---

## 5. Showing the teacher: change code → live site updates

1. Open the live site and note some visible text, e.g. a heading on the home page.
2. Change that text in the frontend code (for example in `frontend/src/pages/...`).
3. Commit and push:
   ```
   git add .
   git commit -m "Demo: update heading"
   git push origin main
   ```
4. Open **GitHub → Actions → CI/CD - Build, Test, Deploy**, click **Run workflow**, keep branch `main`, and click the green **Run workflow** button. Both jobs turn green in about **3–4 minutes**.
5. Refresh the live site (Ctrl+F5). The new text is there.

The same button also redeploys without any code change.

---

## 6. Running Terraform yourself

You need Terraform (installed at `C:\Users\Hp\bin\terraform.exe`), the AWS CLI profile `bidbazaar-lab`, and the file `infra/terraform.tfvars`. That file holds the app secrets (JWT, Stripe, Cloudinary, SMTP) and is **not** in git.

```
cd infra
terraform init
terraform plan -out=tfplan     # shows what will be created or changed
terraform apply tfplan         # creates or updates the infrastructure
terraform output               # site URL, ECR registry, GitHub role, DB info
terraform destroy              # deletes everything (asks for confirmation)
```

**After a destroy and re-apply:**
- **New site URL:** the load balancer gets a new address. Update `SITE_URL` in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
- **Empty database:** reload your data.
- **Push images first:** the first boot needs images in ECR, so run the pipeline once (Run workflow) or push images from your PC.

---

## 7. Cost

### While running (taken from AWS Free Tier credits)

| Item | Approx. cost |
|---|---|
| Application Load Balancer | $0.0225/hour |
| 3 × t3.micro (NAT, app host, DB) | $0.0312/hour |
| Public IPv4 addresses (load balancer ×2, NAT ×1) | $0.015/hour |
| EBS disks (≈36 GB gp3) | ≈ $0.004/hour |
| ECR, CloudWatch Logs, SSM Parameter Store | ≈ $0 (within free limits) |
| **Total** | **≈ $0.07/hour ≈ $1.70/day ≈ $52/month** |

### Ways we keep the cost down
1. **NAT instance instead of a NAT Gateway.** The document allows "NAT gateway or equivalent". This saves about $33/month plus data charges.
2. **Web and app tiers share hosts with docker-compose,** so we don't need a second, internal load balancer (about $16/month saved) or separate servers.
3. **Small, auto-scaled servers:** t3.micro, 1 by default and 2 only under load.
4. **ECR keeps only the last 5 images,** and logs are kept for only 7 days.
5. **Destroy when not needed:** `terraform destroy` removes everything, and `terraform apply` recreates it in about 5 minutes.

---

## 8. Non-functional requirements (summary for the report)

| NFR | What supports it | Known limitation and how to improve |
|---|---|---|
| Scalability | Auto Scaling Group adds a second host when CPU > 60%. App containers are stateless (JWT cookie, data in MongoDB). The load balancer spreads traffic. | Single MongoDB server. Could use a MongoDB replica set or a managed service (DocumentDB / Atlas). |
| Availability | 2 Availability Zones for subnets and the load balancer. The ASG replaces unhealthy hosts automatically (ELB health check). Containers restart automatically. | The DB server and NAT instance are single points of failure. Could use a replica set and one NAT Gateway per AZ. |
| Elasticity | CPU target-tracking policy scales hosts out and back in automatically. | Max is 2 hosts to protect free-tier credits. |
| Security | Private subnets, security group chain (ALB → app hosts → DB), no SSH (Systems Manager only), MongoDB authentication with a least-privilege app user, secrets in SSM SecureString, OIDC for CI (no stored keys), non-root app container, IMDSv2 required. | HTTP only (no domain for an HTTPS certificate). Could add ACM + HTTPS listener + a domain. |
| Maintainability / Deployability | Everything is code (Terraform, Dockerfiles, workflow). One click on Run workflow deploys in about 4 minutes with automatic tests. | Deploy restarts containers in place (a few seconds of downtime). Could use ASG instance refresh or blue/green. |
| Performance | nginx serves static files directly; the load balancer and app hosts are in the same region and VPC. | No CDN or caching. Could add CloudFront in front of the load balancer. |
| Cost-efficiency | See section 7. | — |
| Portability | Containers run the same on a laptop (`docker compose up`), in CI and on AWS. Only Terraform is AWS-specific. | — |

---

## 9. Screenshots to take for the submission

| Evidence | Where to find it (AWS console, region N. Virginia) |
|---|---|
| VPC and subnets | VPC → Your VPCs → `bidbazaar-vpc`; VPC → Subnets; Route tables; Internet gateways |
| Compute / container hosts | EC2 → Instances (`bidbazaar-app-host`, `bidbazaar-db`, `bidbazaar-nat`); EC2 → Auto Scaling Groups → `bidbazaar-app-asg` |
| Security groups | EC2 → Security Groups → `bidbazaar-alb-sg`, `-app-host-sg`, `-db-sg`, `-nat-sg` (Inbound rules tab) |
| Load balancer | EC2 → Load Balancers → `bidbazaar-alb`; Target Groups → `bidbazaar-web-tg` (Targets tab shows **healthy**) |
| Database | EC2 → Instances → `bidbazaar-db` (private IP only, no public IP) |
| Registry | ECR → Repositories → `bidbazaar-web` / `bidbazaar-app` (image list with commit-SHA tags) |
| CI/CD run | GitHub → Actions → a green run with both jobs |
| Secrets | Systems Manager → Parameter Store → `/bidbazaar/...` (SecureString) |
| Logs | CloudWatch → Log groups → `/bidbazaar/containers` |
| Running app | The live site URL in a browser |

---

## 10. Deleting everything after grading

```
cd infra
terraform destroy
```

Then go to **IAM → Users → Ammar → Security credentials** and delete the access key used for this lab.
