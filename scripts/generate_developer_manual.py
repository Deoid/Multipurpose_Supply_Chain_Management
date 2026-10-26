#!/usr/bin/env python3
"""
Multipurpose Supply Chain Management - Comprehensive Developer Manual Generator
Generates a complete, deep-dive engineering PDF covering every architectural detail,
implementation step from 0 to production, data models, AWS services, and security practices.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

# Palette
PRIMARY_NAVY = HexColor("#0B1727")
SECONDARY_NAVY = HexColor("#1E293B")
AWS_ORANGE = HexColor("#FF9900")
AWS_BLUE = HexColor("#146EB4")
TEXT_DARK = HexColor("#0F172A")
TEXT_MUTED = HexColor("#475569")
BG_LIGHT = HexColor("#F8FAFC")
BORDER_LIGHT = HexColor("#E2E8F0")
ACCENT_GREEN = HexColor("#059669")
ACCENT_RED = HexColor("#DC2626")

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and print 'Page X of Y'"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        # Don't draw headers/footers on cover page
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)

        # Header
        self.drawString(54, 750, "Multipurpose Supply Chain Management — AWS Cloud Engineering Manual")
        self.setStrokeColor(BORDER_LIGHT)
        self.setLineWidth(0.5)
        self.line(54, 744, letter[0] - 54, 744)

        # Footer
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — DEVELOPER ARCHITECTURE SPECIFICATION")
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(letter[0] - 54, 32, page_str)
        self.restoreState()

def build_pdf(filename="Multipurpose_SCM_Complete_Developer_Manual.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY_NAVY,
        spaceAfter=10,
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=AWS_BLUE,
        spaceAfter=25,
    )

    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=TEXT_MUTED,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY_NAVY,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=AWS_ORANGE,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=SECONDARY_NAVY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=8,
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=15,
        spaceAfter=4,
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=HexColor('#0F172A'),
        backColor=HexColor('#F1F5F9'),
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8,
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12.5,
        textColor=SECONDARY_NAVY,
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("CLOUD ARCHITECTURE & ENGINEERING SPECIFICATION", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=AWS_ORANGE, spaceAfter=8)))
    story.append(Paragraph("Multipurpose Supply Chain Management Platform", title_style))
    story.append(Paragraph("End-to-End Architectural Blueprint, Implementation Manual, and AWS Cloud Engineering Guide from Ground Zero to Production", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=AWS_ORANGE, spaceBefore=0, spaceAfter=20))

    meta_text = """
    <b>Author / Lead Architect:</b> Hardik Jha<br/>
    <b>Target Cloud Environment:</b> Amazon Web Services (AWS) & Hybrid Mock Layer<br/>
    <b>Primary AWS Services:</b> Amazon DynamoDB, Amazon SQS (with DLQ), Amazon SNS, Amazon S3, AWS IoT Core<br/>
    <b>Infrastructure as Code:</b> HashiCorp Terraform (v1.5+)<br/>
    <b>Application Stack:</b> Node.js v20 (Express), React 18, Vite, Tailwind CSS, Lucide Icons, Recharts<br/>
    <b>Repository:</b> github.com/Deoid/Multipurpose_Supply_Chain_Management<br/>
    <b>Live URL:</b> deoid.github.io/Multipurpose_Supply_Chain_Management/<br/>
    <b>Document Classification:</b> Production Engineering Whitepaper (Technical Reference)
    """
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 30))

    # Executive Overview Callout
    callout_data = [[
        Paragraph(
            "<b>Architectural Directive:</b> This document provides an exhaustive, developer-grade breakdown "
            "of the Multipurpose Supply Chain Management system. It details why specific architectural decisions "
            "were chosen, how asynchronous event buses mitigate order spikes, how time-series IoT sensors enforce "
            "cold-chain compliance, the exact data schemas, and the complete security perimeter isolation model.",
            callout_style
        )
    ]]
    callout_table = Table(callout_data, colWidths=[letter[0] - 108])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, AWS_ORANGE),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(callout_table)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1: Problem Statement & Multipurpose Scope
    # =========================================================================
    story.append(Paragraph("1. Executive Problem Statement & Multipurpose Scope", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("1.1 The Operational Crisis in Modern Global Supply Chains", h2_style))
    story.append(Paragraph(
        "Modern enterprise supply chains face unprecedented challenges. Traditional supply chain management (SCM) "
        "software is overwhelmingly monolithic, synchronous, and siloed. When thousands of purchase orders arrive simultaneously "
        "during high-demand periods, relational database connections lock up, transaction timeouts occur, and orders drop without warning. "
        "Furthermore, for perishable items (such as pharmaceutical vaccines, biologics, and premium foods), lack of real-time environmental "
        "monitoring results in billions of dollars in thermal spoilage before products reach the receiving dock.",
        body_style
    ))

    story.append(Paragraph("1.2 The 'Multipurpose' Architectural Requirement", h2_style))
    story.append(Paragraph(
        "A true 'multipurpose' SCM platform cannot be constrained to a single cargo type. Different industrial verticals have drastically "
        "different physical and data requirements. Our architecture unifies four major supply chain categories under one cloud platform:",
        body_style
    ))

    verticals_table_data = [
        [Paragraph("<b>Vertical</b>", body_style), Paragraph("<b>Physical Requirements</b>", body_style), Paragraph("<b>Cloud & Telemetry Enforcements</b>", body_style)],
        [
            Paragraph("<b>Pharmaceutical Cold-Chain</b>", body_style),
            Paragraph("Strict 2°C to 8°C thermal buffer; ultra-cold -20°C to -80°C cryogenic storage for mRNA biologics.", body_style),
            Paragraph("AWS IoT rules evaluate continuous temperature streams. Deviations (>8°C or <2°C) trigger Amazon SNS instant alert fanout.", body_style)
        ],
        [
            Paragraph("<b>High-Tech Semiconductors</b>", body_style),
            Paragraph("Electrostatic Discharge (ESD) cleanrooms, low humidity, severe shock and vibration safeguards.", body_style),
            Paragraph("High-frequency accelerometer tracking. Shock events >4.5G trigger transit inspection warnings.", body_style)
        ],
        [
            Paragraph("<b>Industrial Machinery</b>", body_style),
            Paragraph("Heavy servo motors, complex parts catalogues, multi-tier purchase orders, and long lead times.", body_style),
            Paragraph("Supplier SLA reliability ratings, automated purchase order creation, and immutable S3 document archiving.", body_style)
        ],
        [
            Paragraph("<b>Biotechnology Assays</b>", body_style),
            Paragraph("Light-sensitive reagents, diagnostic PCR kits, batch-lot tracking with strict shelf-life expiry.", body_style),
            Paragraph("Dynamic safety stock calculations and low-stock automatic reorder alerts via DynamoDB.", body_style)
        ],
    ]
    v_table = Table(verticals_table_data, colWidths=[120, 180, 204])
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(v_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # CHAPTER 2: Cloud Architecture & Component Topography
    # =========================================================================
    story.append(Paragraph("2. System Architecture & AWS Cloud Topography", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("2.1 High-Level Architecture Topology", h2_style))
    story.append(Paragraph(
        "The architecture is designed around an <b>event-driven, decoupled microservices paradigm</b>. "
        "Client requests never directly execute slow disk transactions or synchronous vendor dependencies. Instead, requests enter "
        "scalable AWS buffers that absorb massive volume spikes with zero data loss.",
        body_style
    ))

    arch_diagram_code = """
