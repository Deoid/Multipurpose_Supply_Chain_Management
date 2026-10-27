#!/usr/bin/env python3
"""
Multipurpose Supply Chain Management - Comprehensive Developer Manual Generator
Generates a complete, deep-dive engineering PDF covering every architectural detail,
implementation step from 0 to production, data models, AWS services, blockchain ledger,
smart contracts, and security practices.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
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
ACCENT_PURPLE = HexColor("#7E22CE")

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
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)

        # Header
        self.drawString(54, 750, "Multipurpose SCM — AWS Cloud & Blockchain Engineering Manual")
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

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY_NAVY,
        spaceAfter=10,
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=AWS_BLUE,
        spaceAfter=20,
    )

    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=TEXT_MUTED,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY_NAVY,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=AWS_ORANGE,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True,
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=SECONDARY_NAVY,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        spaceAfter=7,
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=TEXT_DARK,
        leftIndent=14,
        spaceAfter=3,
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=HexColor('#0F172A'),
        backColor=HexColor('#F1F5F9'),
        borderPadding=5,
        spaceBefore=5,
        spaceAfter=7,
    )

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("CLOUD & BLOCKCHAIN ARCHITECTURE SPECIFICATION", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=AWS_ORANGE, spaceAfter=8)))
    story.append(Paragraph("Multipurpose Supply Chain Management Platform", title_style))
    story.append(Paragraph("End-to-End Architectural Blueprint, Implementation Manual, AWS Cloud Services, and Cryptographic Blockchain Smart Contracts", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=AWS_ORANGE, spaceBefore=0, spaceAfter=18))

    meta_text = """
    <b>Author / Lead Architect:</b> Hardik Jha<br/>
    <b>Cloud Infrastructure:</b> Amazon Web Services (DynamoDB, SQS, SNS, S3, IoT Core, IAM)<br/>
    <b>Blockchain Engine:</b> SHA-256 Merkle Chain, Proof-of-Authority (PoA) / Amazon Managed Blockchain<br/>
    <b>Smart Contracts:</b> Cold-Chain Compliance & Escrow Release Contract (SC-COLD-CHAIN-SLA)<br/>
    <b>Infrastructure as Code:</b> HashiCorp Terraform (v1.5+)<br/>
    <b>Application Stack:</b> Node.js v20 (Express), React 18, Vite, Tailwind CSS, Lucide Icons, Recharts<br/>
    <b>Repository:</b> github.com/Deoid/Multipurpose_Supply_Chain_Management<br/>
    <b>Live URL:</b> deoid.github.io/Multipurpose_Supply_Chain_Management/<br/>
    <b>Document Classification:</b> Production Engineering Whitepaper (Technical Reference)
    """
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 20))

    callout_data = [[
        Paragraph(
            "<b>Architectural Directive:</b> This document provides an exhaustive, developer-grade breakdown "
            "of the Multipurpose Supply Chain Management system. It details why specific architectural decisions "
            "were chosen, how asynchronous event buses mitigate order spikes, how time-series IoT sensors enforce "
            "cold-chain compliance, how the cryptographic Blockchain ledger guarantees immutable chain-of-custody, "
            "and the complete security perimeter isolation model.",
            ParagraphStyle('CalloutText', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8.8, leading=12, textColor=SECONDARY_NAVY)
        )
    ]]
    callout_table = Table(callout_data, colWidths=[letter[0] - 108])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, AWS_ORANGE),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1: Problem Statement & Multipurpose Scope
    # =========================================================================
    story.append(Paragraph("1. Executive Problem Statement & Multipurpose Scope", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

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
        [Paragraph("<b>Vertical</b>", body_style), Paragraph("<b>Physical Requirements</b>", body_style), Paragraph("<b>Cloud & Blockchain Enforcements</b>", body_style)],
        [
            Paragraph("<b>Pharmaceutical Cold-Chain</b>", body_style),
            Paragraph("Strict 2°C to 8°C thermal buffer; ultra-cold -20°C to -80°C cryogenic storage for mRNA biologics.", body_style),
            Paragraph("AWS IoT rules evaluate continuous temperature streams. Deviations (>8°C or <2°C) trigger Amazon SNS alerts and freeze smart contract escrow on the blockchain.", body_style)
        ],
        [
            Paragraph("<b>High-Tech Semiconductors</b>", body_style),
            Paragraph("Electrostatic Discharge (ESD) cleanrooms, low humidity, severe shock and vibration safeguards.", body_style),
            Paragraph("High-frequency accelerometer tracking. Shock events >4.5G trigger transit inspection warnings on the immutable ledger.", body_style)
        ],
        [
            Paragraph("<b>Industrial Machinery</b>", body_style),
            Paragraph("Heavy servo motors, complex parts catalogues, multi-tier purchase orders, and long lead times.", body_style),
            Paragraph("Supplier SLA reliability ratings, automated purchase order creation, and immutable S3 document archiving.", body_style)
        ],
        [
            Paragraph("<b>Biotechnology Assays</b>", body_style),
            Paragraph("Light-sensitive reagents, diagnostic PCR kits, batch-lot tracking with strict shelf-life expiry.", body_style),
            Paragraph("Dynamic safety stock calculations, low-stock reorder alerts, and cryptographically verified custody transfers.", body_style)
        ],
    ]
    v_table = Table(verticals_table_data, colWidths=[115, 180, 209])
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(v_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 2: Blockchain & Smart Contract Architecture
    # =========================================================================
    story.append(Paragraph("2. Blockchain Ledger & Smart Contract Implementation", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

    story.append(Paragraph("2.1 The Multi-Party Trust Problem in Global Logistics", h2_style))
    story.append(Paragraph(
        "In global supply chains, goods pass through manufacturers, freight carriers, customs checkpoints, and regional distribution hubs. "
        "Traditional databases are maintained by a single entity who has write access and can alter records after transit disputes occur. "
        "To establish absolute multi-party trust, our platform integrates an <b>Immutable Cryptographic Blockchain Ledger</b> powered by SHA-256 Merkle chains "
        "and Proof-of-Authority (PoA) consensus (matching the architecture of Amazon Managed Blockchain and Hyperledger Fabric).",
        body_style
    ))

    story.append(Paragraph("2.2 Block Structure & Cryptographic Mining", h2_style))
    story.append(Paragraph(
        "Each block is cryptographically linked to its predecessor via SHA-256 hashing. Modifying any historical block alters its hash and immediately "
        "invalidates the entire chain:",
        body_style
    ))

    chain_code = """
