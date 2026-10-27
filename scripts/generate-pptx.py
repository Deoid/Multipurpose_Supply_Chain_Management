import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    BG_COLOR = RGBColor(11, 17, 32)        # Slate 950 #0B1120
    CARD_BG = RGBColor(26, 36, 56)         # Slate 800 #1A2438
    AWS_ORANGE = RGBColor(255, 153, 0)     # #FF9900
    TEXT_WHITE = RGBColor(241, 245, 249)   # Slate 100
    TEXT_MUTED = RGBColor(148, 163, 184)   # Slate 400
    ACCENT_CYAN = RGBColor(34, 211, 238)   # Cyan 400
    ACCENT_GREEN = RGBColor(52, 211, 153)  # Emerald 400
    ACCENT_PURPLE = RGBColor(168, 85, 247) # Purple 500

    def set_bg(slide):
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()
        return bg_shape

    def add_header(slide, title_text, category_text="AWS CLOUD & BLOCKCHAIN PLATFORM"):
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = category_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = AWS_ORANGE

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    accent = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(3.8), Inches(0.45))
    accent.fill.solid()
    accent.fill.fore_color.rgb = CARD_BG
    accent.line.color.rgb = AWS_ORANGE
    p = accent.text_frame.paragraphs[0]
    p.text = "☁️ AWS ENTERPRISE CLOUD + BLOCKCHAIN"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = AWS_ORANGE

    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(3.2))
    tf = tbox.text_frame
    tf.word_wrap = True

    p1 = tf.paragraphs[0]
    p1.text = "Multipurpose Supply Chain\nManagement Platform"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = "\nEvent-Driven Cloud Architecture with AWS Cloud Services & Cryptographic Blockchain Ledger"
    p2.font.size = Pt(17)
    p2.font.color.rgb = ACCENT_CYAN

    cards = [
        ("NoSQL DynamoDB & SQS", "Sub-10ms stock ledgers & decoupled async order queue buffer"),
        ("IoT Cold-Chain Stream", "Real-time sensor telemetry & automated Amazon SNS breach alerts"),
        ("Immutable Blockchain", "SHA-256 Merkle chain, PoA consensus & automated escrow smart contracts"),
    ]
    for i, (head, desc) in enumerate(cards):
        cx = Inches(0.8 + (i * 3.95))
        cshape = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(5.2), Inches(3.7), Inches(1.5))
        cshape.fill.solid()
        cshape.fill.fore_color.rgb = CARD_BG
        cshape.line.color.rgb = CARD_BG
        ctf = cshape.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = head
        cp1.font.size = Pt(13)
        cp1.font.bold = True
        cp1.font.color.rgb = AWS_ORANGE
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(10.5)
        cp2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: Business Challenges & Multipurpose Scope
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "Business Challenges & Multipurpose Architecture Scope")

    left_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.2))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.fill.background()
    ltf = left_card.text_frame
    ltf.word_wrap = True
    lp0 = ltf.paragraphs[0]
    lp0.text = "🚨 Traditional Supply Chain Pain Points"
    lp0.font.size = Pt(16)
    lp0.font.bold = True
    lp0.font.color.rgb = RGBColor(244, 63, 94)

    bullets_pain = [
        ("Traffic Spike Bottlenecks:", " Synchronous database writes drop orders during peak demand spikes."),
        ("Cold-Chain Spoiled Goods:", " Lack of live IoT alerts causes millions in spoiled vaccines and biologics."),
        ("Multi-Facility Blind Spots:", " Siloed inventory records lead to stockouts and safety stock miscalculations."),
        ("Lack of Multi-Party Trust:", " Traditional centralized databases allow unverified edits in custody disputes."),
    ]
    for b_title, b_desc in bullets_pain:
        bp = ltf.add_paragraph()
        bp.text = f"\n• {b_title}"
        bp.font.size = Pt(12)
        bp.font.bold = True
        bp.font.color.rgb = TEXT_WHITE
        bp_sub = ltf.add_paragraph()
        bp_sub.text = f"   {b_desc}"
        bp_sub.font.size = Pt(11)
        bp_sub.font.color.rgb = TEXT_MUTED

    right_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.2))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.fill.background()
    rtf = right_card.text_frame
    rtf.word_wrap = True
    rp0 = rtf.paragraphs[0]
    rp0.text = "🎯 Multipurpose Industry Sectors Handled"
    rp0.font.size = Pt(16)
    rp0.font.bold = True
    rp0.font.color.rgb = ACCENT_GREEN

    verticals = [
        ("Pharmaceutical Cold-Chain:", " Strict temperature monitoring (2°C - 8°C), cryogenic storage, and automated breach notifications."),
        ("High-Tech Electronics:", " ESD cleanroom warehousing, serial tracking for automotive AI chips, and shock monitoring."),
        ("Industrial Machinery:", " Heavy components, robotic servo motors, and purchase order approval workflows."),
        ("Biotechnology Assays:", " Diagnostic PCR reagents, enzyme viability tracking, and cryptographic chain-of-custody."),
    ]
    for v_title, v_desc in verticals:
        vp = rtf.add_paragraph()
        vp.text = f"\n✔ {v_title}"
        vp.font.size = Pt(12)
        vp.font.bold = True
        vp.font.color.rgb = TEXT_WHITE
        vp_sub = rtf.add_paragraph()
        vp_sub.text = f"   {v_desc}"
        vp_sub.font.size = Pt(11)
        vp_sub.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 3: Blockchain & Smart Contract Architecture
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "Cryptographic Blockchain Ledger & Smart Contracts", "IMMUTABLE LEDGER & SMART CONTRACTS")

    b_cards = [
        ("Immutable SHA-256 Chain", "Every block contains an index, timestamp, transaction Merkle tree, nonce, and the previous block's SHA-256 hash. Any tampering invalidates the entire chain.", ACCENT_PURPLE),
        ("Proof-of-Authority Consensus", "Designed around Amazon Managed Blockchain (AMB) / Hyperledger Fabric standards, ensuring deterministic block finality with high transaction throughput.", ACCENT_CYAN),
        ("Automated Escrow Smart Contracts", "SC-COLD-CHAIN-SLA automatically monitors IoT sensor beacons. Temperature excursions (>8°C) freeze escrow funds and log breach infractions immutably.", ACCENT_GREEN),
    ]
    for i, (head, desc, col) in enumerate(b_cards):
        bx = Inches(0.8 + (i * 3.95))
        bshape = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(1.7), Inches(3.7), Inches(4.8))
        bshape.fill.solid()
        bshape.fill.fore_color.rgb = CARD_BG
        bshape.line.color.rgb = col
        bshape.line.width = Pt(1.5)

        btf = bshape.text_frame
        btf.word_wrap = True
        bp1 = btf.paragraphs[0]
        bp1.text = head
        bp1.font.size = Pt(15)
        bp1.font.bold = True
        bp1.font.color.rgb = col

        bp2 = btf.add_paragraph()
        bp2.text = f"\n{desc}"
        bp2.font.size = Pt(11)
        bp2.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 4: End-to-End AWS Cloud Architecture
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "Enterprise AWS Cloud Architecture Mappings")

    aws_services = [
        ("Amazon DynamoDB", "NoSQL Operational Store", "Low-latency schema for Warehouses, Orders, Shipments, and Time-series Telemetry with automated 30-day TTL.", AWS_ORANGE),
        ("Amazon SQS", "Decoupled Order Queue", "Buffers incoming customer orders. Employs Dead-Letter Queue (DLQ) with maxReceiveCount=3 to isolate poison messages.", ACCENT_CYAN),
        ("Amazon SNS", "Pub/Sub Broadcast Topic", "Dispatches instant alerts for temperature violations (>8°C), road shock damage, and inventory reorder point breaches.", RGBColor(245, 158, 11)),
        ("Amazon S3", "Secure Document Lake", "Stores immutable digital invoices, bills of lading, and delivery signatures with AES-256 encryption and versioning.", ACCENT_GREEN),
        ("AWS IoT Core", "Telemetry Rules Engine", "Ingests live vehicle sensor metrics (temp, humidity, shock, GPS, battery) and forwards directly to DynamoDB & Blockchain.", ACCENT_PURPLE),
        ("Serverless Workers", "Event-Driven Processing", "Consumes SQS batches, updates fulfillment states, and calculates inventory safety stock deductions.", RGBColor(59, 130, 246)),
    ]

    for i, (name, role, desc, col) in enumerate(aws_services):
        row = i // 3
        col_idx = i % 3
        bx = Inches(0.8 + (col_idx * 3.95))
        by = Inches(1.7 + (row * 2.65))

        bshape = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, by, Inches(3.7), Inches(2.4))
        bshape.fill.solid()
        bshape.fill.fore_color.rgb = CARD_BG
        bshape.line.color.rgb = col
        bshape.line.width = Pt(1.5)

        btf = bshape.text_frame
        btf.word_wrap = True
        p1 = btf.paragraphs[0]
        p1.text = name
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = btf.add_paragraph()
        p2.text = role.upper()
        p2.font.size = Pt(9)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MUTED

        p3 = btf.add_paragraph()
        p3.text = f"\n{desc}"
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 5: Core Modules & Real-Time Control Tower
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "Core Functional Modules in the SCM Control Tower")

    modules = [
        ("1. Multi-Hub Warehouse (WMS)", [
            "Real-time stock ledger across Chicago, Boston, and Frankfurt facilities",
            "Automatic safety stock calculations and low-inventory warnings",
            "Storage categorization (Ultra-Cold, ESD Cleanroom, Ambient)",
        ]),
        ("2. Asynchronous Order Pipeline (OMS)", [
            "Customer orders queued directly to Amazon SQS",
            "Fulfillment worker polling: QUEUED ➔ PROCESSING ➔ DISPATCHED",
            "Automated generation of digital PDF/JSON invoices archived to S3",
        ]),
        ("3. Fleet Logistics & IoT Tracking (TMS)", [
            "Highway route simulation with live waypoint updates",
            "Environmental sensors: Temperature (°C), Humidity (%), Shock (G), Battery (%)",
            "Automated threshold evaluation triggering instant SMS/Email via SNS",
        ]),
        ("4. Blockchain Explorer & Smart Contracts", [
            "Visual chronological Merkle chain with SHA-256 block inspection",
            "Digital custody handover signing between carriers and depots",
            "Cold-chain escrow contract monitoring with automated penalty enforcement",
        ]),
    ]

    for i, (m_title, m_items) in enumerate(modules):
        mx = Inches(0.8 + ((i % 2) * 5.95))
        my = Inches(1.7 + ((i // 2) * 2.65))

        mshape = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, Inches(5.7), Inches(2.45))
        mshape.fill.solid()
        mshape.fill.fore_color.rgb = CARD_BG
        mshape.line.fill.background()

        mtf = mshape.text_frame
        mtf.word_wrap = True
        mp0 = mtf.paragraphs[0]
        mp0.text = m_title
        mp0.font.size = Pt(14)
        mp0.font.bold = True
        mp0.font.color.rgb = AWS_ORANGE

        for item in m_items:
            ip = mtf.add_paragraph()
            ip.text = f"• {item}"
            ip.font.size = Pt(10.5)
            ip.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 6: Security, Privacy & Terraform Governance
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "Cloud Security, Privacy & Terraform Infrastructure as Code", "INFRASTRUCTURE AS CODE & GOVERNANCE")

    qbox = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.7), Inches(1.3))
    qbox.fill.solid()
    qbox.fill.fore_color.rgb = CARD_BG
    qbox.line.color.rgb = AWS_ORANGE
    qtf = qbox.text_frame
    qtf.word_wrap = True
    qp1 = qtf.paragraphs[0]
    qp1.text = "🔒 Does Terraform Code & Deployment Commands Need to Be Private?"
    qp1.font.size = Pt(13)
    qp1.font.bold = True
    qp1.font.color.rgb = AWS_ORANGE
    qp2 = qtf.add_paragraph()
    qp2.text = "NO. Declarative Terraform resource definitions (HCL) and CLI instructions (terraform apply) are public architectural blueprints. What MUST be private are credentials, secret keys, and runtime state files — all of which are strictly isolated."
    qp2.font.size = Pt(11)
    qp2.font.color.rgb = TEXT_WHITE

    pillars = [
        ("1. Strict Secret Protection", [
            ".gitignore isolates all .env, *.tfstate, and *.tfvars files",
            "Zero AWS Access Keys or secrets hardcoded in Git",
            "Anyone running code uses their own local AWS profile credentials",
        ]),
        ("2. Least-Privilege IAM", [
            "Lambda execution roles scoped strictly to specific SQS & DynamoDB ARNs",
            "S3 Bucket Public Access Block enabled to prevent data exposure",
            "Server-side encryption enabled by default (SSE-S3 AES-256)",
        ]),
        ("3. Automated CI/CD", [
            "GitHub Actions runs terraform fmt & syntax validation on every push",
            "Automated builds for both backend API and React frontend",
            "Zero-downtime static deployment to GitHub Pages CDN",
        ]),
    ]
    for i, (p_title, p_items) in enumerate(pillars):
        px = Inches(0.8 + (i * 3.95))
        pshape = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(3.1), Inches(3.7), Inches(3.8))
        pshape.fill.solid()
        pshape.fill.fore_color.rgb = CARD_BG
        pshape.line.fill.background()
        ptf = pshape.text_frame
        ptf.word_wrap = True
        pp0 = ptf.paragraphs[0]
        pp0.text = p_title
        pp0.font.size = Pt(13)
        pp0.font.bold = True
        pp0.font.color.rgb = ACCENT_CYAN

        for p_it in p_items:
            pp = ptf.add_paragraph()
            pp.text = f"\n• {p_it}"
            pp.font.size = Pt(11)
            pp.font.color.rgb = TEXT_WHITE

    # =========================================================================
    # SLIDE 7: Deliverables & Roadmap
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "Project Deliverables, Live Demo & Future Roadmap", "RESULTS & HORIZONS")

    dcard = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.2))
    dcard.fill.solid()
    dcard.fill.fore_color.rgb = CARD_BG
    dcard.line.fill.background()
    dtf = dcard.text_frame
    dtf.word_wrap = True
    dp0 = dtf.paragraphs[0]
    dp0.text = "📈 Key Engineering Deliverables"
    dp0.font.size = Pt(15)
    dp0.font.bold = True
    dp0.font.color.rgb = ACCENT_GREEN

    items_del = [
        ("Full-Stack Architecture:", " Node.js/Express backend + React/Vite/Tailwind frontend."),
        ("Hybrid Cloud SDK:", " Supports live AWS Cloud Services & seamless in-memory simulator."),
        ("Cryptographic Blockchain:", " SHA-256 Merkle chain, smart contracts & digital signatures."),
        ("Live GitHub Deployment:", " Accessible publicly on GitHub Pages."),
        ("Interactive Sensor Streams:", " Real-time telemetry generator simulating trucks on transit routes."),
    ]
    for it_title, it_desc in items_del:
        dp = dtf.add_paragraph()
        dp.text = f"\n✔ {it_title}"
        dp.font.size = Pt(11.5)
        dp.font.bold = True
        dp.font.color.rgb = TEXT_WHITE
        dp_sub = dtf.add_paragraph()
        dp_sub.text = f"   {it_desc}"
        dp_sub.font.size = Pt(10.5)
        dp_sub.font.color.rgb = TEXT_MUTED

    rcard = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.2))
    rcard.fill.solid()
    rcard.fill.fore_color.rgb = CARD_BG
    rcard.line.fill.background()
    rtf2 = rcard.text_frame
    rtf2.word_wrap = True
    rp0 = rtf2.paragraphs[0]
    rp0.text = "🚀 Access Links & Next Roadmap"
    rp0.font.size = Pt(15)
    rp0.font.bold = True
    rp0.font.color.rgb = AWS_ORANGE

    p_links = rtf2.add_paragraph()
    p_links.text = "\n🔗 Live GitHub Pages Demo:\nhttps://deoid.github.io/Multipurpose_Supply_Chain_Management/"
    p_links.font.size = Pt(11)
    p_links.font.bold = True
    p_links.font.color.rgb = ACCENT_CYAN

    p_repo = rtf2.add_paragraph()
    p_repo.text = "\n📂 GitHub Source Code Repository:\nhttps://github.com/Deoid/Multipurpose_Supply_Chain_Management"
    p_repo.font.size = Pt(11)
    p_repo.font.bold = True
    p_repo.font.color.rgb = TEXT_WHITE

    rp_next = rtf2.add_paragraph()
    rp_next.text = "\n🔮 Next Evolution Steps:"
    rp_next.font.size = Pt(12)
    rp_next.font.bold = True
    rp_next.font.color.rgb = AWS_ORANGE

    next_steps = [
        "AWS SageMaker ML models for predictive demand forecasting",
        "Multi-organization Hyperledger Fabric channel network",
        "Multi-region active-active disaster recovery failover",
    ]
    for step in next_steps:
        sp = rtf2.add_paragraph()
        sp.text = f" • {step}"
        sp.font.size = Pt(10.5)
        sp.font.color.rgb = TEXT_MUTED

    output_path = os.path.abspath("Multipurpose_SCM_AWS_Architecture.pptx")
    prs.save(output_path)
    print(f"[SUCCESS] PowerPoint updated successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