+---------------------------------------------------------------------------------+
|                       React 18 Single Page Application                          |
|         (Hosted on GitHub Pages CDN / S3 Static Web Hosting + CloudFront)       |
+----------------------------------------+----------------------------------------+
                                         | REST / HTTPS JSON
                                         v
+---------------------------------------------------------------------------------+
|                     API Gateway / Express.js REST Microservice                  |
+----------+-----------------+-------------------+----------------+---------------+
           |                 |                   |                |
           v                 v                   v                v
+--------------------+ +-----------+     +---------------+ +--------------+
|  Amazon DynamoDB   | | Amazon S3 |     |  Amazon SQS   | |  Amazon SNS  |
|  - scm-inventory   | | Documents |     |  Orders Queue | | Alert Topic  |
|  - scm-orders      | | Invoices  |     |   (with DLQ)  | | Email / SMS  |
|  - scm-shipments   | |  Proofs   |     +-------+-------+ +--------------+
|  - scm-suppliers   | +-----------+             |
|  - scm-telemetry   |                           v
+--------------------+                 +-------------------+
                                       | Background Worker |
                                       |  (Lambda / ECS)   |
                                       +-------------------+
    """
    story.append(Paragraph(arch_diagram_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("2.2 Deep Dive: Individual AWS Services & Roles", h2_style))
    
    aws_breakdown = [
        ("Amazon DynamoDB (Operational Store)", "Chosen for predictable single-digit millisecond latency at any throughput scale. Uses composite primary keys (Partition Key + Sort Key) and Global Secondary Indexes (GSIs). An automated Time-to-Live (TTL) attribute is assigned to IoT telemetry records to automatically prune aging time-series without incurred write/delete IOPS costs."),
        ("Amazon SQS (Decoupled Message Queue)", "Acts as the shock-absorber for order placement. Ingests high-concurrency order spikes into a durable buffer. Configured with a visibility timeout of 60 seconds, long-polling (10s) to minimize empty receives, and a Dead-Letter Queue (DLQ) with maxReceiveCount = 3 to quarantine malformed messages without blocking the queue."),
        ("Amazon SNS (Pub/Sub Notification Engine)", "Provides instant multi-channel alert fanout. Subscribed endpoints (such as cold-chain logistics operations emails, mobile SMS, or automated webhooks) receive immediate notification when IoT sensors detect temperature violations or stock is below safety levels."),
        ("Amazon S3 (Immutable Document Lake)", "Provides 99.999999999% (11 9s) durability for compliance artifacts. Stores digital purchase invoices, bills of lading, and signature receipts. Server-Side Encryption (SSE-S3 AES-256) and bucket versioning protect documents against tampering or accidental deletion."),
        ("AWS IoT Core & Rules Engine", "Simulates and ingests telemetry emitted from GPS/cellular beacons attached to cargo trucks. A rules engine parses sensor payloads and immediately diverts critical anomalies to SNS while archiving continuous metrics into DynamoDB."),
    ]
    for s_name, s_desc in aws_breakdown:
        story.append(Paragraph(f"• <b>{s_name}:</b> {s_desc}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3: Step-by-Step Implementation Journey (0 to Production)
    # =========================================================================
    story.append(Paragraph("3. Step-by-Step Engineering Journey (From Zero to Production)", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph(
        "The project was engineered modularly across distinct phases, with atomic Git commits marking each milestone. "
        "Below is the exact chronological implementation journey executed by the development team:",
        body_style
    ))

    phases = [
        ("Phase 1: Project Scaffolding, Governance & Root CI/CD", 
         "Git commit: eb4ecc5<br/>"
         "Initialized git repository, root package.json workspace scripts, exhaustive .gitignore (preventing credential leakage), "
         "MIT License, and GitHub Actions CI/CD workflow (.github/workflows/ci-cd.yml) validating Node syntax, npm dependencies, and Terraform formatting."),
        
        ("Phase 2: Infrastructure as Code (HashiCorp Terraform)", 
         "Git commit: c6e5c57<br/>"
         "Authored terraform/main.tf, variables.tf, lambda.tf, and outputs.tf. Created declarative specifications for 5 DynamoDB tables, "
         "S3 document storage with public access blocks and SSE-AES256, SQS queue with redrive policy targeting a dedicated Dead-Letter Queue (DLQ), "
         "and SNS alerts topic. Added least-privilege IAM policies granting Lambda strictly necessary DynamoDB, SQS, S3, and SNS permissions."),
        
        ("Phase 3: Backend REST API with AWS SDK v3 & Hybrid Mock Adapter", 
         "Git commit: f46c2c1<br/>"
         "Built express REST API in server/src/. Implemented AWS SDK v3 clients (@aws-sdk/client-dynamodb, lib-dynamodb, client-sqs, client-sns, client-s3). "
         "Engineered an intelligent hybrid layer (aws.js): when AWS credentials exist, it communicates with live cloud resources; when offline or in demo mode, "
         "it activates a zero-cost local in-memory AWS Adapter that accurately replicates DynamoDB query semantics, SQS worker polling, and SNS alerts."),
        
        ("Phase 4: Frontend Supply Chain Control Tower (React 18 + Vite)", 
         "Git commit: 134c0ef<br/>"
         "Constructed responsive UI with Tailwind CSS, Lucide icons, and Recharts. Implemented SCM Control Tower, Multi-facility Warehouse inventory viewer, "
         "Asynchronous SQS order queue visualizer with interactive worker polling, live IoT Cold-Chain sensor telemetry monitor with temperature charts, "
         "and an interactive AWS Architecture documentation explorer."),
        
        ("Phase 5: Containerization, CLI Simulator & Seed Data", 
         "Git commit: 294ada6<br/>"
         "Authored multi-stage Dockerfiles for both server (Node 20 Alpine) and client (Nginx reverse-proxy on Alpine). Added docker-compose.yml "
         "for one-command orchestration. Developed scripts/simulate-iot.js (streaming telemetry along a simulated highway route) and scripts/seed-data.js."),
        
        ("Phase 6: GitHub Pages Automated Deployment & In-Browser Cloud Simulator", 
         "Git commits: 63bf77e, 4dba302, fdfe430<br/>"
         "Engineered a dedicated GitHub Actions workflow (.github/workflows/deploy-gh-pages.yml) using peaceiris/actions-gh-pages@v4. "
         "Added an in-browser client-side simulator in client/src/services/api.js so the live web app functions 100% interactively on GitHub Pages without requiring an external backend!"),
    ]

    for p_title, p_desc in phases:
        story.append(Paragraph(f"<b>{p_title}</b>", h3_style))
        story.append(Paragraph(p_desc, body_style))
        story.append(Spacer(1, 4))

    # =========================================================================
    # CHAPTER 4: Data Models & Schema Design
    # =========================================================================
    story.append(Paragraph("4. Data Models, DynamoDB Schemas & Document Storage", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("4.1 DynamoDB Table Schemas", h2_style))
    story.append(Paragraph(
        "DynamoDB is a NoSQL key-value and document database. Below are the schema definitions and indexing strategies:",
        body_style
    ))

    schema_data = [
        [Paragraph("<b>Table Name</b>", body_style), Paragraph("<b>Partition Key (PK)</b>", body_style), Paragraph("<b>Sort Key (SK)</b>", body_style), Paragraph("<b>GSIs / TTL</b>", body_style)],
        [
            Paragraph("scm-inventory", body_style),
            Paragraph("warehouseId (S)", body_style),
            Paragraph("sku (S)", body_style),
            Paragraph("CategoryIndex on 'category' for fast cross-warehouse category filters.", body_style)
        ],
        [
            Paragraph("scm-orders", body_style),
            Paragraph("orderId (S)", body_style),
            Paragraph("None", body_style),
            Paragraph("StatusCreatedAtGSI on 'status' + 'createdAt' for pipeline stage queries.", body_style)
        ],
        [
            Paragraph("scm-shipments", body_style),
            Paragraph("shipmentId (S)", body_style),
            Paragraph("None", body_style),
            Paragraph("OrderIdIndex and StatusIndex for fast logistics relationship lookups.", body_style)
        ],
        [
            Paragraph("scm-iot-telemetry", body_style),
            Paragraph("shipmentId (S)", body_style),
            Paragraph("timestamp (S)", body_style),
            Paragraph("Attribute 'ttl' enabled with 30-day epoch expiration for automatic data aging.", body_style)
        ],
        [
            Paragraph("scm-suppliers", body_style),
            Paragraph("supplierId (S)", body_style),
            Paragraph("None", body_style),
            Paragraph("Master profile storage for vendor rating, lead time, and contract status.", body_style)
        ],
    ]
    s_table = Table(schema_data, colWidths=[100, 110, 85, 209])
    s_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(s_table)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5: Messaging & IoT Rules Engine Deep Dive
    # =========================================================================
    story.append(Paragraph("5. Event-Driven Messaging & IoT Telemetry Processing", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("5.1 Asynchronous SQS Order Queue Workflow", h2_style))
    story.append(Paragraph(
        "When an order is created, the system executes three coordinated actions:<br/>"
        "1. <b>Write to DynamoDB</b> with status = <code>QUEUED</code>.<br/>"
        "2. <b>Dispatch message to Amazon SQS</b> (multipurpose-scm-orders-queue) containing order metadata and priority.<br/>"
        "3. <b>Archive invoice document to Amazon S3</b> under <code>invoices/{orderId}.json</code>.<br/>"
        "Background fulfillment workers poll the queue via <code>ReceiveMessageCommand</code> with 10-second long polling. "
        "Upon successful processing, the order status transitions to <code>PROCESSING</code> and the message is deleted from the queue via <code>DeleteMessageCommand</code>.",
        body_style
    ))

    story.append(Paragraph("5.2 IoT Cold-Chain Anomaly Detection & Rule Engine", h2_style))
    story.append(Paragraph(
        "Vehicles transmit telemetry containing temperature, humidity, shock, and GPS location. "
        "The backend service (<code>iotSimulatorService.js</code>) evaluates real-time telemetry against threshold rules:",
        body_style
    ))

    code_rule = """
