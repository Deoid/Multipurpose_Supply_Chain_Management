import React from 'react';
import { Cloud, Database, Cpu, Radio, Archive, Bell } from 'lucide-react';

const SERVICE_CONFIG = {
  dynamodb: {
    name: 'Amazon DynamoDB',
    icon: Database,
    color: 'border-blue-500/40 bg-blue-950/40 text-blue-300',
    desc: 'Ultra-low latency NoSQL key-value store',
  },
  sqs: {
    name: 'Amazon SQS',
    icon: Cpu,
    color: 'border-pink-500/40 bg-pink-950/40 text-pink-300',
    desc: 'Decoupled async message queuing with DLQ',
  },
  sns: {
    name: 'Amazon SNS',
    icon: Bell,
    color: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
    desc: 'Instant fan-out pub/sub alert notifications',
  },
  s3: {
    name: 'Amazon S3',
    icon: Archive,
    color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
    desc: 'Encrypted object storage for invoices & bills of lading',
  },
  iot: {
    name: 'AWS IoT Core',
    icon: Radio,
    color: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
    desc: 'Real-time telemetry ingestion and rules engine',
  },
};

export default function AwsArchitectureBadge({ service = 'dynamodb', action = 'Powered by' }) {
  const conf = SERVICE_CONFIG[service] || SERVICE_CONFIG.dynamodb;
  const Icon = conf.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${conf.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{action}: <strong className="font-semibold">{conf.name}</strong></span>
    </div>
  );
}
