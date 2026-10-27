# 🌐 Multipurpose Supply Chain Management (SCM) Cloud Platform
> **Enterprise-grade, Event-Driven Supply Chain Management System architected on AWS Cloud Services & Cryptographic Blockchain Ledger**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://deoid.github.io/Multipurpose_Supply_Chain_Management/)
[![AWS Architecture](https://img.shields.io/badge/AWS-DynamoDB%20%7C%20S3%20%7C%20SQS%20%7C%20SNS%20%7C%20IoT%20Core-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](#aws-cloud-architecture)
[![Blockchain](https://img.shields.io/badge/Blockchain-SHA--256%20Merkle%20%7C%20Smart%20Contracts-purple?style=for-the-badge&logo=blockchaindotcom&logoColor=white)](#-blockchain--smart-contracts)
[![Documentation](https://img.shields.io/badge/Developer%20Manual-HTML%20%26%20PDF-blue?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](#developer-resources)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

🔗 **Live Interactive Control Tower Demo**: **[https://deoid.github.io/Multipurpose_Supply_Chain_Management/](https://deoid.github.io/Multipurpose_Supply_Chain_Management/)**

📁 **Developer Documentation & Downloads**:
- 🌐 **[Open Interactive Developer Manual (HTML)](Developer_Manual.html)** *(Double-click to view instantly in any web browser)*
- 📄 **[Download Complete Developer Engineering Manual (PDF)](Multipurpose_SCM_Complete_Developer_Manual.pdf)**
- 📊 **[Download 7-Slide Architecture & Blockchain Presentation (PPTX)](Multipurpose_SCM_AWS_Architecture.pptx)**

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Blockchain & Smart Contracts](#-blockchain--smart-contracts)
- [AWS Cloud Architecture](#aws-cloud-architecture)
- [Project Structure](#project-structure)
- [Quick Start Guide](#quick-start-guide)
- [GitHub Setup & Synchronization](#github-setup--synchronization)
- [Infrastructure as Code (Terraform)](#infrastructure-as-code-terraform)
- [IoT Telemetry Simulation](#iot-telemetry-simulation)
- [API Endpoints](#api-endpoints)

---

## 🚀 Overview
The **Multipurpose Supply Chain Management System** is a modular, multi-tenant cloud application engineered to handle the full lifecycle of modern supply chains across diverse industries (Pharmaceutical Cold-Chain, High-Tech Electronics, FMCG Perishables, and Heavy Industrial Machinery).

It integrates directly with AWS managed services for high availability, sub-millisecond document lookups, decoupled event queues, real-time alert broadcasts, IoT sensor streams, and an **Immutable Cryptographic Blockchain Ledger** with automated smart contracts.

---

## 🌟 Key Features

1. **🏢 Multi-Facility Warehouse Management (WMS)**
   - Real-time stock levels, SKU tracking, reorder point threshold triggers, and safety stock automation.
   - Multipurpose categorization (Cold Storage, Hazardous Material, High-Value, Standard Bulk).

2. **📦 Asynchronous Order Processing (OMS)**
   - Scalable order ingestion using **Amazon SQS** with Dead-Letter Queue (DLQ) safeguards.
   - Real-time status lifecycle: `Pending` ➔ `Queued` ➔ `Processing` ➔ `Dispatched` ➔ `Delivered`.

3. **🚚 Fleet Logistics & Live IoT Telemetry (TMS)**
   - In-transit GPS tracking with simulated IoT environmental telemetries (**Temperature**, **Humidity**, **Shock/Vibration**, and **Battery**).
   - Cold-chain compliance breach alerts dispatched automatically via **Amazon SNS**.

4. **⛓️ Immutable Blockchain Ledger & Smart Contracts**
   - SHA-256 Merkle chain tracking custody handovers between manufacturers, carriers, and receiving bays.
   - Automated `SC-COLD-CHAIN-SLA` smart contract that automatically verifies temperature compliance and locks/releases escrow funds ($25,000 USD).

5. **🤝 Supplier & Procurement Management**
   - Vendor performance ratings, on-time delivery metrics, purchase order (PO) approvals, and document attachments stored in **Amazon S3**.

6. **📊 SCM Control Tower & Demand Forecasting**
   - Central executive dashboard featuring stockout risk indicators, inventory turnover ratios, throughput trends, and AI-driven demand forecasting.

---

## ⛓️ Blockchain & Smart Contracts

```
  [Block #0: Genesis] ──SHA-256──> [Block #1: Purchase Order] ──SHA-256──> [Block #2: Cold-Chain SLA]
  ├─ Nonce: 104                    ├─ Escrow Initiated: $25k              ├─ Temp Verified: 4.1°C
  └─ Sig: 0x889...                 └─ Sig: 0x491...                       └─ Sig: 0x12a...
```

- **Cryptographic Provenance**: Every physical custody transfer is digitally signed with HMAC-SHA-256 keys and mined into a block.
- **Proof-of-Authority (PoA)**: Employs Amazon Managed Blockchain (AMB) / Hyperledger Fabric consensus for enterprise transaction speed.
- **Automated Escrow Enforcement**: If temperature drifts outside [2°C - 8°C], the smart contract immediately marks the state as `BREACH_DETECTED_ESCROW_FROZEN` on the immutable ledger.

---

## ☁️ AWS Cloud Architecture

```
                  +-------------------------------------------------------+
                  |               Client Web Dashboard (React)           |
                  +--------------------------+----------------------------+
                                             |  REST / WebSockets
                                             v
                  +-------------------------------------------------------+
                  |           API Gateway / Express REST Backend          |
                  +----+-------------+-------------+------------+----+----+
                       |             |             |            |    |
      +----------------v--+    +-----v------+  +---v-----+  +---v----+  +---v----+
      | Amazon DynamoDB   |    | Amazon S3  |  | Amazon  |  | Amazon |  | Amazon |
      | (Multi-Table /    |    | (Invoices, |  |   SQS   |  |   SNS  |  | Managed|
      |  Single-Table)    |    |  Shipment  |  | (Order  |  | (Alert |  | Block- |
      | - Inventory       |    |  Docs,     |  | Ingest &|  | & Stock|  |  chain |
      | - Orders          |    |  Telemetry |  | Worker  |  | Notifs)|  | Ledger |
      | - Shipments       |    |   Archive) |  | Queues) |  +--------+  +--------+
      | - Suppliers       |    +------------+  +---------+
      | - IoT Telemetry   |
      +-------------------+
```

---

## 🗂️ Project Structure

```
Multipurpose_Supply_Chain_Management/
├── .github/workflows/
│   ├── ci-cd.yml                    # Automated GitHub Actions Pipeline
│   └── deploy-gh-pages.yml          # GitHub Pages Live Deployment Workflow
├── terraform/                       # AWS Infrastructure as Code
│   ├── main.tf                      # DynamoDB, S3, SQS, SNS definitions
│   ├── variables.tf                 # Environment and AWS Region configurations
│   └── outputs.tf                   # Resource ARNs and endpoint outputs
├── server/                          # Backend API & AWS Services Layer
│   ├── src/
│   │   ├── config/aws.js            # AWS SDK v3 configurations (Live & Mock mode)
│   │   ├── controllers/             # REST controllers (Inventory, Orders, Blockchain)
│   │   ├── services/
│   │   │   ├── blockchainService.js # SHA-256 Merkle chain & Smart Contract Engine
│   │   │   ├── dynamoDbService.js
│   │   │   ├── s3StorageService.js
│   │   │   ├── sqsQueueService.js
│   │   │   ├── snsNotificationService.js
│   │   │   └── iotSimulatorService.js
│   │   ├── routes/api.js            # API routing specifications
│   │   └── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
├── client/                          # React + Tailwind CSS Web Control Tower
│   ├── src/
│   │   ├── components/              # UI components, badges, metrics cards
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # SCM Control Tower & Real-time KPIs
│   │   │   ├── Inventory.jsx        # Multi-facility Warehouse Inventory
│   │   │   ├── Orders.jsx           # Order Lifecycle & SQS Queue Monitor
│   │   │   ├── Shipments.jsx        # Live Shipment & IoT Cold-Chain Tracker
│   │   │   ├── Blockchain.jsx       # Visual Block Explorer & Smart Contracts
│   │   │   ├── Suppliers.jsx        # Procurement & Vendor Management
│   │   │   └── Architecture.jsx     # AWS Cloud Architecture Explorer
│   │   ├── services/api.js          # REST Client & in-browser simulator
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── generate-pptx.py             # 7-Slide Architecture PowerPoint generator
│   ├── generate_developer_manual.py # Publication-quality PDF manual generator
│   ├── seed-data.js                 # Realistic seed data for immediate demonstration
│   └── simulate-iot.js              # Live IoT sensor telemetry publisher
├── Developer_Manual.html            # One-click interactive browser developer manual
├── Multipurpose_SCM_Complete_Developer_Manual.pdf # Complete PDF Developer Manual
├── Multipurpose_SCM_AWS_Architecture.pptx         # Architecture Presentation
└── docker-compose.yml               # Multi-container local orchestration
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Node.js**: v18 or v20+
- **Git**
- *(Optional)* AWS CLI & AWS Credentials (The system includes an intelligent Mock AWS fallback so it can run immediately without cloud costs!)

### 1. Installation
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Running Locally
```bash
# Start backend server (Port 5000)
cd server
npm run dev

# In a new terminal, start frontend web dashboard (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
