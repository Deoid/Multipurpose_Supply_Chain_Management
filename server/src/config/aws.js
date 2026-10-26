const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');
const { SQSClient } = require('@aws-sdk/client-sqs');
const { SNSClient } = require('@aws-sdk/client-sns');

const isMockMode = process.env.AWS_MOCK === 'true' || !process.env.AWS_ACCESS_KEY_ID;

const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
};

let ddbDocClient = null;
let s3Client = null;
let sqsClient = null;
let snsClient = null;

if (!isMockMode) {
  try {
    const rawDdb = new DynamoDBClient(awsConfig);
    ddbDocClient = DynamoDBDocumentClient.from(rawDdb);
    s3Client = new S3Client(awsConfig);
    sqsClient = new SQSClient(awsConfig);
    snsClient = new SNSClient(awsConfig);
    console.log('🔗 Connected to live AWS Cloud Services in region:', awsConfig.region);
  } catch (err) {
    console.warn('⚠️ Failed to initialize live AWS Clients, falling back to Local Mock mode:', err.message);
  }
}

// In-Memory AWS Store for Local/Demo Mode
const mockStore = {
  inventory: new Map(),
  orders: new Map(),
  shipments: new Map(),
  suppliers: new Map(),
  telemetry: new Map(),
  s3Buckets: {
    'multipurpose-scm-docs-dev-us-east-1': new Map(),
  },
  sqsQueues: {
    orders: [],
    ordersDlq: [],
  },
  snsAlerts: [],
};

module.exports = {
  isMockMode: !ddbDocClient,
  ddbDocClient,
  s3Client,
  sqsClient,
  snsClient,
  mockStore,
  config: {
    region: awsConfig.region,
    inventoryTable: process.env.DYNAMODB_INVENTORY_TABLE || 'multipurpose-scm-inventory-dev',
    ordersTable: process.env.DYNAMODB_ORDERS_TABLE || 'multipurpose-scm-orders-dev',
    shipmentsTable: process.env.DYNAMODB_SHIPMENTS_TABLE || 'multipurpose-scm-shipments-dev',
    suppliersTable: process.env.DYNAMODB_SUPPLIERS_TABLE || 'multipurpose-scm-suppliers-dev',
    telemetryTable: process.env.DYNAMODB_TELEMETRY_TABLE || 'multipurpose-scm-iot-telemetry-dev',
    s3Bucket: process.env.S3_DOCUMENTS_BUCKET || 'multipurpose-scm-docs-dev-us-east-1',
    sqsQueueUrl: process.env.SQS_ORDERS_QUEUE_URL || 'multipurpose-scm-orders-queue-dev',
    snsTopicArn: process.env.SNS_ALERTS_TOPIC_ARN || 'arn:aws:sns:us-east-1:123456789012:multipurpose-scm-alerts-topic-dev',
  },
};