// Cold-Chain Threshold Rule: Safe pharmaceutical range [2°C to 8°C]
if (temperature < tempThresholdMin || temperature > tempThresholdMax) {
  await snsNotificationService.publishAlert(
    `Critical Cold-Chain Temperature Breach on Shipment #${shipmentId}`,
    `Current temperature is ${temperature}°C, outside safe range [${tempThresholdMin}°C - ${tempThresholdMax}°C]. Location: ${location.city}.`,
    'CRITICAL',
    { shipmentId, temperature, category }
  );
} else if (shock > 4.5) {
  // Mechanical Impact / Severe Road Pothole Rule
  await snsNotificationService.publishAlert(
    `High Shock / Vibration Event on Shipment #${shipmentId}`,
    `Impact of ${shock}G detected. Package inspection required upon delivery.`,
    'WARNING',
    { shipmentId, shock, category }
  );
}
    """
    story.append(Paragraph(code_rule.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # =========================================================================
    # CHAPTER 6: Security, Secrets & Public vs. Private Infrastructure
    # =========================================================================
    story.append(Paragraph("6. Cloud Security, Secrets Management & IaC Governance", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("6.1 Why Terraform Code and CLI Commands Are Safe in Public Repositories", h2_style))
    story.append(Paragraph(
        "A common concern among developers is whether publishing Terraform code and CLI commands (e.g. <code>terraform apply</code>) "
        "poses a security vulnerability. <b>The answer is an unequivocal NO.</b>",
        body_style
    ))

    sec_points = [
        ("Infrastructure Code is a Blueprint, Not a Key", "HCL code describes WHAT resources to create (e.g., 'create an S3 bucket named xyz'). It does not grant anyone access to your AWS account. Only an authenticated AWS Identity (configured locally on the developer's computer) has access."),
        ("Strict .gitignore Isolation", "All files containing actual runtime credentials or state are permanently ignored by Git: <code>.env</code>, <code>*.tfstate</code>, <code>*.tfstate.backup</code>, and <code>*.tfvars</code>. No AWS access keys or secret keys ever touch Git."),
        ("Least-Privilege IAM Roles", "Terraform creates IAM execution policies with explicit Resource ARNs. The Lambda service role can only access the specific SCM tables and queues, eliminating lateral privilege escalation."),
        ("S3 Public Access Block", "The S3 bucket configuration explicitly enables all four Amazon S3 Public Access Blocks (BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets) alongside SSE-S3 AES-256 encryption."),
    ]
    for sp_title, sp_desc in sec_points:
        story.append(Paragraph(f"• <b>{sp_title}:</b> {sp_desc}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 7: Developer Runbook & Verification Guide
    # =========================================================================
    story.append(Paragraph("7. Developer Runbook & Local Execution Guide", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=10))

    story.append(Paragraph("7.1 Running the Project Locally", h2_style))
    story.append(Paragraph(
        "The project includes an intelligent mock AWS adapter so that any engineer can run the system immediately "
        "without incurring AWS billing or configuring credentials:",
        body_style
    ))

    runbook_commands = """