class Block {
  constructor(index, timestamp, transactions, previousHash = '', nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions; // Custody transfers, Smart Contract events
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const dataString = this.index + this.previousHash + this.timestamp +
                       JSON.stringify(this.transactions) + this.nonce;
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
}
    """
    story.append(Paragraph(chain_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("2.3 Automated Cold-Chain Escrow Smart Contracts", h2_style))
    story.append(Paragraph(
        "The system deploys the <code>SC-COLD-CHAIN-SLA</code> smart contract. As IoT sensors transmit temperature readings along shipping routes, "
        "an automated Oracle node evaluates the contract conditions. If the temperature exceeds safe limits (>8°C), the smart contract automatically "
        "freezes the escrow pool ($25,000 USD) and records an immutable breach transaction onto the blockchain.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3: Cloud Architecture & Topography
    # =========================================================================
    story.append(Paragraph("3. System Architecture & AWS Cloud Topography", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

    story.append(Paragraph("3.1 High-Level Architecture Topology", h2_style))
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
+--------------------+ +-----------+     +---------------+ +----------------------+
|  Amazon DynamoDB   | | Amazon S3 |     |  Amazon SQS   | |  Blockchain Ledger   |
|  - scm-inventory   | | Documents |     |  Orders Queue | |  - SHA-256 Merkle    |
|  - scm-orders      | | Invoices  |     |   (with DLQ)  | |  - Smart Contracts   |
|  - scm-shipments   | |  Proofs   |     +-------+-------+ |  - Escrow Pools      |
|  - scm-suppliers   | +-----------+             |         +----------------------+
|  - scm-telemetry   |                           v
+--------------------+                 +-------------------+
                                       | Background Worker |
                                       |  (Lambda / ECS)   |
                                       +-------------------+
    """
    story.append(Paragraph(arch_diagram_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("3.2 Deep Dive: Individual AWS Services & Roles", h2_style))
    aws_breakdown = [
        ("Amazon DynamoDB (Operational Store)", "Chosen for predictable single-digit millisecond latency at any throughput scale. Uses composite primary keys (Partition Key + Sort Key) and Global Secondary Indexes (GSIs). An automated Time-to-Live (TTL) attribute is assigned to IoT telemetry records to automatically prune aging time-series without incurred write/delete IOPS costs."),
        ("Amazon SQS (Decoupled Message Queue)", "Acts as the shock-absorber for order placement. Ingests high-concurrency order spikes into a durable buffer. Configured with a visibility timeout of 60 seconds, long-polling (10s) to minimize empty receives, and a Dead-Letter Queue (DLQ) with maxReceiveCount = 3 to quarantine malformed messages without blocking the queue."),
        ("Amazon SNS (Pub/Sub Notification Engine)", "Provides instant multi-channel alert fanout. Subscribed endpoints (such as cold-chain logistics operations emails, mobile SMS, or automated webhooks) receive immediate notification when IoT sensors detect temperature violations or stock is below safety levels."),
        ("Amazon S3 (Immutable Document Lake)", "Provides 99.999999999% (11 9s) durability for compliance artifacts. Stores digital purchase invoices, bills of lading, and signature receipts. Server-Side Encryption (SSE-S3 AES-256) and bucket versioning protect documents against tampering or accidental deletion."),
        ("Amazon Managed Blockchain (AMB)", "Provides immutable multi-party ledger storage, validating digital HMAC-SHA-256 custody signatures across suppliers, logistics carriers, and warehouse inspectors."),
    ]
    for s_name, s_desc in aws_breakdown:
        story.append(Paragraph(f"• <b>{s_name}:</b> {s_desc}", bullet_style))

    # =========================================================================
    # CHAPTER 4: Step-by-Step Implementation Journey (0 to Production)
    # =========================================================================
    story.append(Paragraph("4. Step-by-Step Engineering Journey (From Zero to Production)", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

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

        ("Phase 7: Cryptographic Blockchain Ledger & Smart Contracts",
         "Added blockchainService.js, blockchainController.js, and client/src/pages/Blockchain.jsx with live block explorer, "
         "Merkle SHA-256 chain verification, automated escrow execution, and digital custody handover signatures."),
    ]

    for p_title, p_desc in phases:
        story.append(Paragraph(f"<b>{p_title}</b>", h3_style))
        story.append(Paragraph(p_desc, body_style))
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5: Security, Secrets & Public vs. Private Infrastructure
    # =========================================================================
    story.append(Paragraph("5. Cloud Security, Secrets Management & IaC Governance", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

    story.append(Paragraph("5.1 Why Terraform Code and CLI Commands Are Safe in Public Repositories", h2_style))
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

    # =========================================================================
    # CHAPTER 6: Developer Runbook & Verification Guide
    # =========================================================================
    story.append(Paragraph("6. Developer Runbook & Local Execution Guide", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceAfter=8))

    story.append(Paragraph("6.1 Running the Project Locally", h2_style))
    story.append(Paragraph(
        "The project includes an intelligent mock AWS adapter so that any engineer can run the system immediately "
        "without incurring AWS billing or configuring credentials:",
        body_style
    ))

    runbook_commands = """
# 1. Start Backend API Server (Port 5000)
cd server && npm install && npm run dev

# 2. Start Frontend Web Dashboard (Port 5173) in a second terminal
cd client && npm install && npm run dev

# 3. (Optional) Run Live IoT Vehicle Telemetry Stream in a third terminal
node scripts/simulate-iot.js
    """
    story.append(Paragraph(runbook_commands.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("6.2 Viewing the Documentation", h2_style))
    story.append(Paragraph(
        "• <b>Developer_Manual.html</b>: Double-click to open immediately in Google Chrome, Microsoft Edge, or Safari.<br/>"
        "• <b>Multipurpose_SCM_Complete_Developer_Manual.pdf</b>: Open with Adobe Acrobat Reader, Chrome, or Edge (Right Click ➔ Open with ➔ Chrome).<br/>"
        "• <b>Multipurpose_SCM_AWS_Architecture.pptx</b>: Open directly in Microsoft PowerPoint or Google Slides.",
        body_style
    ))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Developer Manual PDF updated successfully at: {os.path.abspath(filename)}")

if __name__ == '__main__':
    build_pdf()
