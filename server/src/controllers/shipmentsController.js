const dynamoDbService = require('../services/dynamoDbService');
const iotSimulatorService = require('../services/iotSimulatorService');
const { config } = require('../config/aws');

exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await dynamoDbService.scanTable(config.shipmentsTable);
    res.json({ success: true, count: shipments.length, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await dynamoDbService.getItem(config.shipmentsTable, { shipmentId });
    if (!shipment) {
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }
    const telemetry = await iotSimulatorService.getShipmentTelemetry(shipmentId);
    res.json({ success: true, data: { ...shipment, telemetryHistory: telemetry } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const {
      orderId,
      carrier = 'DHL Express Cargo',
      origin = 'Warehouse Alpha (Chicago, IL)',
      destination = 'Boston Life Sciences Center (MA)',
      eta = '24 Hours',
      category = 'Pharmaceutical Cold-Chain',
      tempRange = '2°C to 8°C',
    } = req.body;

    const shipmentId = `SHP-${Date.now().toString().slice(-6)}`;
    const newShipment = {
      shipmentId,
      orderId: orderId || `ORD-${Date.now().toString().slice(-4)}`,
      carrier,
      origin,
      destination,
      eta,
      category,
      tempRange,
      status: 'IN_TRANSIT',
      currentLocation: {
        lat: 41.8781,
        lng: -87.6298,
        city: 'Chicago, IL',
        status: 'Departed Warehouse Alpha',
      },
      latestTelemetry: {
        temperature: 4.2,
        humidity: 48,
        shock: 0.2,
        battery: 98,
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    await dynamoDbService.putItem(config.shipmentsTable, newShipment);

    // Initial telemetry reading
    await iotSimulatorService.ingestTelemetry({
      shipmentId,
      temperature: 4.2,
      humidity: 48,
      shock: 0.2,
      battery: 98,
      location: newShipment.currentLocation,
      category,
    });

    res.status(201).json({ success: true, message: 'Shipment dispatched', data: newShipment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.ingestTelemetry = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const telemetryData = {
      ...req.body,
      shipmentId,
    };

    const record = await iotSimulatorService.ingestTelemetry(telemetryData);
    res.json({
      success: true,
      message: 'IoT Telemetry received & processed by AWS IoT Rules Engine',
      data: record,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getShipmentTelemetry = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const history = await iotSimulatorService.getShipmentTelemetry(shipmentId);
    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
