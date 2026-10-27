const API_BASE = '/api';

// In-Browser AWS & Blockchain Simulator state for GitHub Pages static hosting
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
  ],
  alerts: [
    {
      alertId: 'ALT-1',
      subject: 'Supply Chain Cloud & Blockchain Initialized',
      message: 'AWS SQS, DynamoDB, and Amazon Managed Blockchain PoA consensus are active.',
      severity: 'INFO',
      timestamp: new Date().toISOString(),
    },
  ],
  blockchain: {
    blocks: [
      {
        index: 0,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        nonce: 104,
        hash: '00a4e9b8178c182d3e91129481239bb1082c49a0293d8102948bc10294819a82',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        transactions: [
          {
            txId: 'TX-GENESIS-000000',
            type: 'GENESIS_INIT',
            payload: {
              system: 'Multipurpose Supply Chain Cryptographic Ledger',
              consensus: 'Proof-of-Authority (PoA) / Amazon Managed Blockchain',
              standard: 'SHA-256 Merkle Chain',
            },
            signer: 'ROOT_AUTHORITY_ORACLE',
            signature: '0x8891024bbec19401829481238491823901481239048129038419203840192384',
          },
        ],
      },
      {
        index: 1,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        nonce: 42,
        hash: '00f129a018293847120398412039841209384120938412093841209384120938',
        previousHash: '00a4e9b8178c182d3e91129481239bb1082c49a0293d8102948bc10294819a82',
        transactions: [
          {
            txId: 'TX-774901-CUSTODY',
            type: 'CUSTODY_HANDOVER',
            payload: {
              shipmentId: 'SHP-774901',
              from: 'Warehouse Alpha (Chicago, IL)',
              to: 'Kuehne+Nagel Logistics Fleet',
              temp: '4.1°C',
              status: 'VERIFIED',
            },
            signer: 'DEPOT_OPERATOR_CHI_01',
            signature: '0x4912904810294810294812039481029348102938410293841029384102938401',
          },
        ],
      },
    ],
    smartContracts: [
      {
        contractId: 'SC-COLD-CHAIN-SLA',
        name: 'Pharmaceutical Cold-Chain Compliance & Escrow Smart Contract',
        rule: 'Temperature must remain between 2°C and 8°C throughout transit.',
        status: 'ACTIVE_ESCROW',
        escrowAmount: '$25,000 USD',
        beneficiary: 'BioGen Pharma Ingredients GmbH',
        slaPassed: true,
      },
      {
        contractId: 'SC-SEMICON-CUSTODY',
        name: 'High-Tech Semiconductors Chain of Custody & Shock SLA',
        rule: 'Vibration / Shock must not exceed 4.5G; ESD protocols verified.',
        status: 'ACTIVE_ESCROW',
        escrowAmount: '$50,000 USD',
        beneficiary: 'Apex Semiconductor Fab Ltd',
        slaPassed: true,
      },
    ],
  },
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

  const inventory = localMockState.inventory;
  const orders = localMockState.orders;
  const shipments = localMockState.shipments;
  const totalVal = inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
    success: true,
    awsInfrastructure: {
      mode: 'AWS Cloud + Blockchain Simulation (GitHub Pages Ready)',
      region: 'us-east-1',
      services: {
        dynamoDb: 'ONLINE',
        sqs: 'ONLINE',
        sns: 'ONLINE',
        s3: 'ONLINE',
        blockchain: 'AMB_ACTIVE',
      },
    },
    kpis: {
      totalInventoryValue: totalVal,
      totalSkus: inventory.length,
      lowStockSkus: inventory.filter((i) => i.quantity <= i.safetyStock).length,
      activeOrders: orders.filter((o) => o.status !== 'DELIVERED').length,
      inTransitShipments: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
      coldChainComplianceRate: '100%',
      sqsQueueDepth: orders.filter((o) => o.status === 'QUEUED').length,
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

  // Automatically record transaction on blockchain in browser mode
  const newBlockIndex = localMockState.blockchain.blocks.length;
  localMockState.blockchain.blocks.push({
    index: newBlockIndex,
    timestamp: new Date().toISOString(),
    nonce: Math.floor(Math.random() * 200),
    hash: `00${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    previousHash: localMockState.blockchain.blocks[newBlockIndex - 1].hash,
    transactions: [
      {
        txId: `TX-ORDER-${orderId}`,
        type: 'PURCHASE_ORDER_ESCROW_INITIATED',
        payload: { orderId, customer: newOrder.customerName, amount: totalAmount },
        signer: 'ORDER_PROCESSING_ORACLE',
        signature: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      },
    ],
  });

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

  // Trigger Smart Contract rule on Blockchain
  evaluateSmartContractSla(shipmentId, telemetry.temperature);

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

// ==============================================================================
// Blockchain API Methods
// ==============================================================================

export async function fetchBlockchain() {
  const remote = await safeFetch(`${API_BASE}/blockchain`);
  if (remote) return remote;

  return {
    success: true,
    data: {
      blockCount: localMockState.blockchain.blocks.length,
      totalTransactions: localMockState.blockchain.blocks.reduce(
        (sum, b) => sum + b.transactions.length,
        0
      ),
      latestBlockHash:
        localMockState.blockchain.blocks[localMockState.blockchain.blocks.length - 1].hash,
      consensusAlgorithm: 'Proof-of-Authority (PoA) / Amazon Managed Blockchain',
      networkState: 'IMMUTABLE_ONLINE',
      smartContracts: localMockState.blockchain.smartContracts,
      blocks: localMockState.blockchain.blocks,
    },
  };
}

export async function verifyBlockchainIntegrity() {
  const remote = await safeFetch(`${API_BASE}/blockchain/verify`);
  if (remote) return remote;

  return {
    success: true,
    data: {
      valid: true,
      blockCount: localMockState.blockchain.blocks.length,
      latestHash:
        localMockState.blockchain.blocks[localMockState.blockchain.blocks.length - 1].hash,
      message:
        'Cryptographic validation passed. All SHA-256 Merkle hashes, nonces, and digital signatures are 100% authentic and tamper-free.',
    },
  };
}

export async function recordCustodyTransaction(data) {
  const remote = await safeFetch(`${API_BASE}/blockchain/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (remote) return remote;

  const newIndex = localMockState.blockchain.blocks.length;
  const newBlock = {
    index: newIndex,
    timestamp: new Date().toISOString(),
    nonce: Math.floor(Math.random() * 250),
    hash: `00${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    previousHash: localMockState.blockchain.blocks[newIndex - 1].hash,
    transactions: [
      {
        txId: `TX-CUSTODY-${Date.now().toString().slice(-5)}`,
        type: 'CUSTODY_HANDOVER',
        payload: {
          shipmentId: data.shipmentId,
          carrier: data.carrier,
          origin: data.origin,
          destination: data.destination,
          notes: data.notes,
        },
        signer: data.signer || 'DEPOT_VERIFIER_AGENT',
        signature: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  localMockState.blockchain.blocks.push(newBlock);
  return { success: true, data: { block: newBlock } };
}

export async function evaluateSmartContractSla(shipmentId, temperature) {
  const remote = await safeFetch(`${API_BASE}/blockchain/smart-contract/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId, temperature }),
  });
  if (remote) return remote;

  const contract = localMockState.blockchain.smartContracts.find(
    (c) => c.contractId === 'SC-COLD-CHAIN-SLA'
  );

  const temp = Number(temperature);
  let isBreach = temp < 2 || temp > 8;

  if (contract) {
    contract.slaPassed = !isBreach;
    contract.status = isBreach
      ? 'BREACH_DETECTED_ESCROW_FROZEN'
      : 'ACTIVE_ESCROW_COMPLIANT';
  }

  // Record smart contract evaluation block
  const newIndex = localMockState.blockchain.blocks.length;
  localMockState.blockchain.blocks.push({
    index: newIndex,
    timestamp: new Date().toISOString(),
    nonce: Math.floor(Math.random() * 150),
    hash: `00${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    previousHash: localMockState.blockchain.blocks[newIndex - 1].hash,
    transactions: [
      {
        txId: `TX-SMARTCONTRACT-${Date.now().toString().slice(-4)}`,
        type: 'SMART_CONTRACT_EVALUATION',
        payload: {
          shipmentId,
          temperature: `${temp}°C`,
          slaResult: isBreach ? 'BREACH_FROZEN' : 'COMPLIANT_VERIFIED',
          action: isBreach ? 'Escrow Frozen on Chain' : 'Custody Verified',
        },
        signer: 'IOT_ORACLE_RULE_NODE',
        signature: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
      },
    ],
  });

  return { success: true, contract };
}
