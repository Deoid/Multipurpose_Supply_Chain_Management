# 🌐 Multipurpose Supply Chain Management (SCM) Cloud Platform
> **Enterprise-grade, Event-Driven Supply Chain Management System architected on AWS Cloud Services**

[![AWS Architecture](https://img.shields.io/badge/AWS-DynamoDB%20%7C%20S3%20%7C%20SQS%20%7C%20SNS%20%7C%20IoT%20Core-FF9900?logo=amazon-aws&logoColor=white)](#aws-cloud-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?logo=terraform&logoColor=white)](https://www.terraform.io)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
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

It integrates directly with AWS managed services for high availability, sub-millisecond document lookups, decoupled event queues, real-time alert broadcasts, and IoT sensor streams.

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

4. **🤝 Supplier & Procurement Management**
   - Vendor performance ratings, on-time delivery metrics, purchase order (PO) approvals, and document attachments stored in **Amazon S3**.

5. **📊 SCM Control Tower & Demand Forecasting**
   - Central executive dashboard featuring stockout risk indicators, inventory turnover ratios, throughput trends, and AI-driven demand forecasting.

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
                  +-------+-------------+-------------+------------+------+
                          |             |             |            |
         +----------------v--+    +-----v------+  +---v-----+  +---v-----+
         | Amazon DynamoDB   |    | Amazon S3  |  | Amazon  |  | Amazon  |
         | (Multi-Table /    |    | (Invoices, |  |   SQS   |  |   SNS   |
         |  Single-Table)    |    |  Shipment  |  | (Order  |  | (Alert  |
         | - Inventory       |    |  Docs,     |  | Ingest &|  | & Stock |
         | - Orders          |    |  Telemetry |  | Worker  |  | Notifs) |
         | - Shipments       |    |   Archive) |  | Queues) |  +---------+
         | - Suppliers       |    +------------+  +---------+
         | - IoT Telemetry   |
         +-------------------+
```

- **Amazon DynamoDB**: Low-latency NoSQL database for fast item lookups, orders, and telemetry timeseries records.
- **Amazon S3**: Secure object storage for digital purchase orders, customs declarations, and logistics invoices.
- **Amazon SQS**: Decouples order spikes from fulfillment workers, ensuring zero data loss during high throughput.
- **Amazon SNS**: Instant multi-channel alert fanout (SMS / Email / Webhook) when temperature thresholds or stockout limits are breached.
- **AWS IoT Core / Simulator**: Ingests high-frequency device metrics for real-time fleet asset tracking.

---

## 🗂️ Project Structure

```
Multipurpose_Supply_Chain_Management/
├── .github/workflows/ci-cd.yml      # Automated GitHub Actions Pipeline
├── terraform/                       # AWS Infrastructure as Code
│   ├── main.tf                      # DynamoDB, S3, SQS, SNS definitions
│   ├── variables.tf                 # Environment and AWS Region configurations
│   └── outputs.tf                   # Resource ARNs and endpoint outputs
├── server/                          # Backend API & AWS Services Layer
│   ├── src/
│   │   ├── config/aws.js            # AWS SDK v3 configurations (Live & Mock mode)
│   │   ├── controllers/             # REST controllers for Inventory, Orders, etc.
│   │   ├── services/                # AWS DynamoDB, S3, SQS, SNS integrations
│   │   ├── routes/api.js            # API routing specifications
│   │   └── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
├── client/                          # React + Tailwind CSS Web Control Tower
│   ├── src/
│   │   ├── components/              # UI components, badges, metrics cards
│   │   ├── pages/                   # Control Tower, Inventory, Orders, Shipments, etc.
│   │   ├── services/api.js          # REST Client API connectors
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── seed-data.js                 # Realistic seed data for immediate demonstration
│   └── simulate-iot.js              # Live IoT sensor telemetry publisher
└── docker-compose.yml               # Multi-container local orchestration
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Node.js**: v18 or v20+
- **Git**
- *(Optional)* AWS CLI & AWS Credentials (The system includes an intelligent Mock AWS fallback so it can run immediately without cloud costs!)

### 1. Installation
Clone the repository and install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Running Locally
From the root directory:
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

## 🔄 GitHub Setup & Synchronization

To connect this local repository with your GitHub account:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Set Repository Name: `Multipurpose_Supply_Chain_Management`
   - Choose **Public** or **Private**
   - Do **NOT** initialize with README or .gitignore (we have already created them!)
   - Click **Create repository**

2. **Add Remote and Push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/Multipurpose_Supply_Chain_Management.git
   git push -u origin main
   ```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
