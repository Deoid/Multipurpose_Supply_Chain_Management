const {
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { isMockMode, ddbDocClient, mockStore } = require('../config/aws');

function getMockCollection(tableName) {
  if (tableName.includes('inventory')) return mockStore.inventory;
  if (tableName.includes('orders')) return mockStore.orders;
  if (tableName.includes('shipments')) return mockStore.shipments;
  if (tableName.includes('suppliers')) return mockStore.suppliers;
  if (tableName.includes('telemetry')) return mockStore.telemetry;
  return mockStore.orders;
}

class DynamoDbService {
  async putItem(tableName, item) {
    if (isMockMode) {
      const collection = getMockCollection(tableName);
      const id = item.orderId || item.shipmentId || item.supplierId || `${item.warehouseId}#${item.sku}` || item.id;
      collection.set(id, { ...item, updatedAt: new Date().toISOString() });
      return item;
    }

    const command = new PutCommand({
      TableName: tableName,
      Item: { ...item, updatedAt: new Date().toISOString() },
    });
    await ddbDocClient.send(command);
    return item;
  }

  async getItem(tableName, key) {
    if (isMockMode) {
      const collection = getMockCollection(tableName);
      const id = Object.values(key).join('#');
      return collection.get(id) || collection.get(Object.values(key)[0]) || null;
    }

    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    const result = await ddbDocClient.send(command);
    return result.Item || null;
  }

  async scanTable(tableName, filterFn = null) {
    if (isMockMode) {
      const collection = getMockCollection(tableName);
      let items = Array.from(collection.values());
      if (filterFn) {
        items = items.filter(filterFn);
      }
      return items;
    }

    const command = new ScanCommand({ TableName: tableName });
    const result = await ddbDocClient.send(command);
    return result.Items || [];
  }

  async updateItem(tableName, key, updates) {
    if (isMockMode) {
      const collection = getMockCollection(tableName);
      const id = Object.values(key).join('#') || Object.values(key)[0];
      const existing = collection.get(id) || collection.get(Object.values(key)[0]);
      if (existing) {
        const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        collection.set(id, updated);
        return updated;
      }
      return null;
    }

    // Dynamic update builder for live AWS DynamoDB
    const keys = Object.keys(updates);
    const updateExpression = 'SET ' + keys.map((k) => `#${k} = :${k}`).join(', ');
    const expressionAttributeNames = keys.reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
    const expressionAttributeValues = keys.reduce((acc, k) => ({ ...acc, [`:${k}`]: updates[k] }), {});

    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });
    const result = await ddbDocClient.send(command);
    return result.Attributes;
  }

  async deleteItem(tableName, key) {
    if (isMockMode) {
      const collection = getMockCollection(tableName);
      const id = Object.values(key).join('#') || Object.values(key)[0];
      collection.delete(id);
      return { success: true };
    }

    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    await ddbDocClient.send(command);
    return { success: true };
  }
}

module.exports = new DynamoDbService();
