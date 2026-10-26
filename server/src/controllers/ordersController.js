const { v4: uuidv4 } = require('uuid');
const dynamoDbService = require('../services/dynamoDbService');
const sqsQueueService = require('../services/sqsQueueService');
const snsNotificationService = require('../services/snsNotificationService');
const s3StorageService = require('../services/s3StorageService');
const { config } = require('../config/aws');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await dynamoDbService.scanTable(config.ordersTable);
    // Sort descending by createdAt
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      items = [],
      shippingAddress,
      destinationCity,
      priority = 'NORMAL',
      category = 'Pharmaceutical Cold-Chain',
    } = req.body;

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const order = {
      orderId,
      customerId: customerId || 'CUST-1001',
      customerName: customerName || 'Global Biotech Logistics',
      items,
      totalAmount,
      shippingAddress: shippingAddress || '450 Technology Square, Cambridge, MA',
      destinationCity: destinationCity || 'Boston',
      priority,
      category,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Amazon DynamoDB
    await dynamoDbService.putItem(config.ordersTable, order);

    // 2. Send event to Amazon SQS for asynchronous background fulfillment
    const sqsResponse = await sqsQueueService.sendOrderMessage(order);

    // 3. Generate Digital Invoice and store in Amazon S3
    const invoiceKey = `invoices/${orderId}.json`;
    await s3StorageService.uploadDocument(invoiceKey, order, 'application/json', {
      orderId,
      customer: order.customerName,
    });

    // 4. Send SNS alert notification if high priority
    if (priority === 'CRITICAL' || priority === 'EXPEDITED') {
      await snsNotificationService.publishAlert(
        `High Priority Order Enqueued: #${orderId}`,
        `Order #${orderId} for ${order.customerName} has been queued via Amazon SQS with priority ${priority}.`,
        'INFO',
        { orderId, priority }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created, enqueued to Amazon SQS, and invoice archived in Amazon S3',
      data: order,
      sqs: {
        messageId: sqsResponse.MessageId,
      },
      s3InvoiceUrl: `s3://${config.s3Bucket}/${invoiceKey}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.processWorkerQueue = async (req, res) => {
  try {
    // Worker polling Amazon SQS
    const messages = await sqsQueueService.receiveOrderMessages(5);
    const processed = [];

    for (const msg of messages) {
      let body;
      try {
        body = JSON.parse(msg.Body);
      } catch (e) {
        body = msg.Body;
      }

      const orderData = body.order || body;
      if (orderData && orderData.orderId) {
        // Move order from QUEUED -> PROCESSING
        await dynamoDbService.updateItem(
          config.ordersTable,
          { orderId: orderData.orderId },
          { status: 'PROCESSING', processedAt: new Date().toISOString() }
        );

        // Delete from SQS once processed
        await sqsQueueService.deleteOrderMessage(msg.ReceiptHandle);
        processed.push(orderData.orderId);
      }
    }

    const queueMetrics = await sqsQueueService.getQueueMetrics();

    res.json({
      success: true,
      message: `Worker processed ${processed.length} order(s) from SQS queue`,
      processedOrderIds: processed,
      queueMetrics,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const updated = await dynamoDbService.updateItem(
      config.ordersTable,
      { orderId },
      { status, trackingNumber }
    );

    res.json({ success: true, message: 'Order status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getQueueStatus = async (req, res) => {
  try {
    const metrics = await sqsQueueService.getQueueMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
