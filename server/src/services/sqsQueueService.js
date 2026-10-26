const {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
} = require('@aws-sdk/client-sqs');
const { v4: uuidv4 } = require('uuid');
const { isMockMode, sqsClient, mockStore, config } = require('../config/aws');

class SqsQueueService {
  async sendOrderMessage(orderData) {
    const messageId = uuidv4();
    const payload = {
      messageId,
      timestamp: new Date().toISOString(),
      order: orderData,
    };

    if (isMockMode) {
      mockStore.sqsQueues.orders.push(payload);
      return {
        MessageId: messageId,
        MD5OfMessageBody: 'mock-md5-hash',
        queueSize: mockStore.sqsQueues.orders.length,
      };
    }

    const command = new SendMessageCommand({
      QueueUrl: config.sqsQueueUrl,
      MessageBody: JSON.stringify(payload),
      MessageAttributes: {
        OrderId: {
          DataType: 'String',
          StringValue: orderData.orderId,
        },
        Priority: {
          DataType: 'String',
          StringValue: orderData.priority || 'NORMAL',
        },
      },
    });

    const response = await sqsClient.send(command);
    return response;
  }

  async receiveOrderMessages(maxMessages = 5) {
    if (isMockMode) {
      const messages = mockStore.sqsQueues.orders.splice(0, maxMessages);
      return messages.map((msg, index) => ({
        ReceiptHandle: `mock-receipt-${Date.now()}-${index}`,
        Body: JSON.stringify(msg),
        MessageId: msg.messageId,
      }));
    }

    const command = new ReceiveMessageCommand({
      QueueUrl: config.sqsQueueUrl,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 5,
      AttributeNames: ['All'],
    });

    const response = await sqsClient.send(command);
    return response.Messages || [];
  }

  async deleteOrderMessage(receiptHandle) {
    if (isMockMode) {
      return { success: true };
    }

    const command = new DeleteMessageCommand({
      QueueUrl: config.sqsQueueUrl,
      ReceiptHandle: receiptHandle,
    });

    await sqsClient.send(command);
    return { success: true };
  }

  async getQueueMetrics() {
    if (isMockMode) {
      return {
        ApproximateNumberOfMessages: mockStore.sqsQueues.orders.length,
        ApproximateNumberOfMessagesNotVisible: 0,
        ApproximateNumberOfMessagesDelayed: 0,
        DlqMessages: mockStore.sqsQueues.ordersDlq.length,
      };
    }

    try {
      const command = new GetQueueAttributesCommand({
        QueueUrl: config.sqsQueueUrl,
        AttributeNames: [
          'ApproximateNumberOfMessages',
          'ApproximateNumberOfMessagesNotVisible',
          'ApproximateNumberOfMessagesDelayed',
        ],
      });
      const response = await sqsClient.send(command);
      return response.Attributes || {};
    } catch (err) {
      return {
        ApproximateNumberOfMessages: 0,
        error: err.message,
      };
    }
  }
}

module.exports = new SqsQueueService();
