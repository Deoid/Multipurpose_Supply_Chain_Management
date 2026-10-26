require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const { isMockMode, config } = require('./config/aws');
const dynamoDbService = require('./services/dynamoDbService');
const snsNotificationService = require('./services/snsNotificationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Multipurpose Supply Chain Management Server',
    awsMode: isMockMode ? 'Mock AWS Adapter' : 'Live AWS Cloud',
    region: config.region,
    timestamp: new Date().toISOString(),
  });
});

// Seed initial realistic supply chain records for out-of-the-box demonstration
async function bootstrapInitialData() {
  const existingInventory = await dynamoDbService.scanTable(config.inventoryTable);
  if (existingInventory.length > 0) return;

  console.log('🌱 Seeding initial Multipurpose Supply Chain records...');

  // 1. Inventory Items (Pharmaceutical cold-chain, High-tech chips, FMCG)
  const inventoryItems = [
    {
      warehouseId: 'WH-CHI-01',
      sku: 'MED-VAX-900',
      productName: 'mRNA Cold-Chain Vaccines (vials)',
      category: 'Pharmaceutical Cold-Chain',
      quantity: 1250,
      safetyStock: 300,
      reorderLevel: 500,
      unitPrice: 45.0,
      storageRequirements: 'Ultra-Cold (-20°C to -80°C)',
      status: 'OPTIMAL',
    },
    {
      warehouseId: 'WH-CHI-01',
      sku: 'MED-INS-400',
      productName: 'Recombinant Human Insulin',
      category: 'Pharmaceutical Cold-Chain',
      quantity: 180,
      safetyStock: 250,
      reorderLevel: 400,
      unitPrice: 65.0,
      storageRequirements: 'Cold Storage (2°C to 8°C)',
      status: 'LOW_STOCK',
    },
    {
      warehouseId: 'WH-BOS-02',
      sku: 'SEMI-SOC-101',
      productName: 'Automotive Neural AI Chips (7nm)',
      category: 'High-Tech Electronics',
      quantity: 4800,
      safetyStock: 800,
      reorderLevel: 1200,
      unitPrice: 120.0,
      storageRequirements: 'ESD Protected Cleanroom',
      status: 'OPTIMAL',
    },
    {
      warehouseId: 'WH-FRA-03',
      sku: 'BIO-ENZ-701',
      productName: 'Diagnostic PCR Assay Kits',
      category: 'Biotechnology',
      quantity: 75,
      safetyStock: 100,
      reorderLevel: 250,
      unitPrice: 180.0,
      storageRequirements: 'Refrigerated (2°C to 4°C)',
      status: 'LOW_STOCK',
    },
    {
      warehouseId: 'WH-BOS-02',
      sku: 'IND-ROBO-55',
      productName: 'Industrial Robotic Servo Motors',
      category: 'Industrial Machinery',
      quantity: 340,
      safetyStock: 60,
      reorderLevel: 100,
      unitPrice: 420.0,
      storageRequirements: 'Heavy Storage Rack',
      status: 'OPTIMAL',
    },
  ];

  for (const item of inventoryItems) {
    await dynamoDbService.putItem(config.inventoryTable, item);
  }

  // 2. Initial Shipments
  const initialShipments = [
    {
      shipmentId: 'SHP-774901',
      orderId: 'ORD-99120',
      carrier: 'Kuehne+Nagel Cold Chain',
      origin: 'Warehouse Alpha (Chicago, IL)',
      destination: 'Boston Life Sciences Center (MA)',
      eta: '4 Hours',
      category: 'Pharmaceutical Cold-Chain',
      tempRange: '2°C to 8°C',
      status: 'IN_TRANSIT',
      currentLocation: {
        lat: 41.5055,
        lng: -81.6813,
        city: 'Cleveland, OH (I-90 E)',
        status: 'Highway Transit',
      },
      latestTelemetry: {
        temperature: 4.1,
        humidity: 46,
        shock: 0.1,
        battery: 92,
        timestamp: new Date().toISOString(),
      },
    },
    {
      shipmentId: 'SHP-883102',
      orderId: 'ORD-99124',
      carrier: 'DHL Global Forwarding',
      origin: 'Munich Logistics Hub (Germany)',
      destination: 'Basel BioPark (Switzerland)',
      eta: '12 Hours',
      category: 'Pharmaceutical Cold-Chain',
      tempRange: '2°C to 8°C',
      status: 'IN_TRANSIT',
      currentLocation: {
        lat: 47.5596,
        lng: 7.5886,
        city: 'En route to Basel',
        status: 'Customs Clearance Approaching',
      },
      latestTelemetry: {
        temperature: 5.6,
        humidity: 50,
        shock: 0.3,
        battery: 88,
        timestamp: new Date().toISOString(),
      },
    },
  ];

  for (const shipment of initialShipments) {
    await dynamoDbService.putItem(config.shipmentsTable, shipment);
  }

  // 3. Initial Suppliers
  const initialSuppliers = [
    {
      supplierId: 'SUP-001',
      name: 'BioGen Pharma Ingredients GmbH',
      category: 'Pharmaceutical & Biologics',
      leadTimeDays: 4,
      rating: 4.9,
      reliabilityRate: 99.2,
      contactEmail: 'orders@biogen-ingredients.de',
      location: 'Frankfurt, Germany',
      status: 'VERIFIED',
      activeContracts: 6,
    },
    {
      supplierId: 'SUP-002',
      name: 'Apex Semiconductor Fab Ltd',
      category: 'High-Tech Electronics',
      leadTimeDays: 7,
      rating: 4.7,
      reliabilityRate: 97.8,
      contactEmail: 'sales@apex-semicon.tw',
      location: 'Hsinchu Science Park, Taiwan',
      status: 'VERIFIED',
      activeContracts: 4,
    },
    {
      supplierId: 'SUP-003',
      name: 'Precision Motors & Robotics',
      category: 'Industrial Machinery',
      leadTimeDays: 9,
      rating: 4.8,
      reliabilityRate: 98.6,
      contactEmail: 'enterprise@precisionmotors.com',
      location: 'Detroit, MI, USA',
      status: 'VERIFIED',
      activeContracts: 2,
    },
  ];

  for (const supplier of initialSuppliers) {
    await dynamoDbService.putItem(config.suppliersTable, supplier);
  }

  // Initial SNS Alert
  await snsNotificationService.publishAlert(
    'Supply Chain System Initialized',
    'Multipurpose SCM AWS Cloud Platform initialized with Active SQS Worker Queue & DynamoDB telemetry streams.',
    'INFO',
    { system: 'INIT' }
  );

  console.log('✅ Initial SCM seed data loaded successfully!');
}

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Multipurpose SCM Backend API listening on port ${PORT}`);
  console.log(`☁️  AWS Cloud Services Mode: ${isMockMode ? 'Mock AWS Adapter' : 'Live AWS'}`);
  console.log(`📦 DynamoDB Tables: Active`);
  console.log(`📬 Amazon SQS Queue: Connected`);
  console.log(`📢 Amazon SNS Alerts: Subscribed`);
  console.log(`====================================================`);
  await bootstrapInitialData();
});
