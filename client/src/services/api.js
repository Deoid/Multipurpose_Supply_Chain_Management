const API_BASE = '/api';

// In-Browser AWS Simulator state for GitHub Pages static hosting
const localMockState = {
  inventory: [
    {
      warehouseId: 'WH-CHI-01',
      sku: 'MED-VAX-900',
      productName: 'mRNA Cold-Chain Vaccines (vials)',
      category: 'Pharmaceutical Cold-Chain',
      quantity: 1250,
      safetyStock: 300,
      reorderLevel: 500,
      unitPrice: 45.0,
      storageRequirements: 'Ultra-Cold (-20°C to -80°C)',
      status: 'OPTIMAL',
    },
    {
      warehouseId: 'WH-CHI-01',
      sku: 'MED-INS-400',
      productName: 'Recombinant Human Insulin',
      category: 'Pharmaceutical Cold-Chain',
      quantity: 180,
      safetyStock: 250,
      reorderLevel: 400,
      unitPrice: 65.0,
      storageRequirements: 'Cold Storage (2°C to 8°C)',
      status: 'LOW_STOCK',
    },
    {
      warehouseId: 'WH-BOS-02',
      sku: 'SEMI-SOC-101',
      productName: 'Automotive Neural AI Chips (7nm)',
      category: 'High-Tech Electronics',
      quantity: 4800,
      safetyStock: 800,
      reorderLevel: 1200,
      unitPrice: 120.0,
      storageRequirements: 'ESD Protected Cleanroom',
      status: 'OPTIMAL',
    },
    {
      warehouseId: 'WH-FRA-03',
      sku: 'BIO-ENZ-701',
      productName: 'Diagnostic PCR Assay Kits',
      category: 'Biotechnology',
      quantity: 75,
      safetyStock: 100,
      reorderLevel: 250,
      unitPrice: 180.0,
      storageRequirements: 'Refrigerated (2°C to 4°C)',
      status: 'LOW_STOCK',
    },
  ],
  orders: [
    {
      orderId: 'ORD-99120',
      customerName: 'Genentech BioPharma',
      destinationCity: 'Boston, MA',
      totalAmount: 18500,
      priority: 'EXPEDITED',
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    },
    {
      orderId: 'ORD-99124',
      customerName: 'Tesla Gigafactory Europe',
      destinationCity: 'Berlin, Germany',
      totalAmount: 42000,
      priority: 'NORMAL',
      status: 'PROCESSING',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      orderId: 'ORD-98840',
      customerName: 'Siemens Healthineers',
      destinationCity: 'Frankfurt, Germany',
      totalAmount: 9400,
      priority: 'NORMAL',
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  shipments: [
    {
      shipmentId: 'SHP-774901',
      orderId: 'ORD-99120',
      carrier: 'Kuehne+Nagel Cold Chain',
      origin: 'Warehouse Alpha (Chicago, IL)',
      destination: 'Boston Life Sciences Center (MA)',
      eta: '4 Hours',
      category: 'Pharmaceutical Cold-Chain',
      tempRange: '2°C to 8°C',
      status: 'IN_TRANSIT',
      currentLocation: {
        lat: 41.5055,
        lng: -81.6813,
        city: 'Cleveland, OH (I-90 E)',
        status: 'Highway Transit',
      },
      latestTelemetry: {
        temperature: 4.1,
        humidity: 46,
        shock: 0.1,
        battery: 92,
        timestamp: new Date().toISOString(),
      },
      telemetryHistory: [
        { timestamp: '10:00', temperature: 4.0 },
        { timestamp: '10:30', temperature: 4.2 },
        { timestamp: '11:00', temperature: 4.1 },
      ],
    },
    {
      shipmentId: 'SHP-883102',
      orderId: 'ORD-99124',
      carrier: 'DHL Global Forwarding',
      origin: 'Munich Logistics Hub (Germany)',
      destination: 'Basel BioPark (Switzerland)',
      eta: '12 Hours',
      category: 'Pharmaceutical Cold-Chain',
      tempRange: '2°C to 8°C',
      status: 'IN_TRANSIT',
      currentLocation: {
        lat: 47.5596,
        lng: 7.5886,
        city: 'En route to Basel',
        status: 'Customs Approaching',
      },
      latestTelemetry: {
        temperature: 5.6,
        humidity: 50,
        shock: 0.3,
        battery: 88,
        timestamp: new Date().toISOString(),
      },
      telemetryHistory: [
        { timestamp: '08:00', temperature: 5.2 },
        { timestamp: '09:00', temperature: 5.4 },
        { timestamp: '10:00', temperature: 5.6 },
      ],
    },
  ],
  suppliers: [
    {
      supplierId: 'SUP-001',
      name: 'BioGen Pharma Ingredients GmbH',
      category: 'Pharmaceutical & Biologics',
      leadTimeDays: 4,
      rating: 4.9,
      reliabilityRate: 99.2,
      contactEmail: 'orders@biogen-ingredients.de',
      location: 'Frankfurt, Germany',
      status: 'VERIFIED',
    },
    {
      supplierId: 'SUP-002',
      name: 'Apex Semiconductor Fab Ltd',
      category: 'High-Tech Electronics',
      leadTimeDays: 7,
      rating: 4.7,
      reliabilityRate: 97.8,
      contactEmail: 'sales@apex-semicon.tw',
      location: 'Hsinchu Science Park, Taiwan',
      status: 'VERIFIED',
    },
    {
      supplierId: 'SUP-003',
      name: 'Precision Motors & Robotics',
      category: 'Industrial Machinery',
      leadTimeDays: 9,
      rating: 4.8,
      reliabilityRate: 98.6,
      contactEmail: 'enterprise@precisionmotors.com',
      location: 'Detroit, MI, USA',
      status: 'VERIFIED',
    },
  ],
  alerts: [
    {
      alertId: 'ALT-1',
      subject: 'Supply Chain Cloud Initialized',
      message: 'AWS SQS, DynamoDB, S3, and SNS topics are operational.',
      severity: 'INFO',
      timestamp: new Date().toISOString(),
    },
  ],
  demandForecast: [
    { month: 'Jan', actual: 420, predicted: 410 },
    { month: 'Feb', actual: 460, predicted: 455 },
    { month: 'Mar', actual: 510, predicted: 500 },
    { month: 'Apr', actual: 590, predicted: 585 },
    { month: 'May', actual: 640, predicted: 650 },
    { month: 'Jun', actual: null, predicted: 710 },
    { month: 'Jul', actual: null, predicted: 760 },
  ],
};

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchControlTower() {
  const remote = await safeFetch(`${API_BASE}/analytics/control-tower`);
  if (remote) return remote;

  // Client-side fallback calculation for GitHub Pages live demo
  const inventory = localMockState.inventory;
  const orders = localMockState.orders;
  const shipments = localMockState.shipments;
  const totalVal = inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const queuedCount = orders.filter((o) => o.status === 'QUEUED').length;

  return {
    success: true,
    awsInfrastructure: {
      mode: 'AWS Cloud Simulation (GitHub Pages Ready)',
      region: 'us-east-1',
      services: {
        dynamoDb: 'ONLINE',
        sqs: 'ONLINE',
        sns: 'ONLINE',
        s3: 'ONLINE',
      },
    },
    kpis: {
      totalInventoryValue: totalVal,
      totalSkus: inventory.length,
      lowStockSkus: inventory.filter((i) => i.quantity <= i.safetyStock).length,
      activeOrders: orders.filter((o) => o.status !== 'DELIVERED').length,
      inTransitShipments: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
      coldChainComplianceRate: '100%',
      sqsQueueDepth: queuedCount,
      supplierReliabilityAvg: '98.5%',
    },
    recentAlerts: localMockState.alerts,
    demandForecast: localMockState.demandForecast,
  };
}

export async function fetchInventory() {
  const remote = await safeFetch(`${API_BASE}/inventory`);
  if (remote) return remote;
  return { success: true, count: localMockState.inventory.length, data: localMockState.inventory };
}

export async function createInventoryItem(item) {
  const remote = await safeFetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (remote) return remote;

  const newItem = {
    ...item,
    quantity: Number(item.quantity),
    safetyStock: Number(item.safetyStock),
    reorderLevel: Number(item.reorderLevel),
    unitPrice: Number(item.unitPrice || 0),
    status: Number(item.quantity) <= Number(item.safetyStock) ? 'LOW_STOCK' : 'OPTIMAL',
  };
  localMockState.inventory.unshift(newItem);
  return { success: true, data: newItem };
}

export async function fetchOrders() {
  const remote = await safeFetch(`${API_BASE}/orders`);
  if (remote) return remote;
  return { success: true, count: localMockState.orders.length, data: localMockState.orders };
}

export async function createOrder(order) {
  const remote = await safeFetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (remote) return remote;

  const orderId = `ORD-${Date.now().toString().slice(-5)}`;
  const totalAmount = (order.items || []).reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );
  const newOrder = {
    orderId,
    customerName: order.customerName,
    destinationCity: order.destinationCity,
    totalAmount,
    priority: order.priority || 'NORMAL',
    status: 'QUEUED',
    createdAt: new Date().toISOString(),
  };

  localMockState.orders.unshift(newOrder);

  if (order.priority === 'CRITICAL') {
    localMockState.alerts.unshift({
      alertId: `ALT-${Date.now()}`,
      subject: `High Priority Order Enqueued: #${orderId}`,
      message: `Order #${orderId} for ${order.customerName} enqueued to SQS.`,
      severity: 'INFO',
      timestamp: new Date().toISOString(),
    });
  }

  return { success: true, data: newOrder };
}

export async function processSqsQueue() {
  const remote = await safeFetch(`${API_BASE}/orders/process-queue`, { method: 'POST' });
  if (remote) return remote;

  const queued = localMockState.orders.filter((o) => o.status === 'QUEUED');
  queued.forEach((o) => {
    o.status = 'PROCESSING';
  });

  return { success: true, processedOrderIds: queued.map((o) => o.orderId) };
}

export async function fetchShipments() {
  const remote = await safeFetch(`${API_BASE}/shipments`);
  if (remote) return remote;
  return { success: true, count: localMockState.shipments.length, data: localMockState.shipments };
}

export async function fetchShipmentById(id) {
  const remote = await safeFetch(`${API_BASE}/shipments/${id}`);
  if (remote) return remote;
  const found = localMockState.shipments.find((s) => s.shipmentId === id);
  return { success: true, data: found || localMockState.shipments[0] };
}

export async function ingestTelemetry(shipmentId, telemetry) {
  const remote = await safeFetch(`${API_BASE}/shipments/${shipmentId}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telemetry),
  });
  if (remote) return remote;

  const shipment = localMockState.shipments.find((s) => s.shipmentId === shipmentId);
  if (shipment) {
    shipment.latestTelemetry = {
      ...shipment.latestTelemetry,
      ...telemetry,
      timestamp: new Date().toISOString(),
    };
    if (telemetry.location) shipment.currentLocation = telemetry.location;
    if (!shipment.telemetryHistory) shipment.telemetryHistory = [];
    shipment.telemetryHistory.push({
      timestamp: new Date().toLocaleTimeString(),
      temperature: telemetry.temperature,
    });
  }

  // SNS Cold Chain rule breach
  if (telemetry.temperature < 2 || telemetry.temperature > 8) {
    localMockState.alerts.unshift({
      alertId: `ALT-${Date.now()}`,
      subject: `Critical Temp Breach: #${shipmentId}`,
      message: `Temperature reached ${telemetry.temperature}°C (Safe limit: 2°C - 8°C). Amazon SNS notification dispatched.`,
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
    });
  } else if (telemetry.shock > 4.5) {
    localMockState.alerts.unshift({
      alertId: `ALT-${Date.now()}`,
      subject: `Severe Shock Detected on #${shipmentId}`,
      message: `Vibration/impact reached ${telemetry.shock}G. Inspection required.`,
      severity: 'WARNING',
      timestamp: new Date().toISOString(),
    });
  }

  return { success: true, data: telemetry };
}

export async function fetchSuppliers() {
  const remote = await safeFetch(`${API_BASE}/suppliers`);
  if (remote) return remote;
  return { success: true, count: localMockState.suppliers.length, data: localMockState.suppliers };
}

export async function fetchAlerts() {
  const remote = await safeFetch(`${API_BASE}/alerts`);
  if (remote) return remote;
  return { success: true, count: localMockState.alerts.length, data: localMockState.alerts };
}
