output "dynamodb_inventory_table" {
  description = "Name of the DynamoDB Inventory table"
  value       = aws_dynamodb_table.inventory.name
}

output "dynamodb_orders_table" {
  description = "Name of the DynamoDB Orders table"
  value       = aws_dynamodb_table.orders.name
}

output "dynamodb_shipments_table" {
  description = "Name of the DynamoDB Shipments table"
  value       = aws_dynamodb_table.shipments.name
}

output "dynamodb_suppliers_table" {
  description = "Name of the DynamoDB Suppliers table"
  value       = aws_dynamodb_table.suppliers.name
}

output "dynamodb_iot_telemetry_table" {
  description = "Name of the DynamoDB IoT Telemetry table"
  value       = aws_dynamodb_table.iot_telemetry.name
}

output "s3_documents_bucket" {
  description = "Name of the S3 Documents bucket"
  value       = aws_s3_bucket.scm_documents.id
}

output "sqs_orders_queue_url" {
  description = "URL of the SQS Orders queue"
  value       = aws_sqs_queue.orders_queue.id
}

output "sqs_orders_dlq_url" {
  description = "URL of the SQS Orders Dead-Letter queue"
  value       = aws_sqs_queue.orders_dlq.id
}

output "sns_alerts_topic_arn" {
  description = "ARN of the SNS Alerts topic"
  value       = aws_sns_topic.alerts_topic.arn
}
