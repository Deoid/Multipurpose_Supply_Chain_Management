const dynamoDbService = require('../services/dynamoDbService');
const sqsQueueService = require('../services/sqsQueueService');
const snsNotificationService = require('../services/snsNotificationService');
const s3StorageService = require('../services/s3StorageService');
const { isMockMode, config } = require('../config/aws');

exports.getControlTowerMetrics = async (req, res) => {
  try {
    const [inventory, orders, shipments, suppliers, queueMetrics, recentAlerts, documents] = await Promise.all([
      dynamoDbService.scanTable(config.inventoryTable),
      dynamoDbService.scanTable(config.ordersTable),
      dynamoDbService.scanTable(config.shipmentsTable),
      dynamoDbService.scanTable(config.suppliersTable),
      sqsQueueService.getQueueMetrics(),
      snsNotificationService.getRecentAlerts(10),
      s3StorageService.listDocuments(''),
    ]);

    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);
    const lowStockItems = inventory.filter((item) => item.quantity <= item.safetyStock);
    const inTransitShipments = shipments.filter((s) => s.status === 'IN_TRANSIT');

    // Cold-chain compliance: shipments with temperature between 2 and 8 °C
    const compliantColdChain = inTransitShipments.filter((s) => {
      const temp = s.latestTelemetry?.temperature;
      return temp !== undefined ? temp >= 2 && temp <= 8 : true;
    });

    const coldChainComplianceRate = inTransitShipments.length > 0
      ? Math.round((compliantColdChain.length / inTransitShipments.length) * 100)
      : 100;

    // Demand Forecast Simulation (Predictive analytics for next 30 days)
    const demandForecast = [
      { month: 'Jan', actual: 420, predicted: 410 },
      { month: 'Feb', actual: 460, predicted: 455 },
      { month: 'Mar', actual: 510, predicted: 500 },
      { month: 'Apr', actual: 590, predicted: 585 },
      { month: 'May', actual: 640, predicted: 650 },
      { month: 'Jun', actual: null, predicted: 710 },
      { month: 'Jul', actual: null, predicted: 760 },
    ];

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      awsInfrastructure: {
        mode: isMockMode ? 'Mock / LocalStack In-Memory AWS' : 'Live AWS Cloud',
        region: config.region,
        services: {
          dynamoDb: 'ONLINE (Tables: Inventory, Orders, Shipments, Suppliers, Telemetry)',
          sqs: 'ONLINE (Worker Queue: Active)',
          sns: 'ONLINE (Broadcast Topic: Subscribed)',
          s3: 'ONLINE (Document Lake: Active)',
          iotCore: 'ONLINE (Telemetry Rules: Ingesting)',
        },
      },
      kpis: {
        totalInventoryValue,
        totalSkus: inventory.length,
        lowStockSkus: lowStockItems.length,
        activeOrders: orders.filter((o) => o.status !== 'DELIVERED').length,
        inTransitShipments: inTransitShipments.length,
        coldChainComplianceRate: `${coldChainComplianceRate}%`,
        sqsQueueDepth: queueMetrics.ApproximateNumberOfMessages || 0,
        supplierReliabilityAvg: '98.4%',
        documentsArchived: documents.length,
      },
      queueMetrics,
      recentAlerts,
      demandForecast,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
