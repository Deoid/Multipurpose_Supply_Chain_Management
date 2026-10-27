const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventoryController');
const ordersController = require('../controllers/ordersController');
const shipmentsController = require('../controllers/shipmentsController');
const suppliersController = require('../controllers/suppliersController');
const analyticsController = require('../controllers/analyticsController');
const blockchainController = require('../controllers/blockchainController');
const snsNotificationService = require('../services/snsNotificationService');
const s3StorageService = require('../services/s3StorageService');

// Control Tower & AWS Health
router.get('/analytics/control-tower', analyticsController.getControlTowerMetrics);

// Inventory (DynamoDB Table: scm-inventory)
router.get('/inventory', inventoryController.getAllInventory);
router.get('/inventory/warehouse/:warehouseId', inventoryController.getInventoryByWarehouse);
router.post('/inventory', inventoryController.addOrUpdateItem);
router.delete('/inventory/:warehouseId/:sku', inventoryController.deleteItem);

// Orders (DynamoDB Table: scm-orders + SQS Queue)
router.get('/orders', ordersController.getAllOrders);
router.post('/orders', ordersController.createOrder);
router.post('/orders/process-queue', ordersController.processWorkerQueue);
router.patch('/orders/:orderId/status', ordersController.updateOrderStatus);
router.get('/orders/queue-status', ordersController.getQueueStatus);

// Shipments & IoT Telemetry (DynamoDB + IoT Engine + SNS Alerts)
router.get('/shipments', shipmentsController.getAllShipments);
router.get('/shipments/:shipmentId', shipmentsController.getShipmentById);
router.post('/shipments', shipmentsController.createShipment);
router.post('/shipments/:shipmentId/telemetry', shipmentsController.ingestTelemetry);
router.get('/shipments/:shipmentId/telemetry', shipmentsController.getShipmentTelemetry);

// Suppliers (DynamoDB Table: scm-suppliers)
router.get('/suppliers', suppliersController.getAllSuppliers);
router.post('/suppliers', suppliersController.createSupplier);

// Blockchain Immutable Ledger & Smart Contracts (Amazon Managed Blockchain / PoA)
router.get('/blockchain', blockchainController.getBlockchainLedger);
router.get('/blockchain/verify', blockchainController.verifyBlockchain);
router.post('/blockchain/transaction', blockchainController.addCustodyTransaction);
router.post('/blockchain/smart-contract/evaluate', blockchainController.evaluateSmartContract);

// AWS S3 Document Management
router.get('/documents', async (req, res) => {
  try {
    const docs = await s3StorageService.listDocuments();
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AWS SNS Alerts Feed
router.get('/alerts', (req, res) => {
  const alerts = snsNotificationService.getRecentAlerts(20);
  res.json({ success: true, count: alerts.length, data: alerts });
});

module.exports = router;
