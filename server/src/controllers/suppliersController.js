const dynamoDbService = require('../services/dynamoDbService');
const { config } = require('../config/aws');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await dynamoDbService.scanTable(config.suppliersTable);
    res.json({ success: true, count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const {
      name,
      category = 'Medical Supplies',
      leadTimeDays = 5,
      rating = 4.8,
      reliabilityRate = 98.5,
      contactEmail,
      location,
    } = req.body;

    const supplierId = `SUP-${Date.now().toString().slice(-5)}`;
    const supplier = {
      supplierId,
      name,
      category,
      leadTimeDays: Number(leadTimeDays),
      rating: Number(rating),
      reliabilityRate: Number(reliabilityRate),
      contactEmail: contactEmail || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      location: location || 'Frankfurt, Germany',
      status: 'VERIFIED',
      activeContracts: 3,
      createdAt: new Date().toISOString(),
    };

    await dynamoDbService.putItem(config.suppliersTable, supplier);
    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
