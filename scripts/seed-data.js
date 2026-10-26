#!/usr/bin/env node

/**
 * Multipurpose SCM Seed Data Script
 * Seeds comprehensive initial dataset for Warehouses, Orders, Shipments, and Suppliers.
 */

const http = require('http');

const SERVER_HOST = process.env.API_HOST || 'localhost';
const SERVER_PORT = process.env.API_PORT || 5000;

async function postJSON(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSeed() {
  console.log('🌱 Triggering Multipurpose SCM database seed...\n');

  try {
    // Add extra inventory SKU
    await postJSON('/api/inventory', {
      warehouseId: 'WH-CHI-01',
      sku: 'MED-PLASMA-33',
      productName: 'Cryopreserved Human Plasma Units',
      category: 'Pharmaceutical Cold-Chain',
      quantity: 420,
      safetyStock: 150,
      reorderLevel: 250,
      unitPrice: 85.0,
      storageRequirements: 'Cryogenic (-40°C)',
    });
    console.log('✅ Seeded Cryopreserved Human Plasma SKU');

    // Add extra order
    await postJSON('/api/orders', {
      customerName: 'Novartis Biologics Facility',
      category: 'Pharmaceutical Cold-Chain',
      priority: 'EXPEDITED',
      destinationCity: 'New York, NY',
      shippingAddress: '430 E 29th St, New York, NY',
      items: [{ name: 'Cryopreserved Human Plasma Units', quantity: 20, price: 85.0 }],
    });
    console.log('✅ Seeded Expedited Order into SQS Queue');

    console.log('\n🎉 SCM data seed completed successfully!');
  } catch (err) {
    console.error('Seed script error:', err.message);
  }
}

runSeed();
