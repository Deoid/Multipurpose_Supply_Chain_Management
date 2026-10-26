variable "aws_region" {
  description = "AWS Region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "multipurpose-scm"
}

variable "notification_email" {
  description = "Email address for SNS critical alerts (temperature breaches, stockouts)"
  type        = string
  default     = "alerts-scm@example.com"
}
