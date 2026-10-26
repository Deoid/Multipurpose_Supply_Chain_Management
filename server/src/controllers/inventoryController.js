const dynamoDbService = require('../services/dynamoDbService');
const snsNotificationService = require('../services/snsNotificationService');
const { config } = require('../config/aws');

exports.getAllInventory = async (req, res) => {
  try {
    const items = await dynamoDbService.scanTable(config.inventoryTable);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getInventoryByWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const items = await dynamoDbService.scanTable(
      config.inventoryTable,
      (item) => item.warehouseId === warehouseId
    );
    res.json({ success: true, warehouseId, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addOrUpdateItem = async (req, res) => {
  try {
    const {
      warehouseId,
      sku,
      productName,
      category,
      quantity,
      safetyStock = 50,
      unitPrice,
      reorderLevel = 100,
      storageRequirements = 'Standard Ambient',
    } = req.body;

    if (!warehouseId || !sku || !productName) {
      return res.status(400).json({ success: false, error: 'warehouseId, sku, and productName are required' });
    }

    const item = {
      warehouseId,
      sku,
      productName,
      category,
      quantity: Number(quantity),
      safetyStock: Number(safetyStock),
      reorderLevel: Number(reorderLevel),
      unitPrice: Number(unitPrice || 0),
      storageRequirements,
      status: Number(quantity) <= Number(safetyStock) ? 'LOW_STOCK' : 'OPTIMAL',
    };

    await dynamoDbService.putItem(config.inventoryTable, item);

    // Trigger SNS alert if stock is below safety stock
    if (item.quantity <= item.safetyStock) {
      await snsNotificationService.publishAlert(
        `Low Stock Warning: SKU ${sku} at ${warehouseId}`,
        `Item ${productName} (SKU: ${sku}) is below safety threshold! Current: ${item.quantity}, Safety Minimum: ${item.safetyStock}.`,
        'WARNING',
        { warehouseId, sku, category }
      );
    }

    res.status(201).json({ success: true, message: 'Inventory item recorded', data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { warehouseId, sku } = req.params;
    await dynamoDbService.deleteItem(config.inventoryTable, { warehouseId, sku });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
