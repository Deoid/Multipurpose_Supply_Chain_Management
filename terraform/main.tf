terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ==============================================================================
# 1. Amazon DynamoDB Tables
# ==============================================================================

# Inventory Table (Warehouse ID + SKU)
resource "aws_dynamodb_table" "inventory" {
  name         = "${var.project_name}-inventory-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "warehouseId"
  range_key    = "sku"

  attribute {
    name = "warehouseId"
    type = "S"
  }

  attribute {
    name = "sku"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  global_secondary_index {
    name            = "CategoryIndex"
    hash_key        = "category"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# Orders Table
resource "aws_dynamodb_table" "orders" {
  name         = "${var.project_name}-orders-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "orderId"

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "StatusCreatedAtGSI"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# Shipments Table
resource "aws_dynamodb_table" "shipments" {
  name         = "${var.project_name}-shipments-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "shipmentId"

  attribute {
    name = "shipmentId"
    type = "S"
  }

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "OrderIdIndex"
    hash_key        = "orderId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "StatusIndex"
    hash_key        = "status"
    projection_type = "ALL"
  }
}

# Suppliers Table
resource "aws_dynamodb_table" "suppliers" {
  name         = "${var.project_name}-suppliers-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "supplierId"

  attribute {
    name = "supplierId"
    type = "S"
  }
}

# IoT Telemetry Table (Time-Series for Fleet Sensors)
resource "aws_dynamodb_table" "iot_telemetry" {
  name         = "${var.project_name}-iot-telemetry-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "shipmentId"
  range_key    = "timestamp"

  attribute {
    name = "shipmentId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

# ==============================================================================
# 2. Amazon S3 Storage (Documents, Invoices, Delivery Proofs)
# ==============================================================================

resource "aws_s3_bucket" "scm_documents" {
  bucket        = "${var.project_name}-docs-${var.environment}-${var.aws_region}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "scm_documents_versioning" {
  bucket = aws_s3_bucket.scm_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "scm_documents_encryption" {
  bucket = aws_s3_bucket.scm_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Public access block for enterprise security
resource "aws_s3_bucket_public_access_block" "scm_documents_access" {
  bucket = aws_s3_bucket.scm_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==============================================================================
# 3. Amazon SQS (Decoupled Async Order Ingestion & DLQ)
# ==============================================================================

# Dead Letter Queue for failed order events
resource "aws_sqs_queue" "orders_dlq" {
  name                      = "${var.project_name}-orders-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days
}

# Primary Order Processing Queue
resource "aws_sqs_queue" "orders_queue" {
  name                       = "${var.project_name}-orders-queue-${var.environment}"
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 345600 # 4 days
  receive_wait_time_seconds  = 10     # Long polling enabled
  visibility_timeout_seconds = 60

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn
    maxReceiveCount     = 3
  })
}

# ==============================================================================
# 4. Amazon SNS (Supply Chain Broadcast & Alert System)
# ==============================================================================

resource "aws_sns_topic" "alerts_topic" {
  name = "${var.project_name}-alerts-topic-${var.environment}"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.alerts_topic.arn
  protocol  = "email"
  endpoint  = var.notification_email
}
