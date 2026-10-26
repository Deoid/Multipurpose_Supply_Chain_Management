const { PublishCommand } = require('@aws-sdk/client-sns');
const { v4: uuidv4 } = require('uuid');
const { isMockMode, snsClient, mockStore, config } = require('../config/aws');

class SnsNotificationService {
  async publishAlert(subject, message, severity = 'INFO', metadata = {}) {
    const alertRecord = {
      alertId: uuidv4(),
      subject,
      message,
      severity,
      metadata,
      timestamp: new Date().toISOString(),
    };

    if (isMockMode) {
      mockStore.snsAlerts.unshift(alertRecord);
      if (mockStore.snsAlerts.length > 50) mockStore.snsAlerts.pop();
      return {
        MessageId: alertRecord.alertId,
        alertRecord,
      };
    }

    try {
      const command = new PublishCommand({
        TopicArn: config.snsTopicArn,
        Subject: `[SCM Alert - ${severity}] ${subject}`,
        Message: JSON.stringify(alertRecord, null, 2),
        MessageAttributes: {
          Severity: {
            DataType: 'String',
            StringValue: severity,
          },
          Category: {
            DataType: 'String',
            StringValue: metadata.category || 'GENERAL',
          },
        },
      });

      const response = await snsClient.send(command);
      mockStore.snsAlerts.unshift(alertRecord);
      return {
        MessageId: response.MessageId,
        alertRecord,
      };
    } catch (err) {
      console.error('Failed to publish to Amazon SNS:', err.message);
      mockStore.snsAlerts.unshift(alertRecord);
      return {
        MessageId: alertRecord.alertId,
        alertRecord,
        error: err.message,
      };
    }
  }

  getRecentAlerts(limit = 20) {
    return mockStore.snsAlerts.slice(0, limit);
  }
}

module.exports = new SnsNotificationService();
