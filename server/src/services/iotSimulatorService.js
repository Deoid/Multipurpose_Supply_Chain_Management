const dynamoDbService = require('./dynamoDbService');
const snsNotificationService = require('./snsNotificationService');
const { config } = require('../config/aws');

class IotSimulatorService {
  async ingestTelemetry(telemetryData) {
    const {
      shipmentId,
      timestamp = new Date().toISOString(),
      temperature, // Celsius
      humidity,    // %
      shock,        // G-force
      battery,      // %
      location,     // { lat, lng, city, status }
      tempThresholdMin = 2,
      tempThresholdMax = 8,
      category = 'Pharmaceutical Cold-Chain',
    } = telemetryData;

    const record = {
      shipmentId,
      timestamp,
      temperature,
      humidity,
      shock,
      battery,
      location,
      category,
      ttl: Math.floor(Date.now() / 1000) + 30 * 24 * 3600, // 30-day DynamoDB TTL
    };

    // Store in DynamoDB Telemetry table
    await dynamoDbService.putItem(config.telemetryTable, record);

    // Update current shipment state in Shipments table
    await dynamoDbService.updateItem(
      config.shipmentsTable,
      { shipmentId },
      {
        currentLocation: location,
        latestTelemetry: { temperature, humidity, shock, battery, timestamp },
      }
    );

    // Rule: Cold-Chain breach detection
    if (temperature < tempThresholdMin || temperature > tempThresholdMax) {
      await snsNotificationService.publishAlert(
        `Critical Cold-Chain Temperature Breach on Shipment #${shipmentId}`,
        `Current temperature is ${temperature}°C, outside safe range [${tempThresholdMin}°C - ${tempThresholdMax}°C]. Location: ${location?.city || 'In-Transit'}. Immediate action required.`,
        'CRITICAL',
        { shipmentId, temperature, category }
      );
    } else if (shock > 4.5) {
      // Rule: Severe impact/shock detected
      await snsNotificationService.publishAlert(
        `High Shock / Vibration Event on Shipment #${shipmentId}`,
        `A shock of ${shock}G was detected. Package inspection needed upon delivery. Location: ${location?.city || 'In-Transit'}.`,
        'WARNING',
        { shipmentId, shock, category }
      );
    }

    return record;
  }

  async getShipmentTelemetry(shipmentId) {
    const allRecords = await dynamoDbService.scanTable(config.telemetryTable);
    return allRecords
      .filter((r) => r.shipmentId === shipmentId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
}

module.exports = new IotSimulatorService();
