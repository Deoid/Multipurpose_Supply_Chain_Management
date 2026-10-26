import React from 'react';
import {
  Cloud,
  Database,
  Cpu,
  Archive,
  Bell,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';

const AWS_SERVICES = [
  {
    name: 'Amazon DynamoDB',
    service: 'dynamodb',
    role: 'Operational Data Store',
    description:
      'Fast, flexible NoSQL database with single-digit millisecond latency at scale. Stores multi-warehouse inventory, orders lifecycle, supplier profiles, and IoT sensor streams.',
    keyFeatures: [
      'Partition Key + Sort Key composite primary keys',
      'Global Secondary Indexes (GSI) for query filtering by Category and Order Status',
      'Automated 30-Day TTL (Time-To-Live) for IoT high-frequency sensor readings',
    ],
    terraformResource: 'aws_dynamodb_table',
  },
  {
    name: 'Amazon SQS (Simple Queue Service)',
    service: 'sqs',
    role: 'Decoupled Asynchronous Order Processing',
    description:
      'Highly-scalable message queue that decouples customer order placement from back-office fulfillment workers, guaranteeing zero order drops during high traffic peaks.',
    keyFeatures: [
      'Dead-Letter Queue (DLQ) with maxReceiveCount = 3 for poison-message isolation',
      'Long-polling enabled (10s wait time) for optimized network cost and latency',
      'At-least-once message delivery with configurable visibility timeout',
    ],
    terraformResource: 'aws_sqs_queue',
  },
  {
    name: 'Amazon SNS (Simple Notification Service)',
    service: 'sns',
    role: 'Event-Driven Real-time Alert Fanout',
    description:
      'Fully managed pub/sub messaging engine that instantly broadcasts critical supply chain notifications to emails, SMS, and operational webhooks.',
    keyFeatures: [
      'Cold-chain temperature deviation breaches (>8°C or <2°C)',
      'High-impact shock and transit damage alarms',
      'Warehouse safety stock minimum threshold warnings',
    ],
    terraformResource: 'aws_sns_topic',
  },
  {
    name: 'Amazon S3 (Simple Storage Service)',
    service: 's3',
    role: 'Document Lake & Audit Proofs',
    description:
      'Industry-leading 99.999999999% (11 9s) durability object storage for electronic bills of lading, customer delivery signatures, customs declarations, and digital invoices.',
    keyFeatures: [
      'Server-Side Encryption with Amazon S3 managed keys (SSE-S3 AES-256)',
      'S3 Bucket Versioning for tamper-evident document audit trails',
      'Public Access Block enabled by default for enterprise security compliance',
    ],
    terraformResource: 'aws_s3_bucket',
  },
  {
    name: 'AWS IoT Core & Telemetry Rules',
    service: 'iot',
    role: 'Fleet Asset Telemetry Ingestion',
    description:
      'Simulates and ingests continuous telemetry streams from multi-modal shipping fleet trackers (temperature, humidity, GPS location, acceleration shock, and battery status).',
    keyFeatures: [
      'Real-time anomaly detection rules engine',
      'Direct routing to DynamoDB time-series and SNS alert notifications',
      'Seamless multi-asset tracking across global shipping lanes',
    ],
    terraformResource: 'aws_iot_topic_rule',
  },
];

export default function Architecture() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-6 h-6 text-aws-orange" />
          <h2 className="text-xl font-bold text-white">AWS Cloud Architecture & Infrastructure as Code</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          The Multipurpose Supply Chain Management system is engineered with an enterprise serverless-first, event-driven architecture.
          Every component is mapped to declarative Terraform IaC templates in the <code className="text-aws-orange font-mono">terraform/</code> directory.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AWS_SERVICES.map((srv) => (
          <div
            key={srv.name}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <AwsArchitectureBadge service={srv.service} action="AWS Service" />
                <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {srv.terraformResource}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{srv.name}</h3>
              <p className="text-xs text-slate-300 font-semibold mb-2 text-aws-orange">{srv.role}</p>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{srv.description}</p>

              <div className="space-y-1.5 pt-3 border-t border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Architectural Highlights:</span>
                {srv.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Deploy Command Reference */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Terminal className="w-4 h-4 text-aws-orange" />
          <span>Deploy AWS Infrastructure via Terraform</span>
        </div>
        <p className="text-xs text-slate-400">
          Run these standard commands from your terminal to provision the entire cloud environment in your AWS account:
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
{`cd terraform
terraform init
terraform plan -out=scm.plan
terraform apply scm.plan`}
        </pre>
      </div>
    </div>
  );
}