# 1. Start Backend API Server (Port 5000)
cd server
npm install
npm run dev

# 2. Start Frontend Web Dashboard (Port 5173) in a second terminal
cd client
npm install
npm run dev

# 3. (Optional) Run Live IoT Vehicle Telemetry Stream in a third terminal
node scripts/simulate-iot.js
    """
    story.append(Paragraph(runbook_commands.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("7.2 Connecting to Live AWS Cloud Services", h2_style))
    story.append(Paragraph(
        "To switch from the local mock adapter to live AWS Cloud services:<br/>"
        "1. Configure your AWS CLI credentials: <code>aws configure</code><br/>"
        "2. Provision the AWS infrastructure via Terraform:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>cd terraform && terraform init && terraform apply</code><br/>"
        "3. Copy the Terraform output ARNs and Table names into <code>server/.env</code>:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>AWS_MOCK=false</code><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>AWS_REGION=us-east-1</code><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>AWS_ACCESS_KEY_ID=AKIA...</code><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<code>AWS_SECRET_ACCESS_KEY=...</code><br/>"
        "4. Restart the backend server. The system automatically detects the credentials and routes all traffic to live AWS DynamoDB, SQS, SNS, and S3!",
        body_style
    ))

    story.append(Spacer(1, 15))
    story.append(Paragraph("7.3 Conclusion & Architectural Verification", h2_style))
    story.append(Paragraph(
        "This Multipurpose Supply Chain Management platform demonstrates how modern AWS Cloud services resolve the fundamental "
        "flaws of traditional logistics systems. By combining asynchronous SQS queues for zero-order drops, DynamoDB for sub-millisecond stock ledgers, "
        "IoT telemetry rules for cold-chain compliance, and Terraform for deterministic cloud provisioning, the system provides a production-ready "
        "foundation capable of scaling across global enterprise supply chains.",
        body_style
    ))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Developer Manual PDF generated successfully at: {os.path.abspath(filename)}")

if __name__ == '__main__':
    build_pdf()
