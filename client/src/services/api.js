const API_BASE = '/api';

export async function fetchControlTower() {
  const res = await fetch(`${API_BASE}/analytics/control-tower`);
  return res.json();
}

export async function fetchInventory() {
  const res = await fetch(`${API_BASE}/inventory`);
  return res.json();
}

export async function createInventoryItem(item) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function processSqsQueue() {
  const res = await fetch(`${API_BASE}/orders/process-queue`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchShipments() {
  const res = await fetch(`${API_BASE}/shipments`);
  return res.json();
}

export async function fetchShipmentById(id) {
  const res = await fetch(`${API_BASE}/shipments/${id}`);
  return res.json();
}

export async function ingestTelemetry(shipmentId, telemetry) {
  const res = await fetch(`${API_BASE}/shipments/${shipmentId}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telemetry),
  });
  return res.json();
}

export async function fetchSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers`);
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/alerts`);
  return res.json();
}
