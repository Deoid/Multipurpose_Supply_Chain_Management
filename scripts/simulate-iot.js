#!/usr/bin/env node

/**
 * IoT Sensor Telemetry Stream Simulator
 * Continuously emits temperature, humidity, shock, and GPS coordinates
 * to the SCM backend and AWS IoT Core ingestion engine.
 */

const http = require('http');

const SERVER_HOST = process.env.API_HOST || 'localhost';
const SERVER_PORT = process.env.API_PORT || 5000;
const SHIPMENT_ID = process.argv[2] || 'SHP-774901';

console.log(`📡 Starting IoT Telemetry Simulator for Shipment: ${SHIPMENT_ID}`);
console.log(`🎯 Target API: http://${SERVER_HOST}:${SERVER_PORT}/api/shipments/${SHIPMENT_ID}/telemetry\n`);

let step = 0;
const cities = [
  'Cleveland, OH (I-90 E)',
  'Erie, PA (Interstate 90)',
  'Buffalo, NY Logistics Hub',
  'Syracuse, NY Cold-Storage Waypoint',
  'Albany, NY Highway Depot',
  'Boston, MA BioPark Receiving Bay',
];

function generateTelemetryReading() {
  step++;
  const cityIndex = Math.min(step, cities.length - 1);
  
  // Base cold chain temp between 3.5 and 5.5 °C with minor noise
  let temp = +(4.0 + (Math.sin(step) * 1.5) + (Math.random() * 0.4)).toFixed(1);
  let shock = +(0.1 + (Math.random() * 0.2)).toFixed(2);

  // Once in a while simulate an anomaly for alert testing
  if (step % 8 === 0) {
    temp = 10.4; // Temperature breach!
    console.log('⚠️ [SIMULATED EVENT] Injected Cold-Chain Temperature Spike: 10.4°C');
  }

  return {
    temperature: temp,
    humidity: Math.floor(45 + Math.random() * 10),
    shock: shock,
    battery: Math.max(20, 98 - step),
    location: {
      lat: +(41.5 + (step * 0.2)).toFixed(4),
      lng: +(-81.6 + (step * 0.8)).toFixed(4),
      city: cities[cityIndex],
      status: `En route - Waypoint ${step}`,
    },
    category: 'Pharmaceutical Cold-Chain',
    tempThresholdMin: 2,
    tempThresholdMax: 8,
  };
}

function sendTelemetry() {
  const telemetry = generateTelemetryReading();
  const data = JSON.stringify(telemetry);

  const req = http.request(
    {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: `/api/shipments/${SHIPMENT_ID}/telemetry`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log(
          `[${new Date().toLocaleTimeString()}] Sent Telemetry: Temp=${telemetry.temperature}°C, Shock=${telemetry.shock}G, Loc="${telemetry.location.city}" -> HTTP ${res.statusCode}`
        );
      });
    }
  );

  req.on('error', (err) => {
    console.error(`❌ Connection error: ${err.message}. (Is the backend running on port ${SERVER_PORT}?)`);
  });

  req.write(data);
  req.end();
}

// Send immediately, then every 5 seconds
sendTelemetry();
const timer = setInterval(sendTelemetry, 5000);

process.on('SIGINT', () => {
  clearInterval(timer);
  console.log('\n🛑 Telemetry simulator stopped.');
  process.exit(0);
});
