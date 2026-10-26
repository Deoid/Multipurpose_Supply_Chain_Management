import React, { useState, useEffect } from 'react';
import {
  Truck,
  Thermometer,
  Droplets,
  Activity,
  Battery,
  MapPin,
  AlertTriangle,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { fetchShipments, fetchShipmentById, ingestTelemetry } from '../services/api';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Shipments({ onRefreshControlTower }) {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transmitting, setTransmitting] = useState(false);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const res = await fetchShipments();
      if (res.success && res.data.length > 0) {
        setShipments(res.data);
        if (!selectedShipment) {
          handleSelectShipment(res.data[0].shipmentId);
        } else {
          handleSelectShipment(selectedShipment.shipmentId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShipment = async (id) => {
    try {
      const res = await fetchShipmentById(id);
      if (res.success) {
        setSelectedShipment(res.data);
        setTelemetryHistory(res.data.telemetryHistory || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleSendTelemetry = async (temp, shock = 0.2, comment = 'Simulated Sensor ping') => {
    if (!selectedShipment) return;
    setTransmitting(true);
    try {
      const payload = {
        temperature: temp,
        humidity: 48 + Math.floor(Math.random() * 6),
        shock: shock,
        battery: 89,
        location: {
          lat: 41.5 + (Math.random() - 0.5) * 0.1,
          lng: -81.6 + (Math.random() - 0.5) * 0.1,
          city: 'In-Transit Route (Waypoint ' + Math.floor(Math.random() * 90 + 10) + ')',
          status: comment,
        },
        category: selectedShipment.category,
      };

      await ingestTelemetry(selectedShipment.shipmentId, payload);
      await handleSelectShipment(selectedShipment.shipmentId);
      if (onRefreshControlTower) onRefreshControlTower();
    } catch (err) {
      alert('Error ingesting telemetry: ' + err.message);
    } finally {
      setTransmitting(false);
    }
  };

  const currentTemp = selectedShipment?.latestTelemetry?.temperature ?? 4.2;
  const isTempBreached = currentTemp < 2 || currentTemp > 8;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Fleet Logistics & Real-Time IoT Telemetry</h2>
            <AwsArchitectureBadge service="iot" action="Ingestion Stream" />
            <AwsArchitectureBadge service="sns" action="Threshold Rules" />
          </div>
          <p className="text-xs text-slate-400">
            High-frequency sensors transmit temperature, shock, and GPS directly to AWS IoT Core and DynamoDB.
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSendTelemetry(4.5, 0.1, 'Nominal Reading')}
            disabled={transmitting || !selectedShipment}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Emit Normal (4.5°C)</span>
          </button>

          <button
            onClick={() => handleSendTelemetry(11.8, 0.4, 'Refrigeration Failure Triggered')}
            disabled={transmitting || !selectedShipment}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Temp Breach (11.8°C)</span>
          </button>

          <button
            onClick={() => handleSendTelemetry(4.8, 5.6, 'Pothole / Road Impact Detected')}
            disabled={transmitting || !selectedShipment}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulate High Shock (5.6G)</span>
          </button>
        </div>
      </div>

      {/* Grid: Shipment Selector & Telemetry Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment List */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-aws-orange" />
              <span>Active Cargo Shipments</span>
            </h3>
            <span className="text-xs text-slate-400">{shipments.length} Active</span>
          </div>

          <div className="space-y-2">
            {shipments.map((s) => {
              const isSelected = selectedShipment?.shipmentId === s.shipmentId;
              return (
                <div
                  key={s.shipmentId}
                  onClick={() => handleSelectShipment(s.shipmentId)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-700/80 border-aws-orange shadow-md'
                      : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-white">{s.shipmentId}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="text-slate-300 font-medium">{s.carrier}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-aws-orange shrink-0" />
                    <span className="truncate">{s.currentLocation?.city || s.destination}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Shipment Telemetry Gauges & Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedShipment ? (
            <>
              {/* Gauges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    isTempBreached
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : 'bg-slate-800/80 border-slate-700/80 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Cargo Temp</span>
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">
                    {currentTemp.toFixed(1)}°C
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">
                    Safe: {selectedShipment.tempRange || '2°C to 8°C'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Humidity</span>
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">
                    {selectedShipment.latestTelemetry?.humidity || 48}%
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">Optimal (40% - 60%)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Shock / G-Force</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">
                    {selectedShipment.latestTelemetry?.shock || 0.2}G
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">Impact Threshold: 4.5G</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>IoT Beacon</span>
                    <Battery className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight">
                    {selectedShipment.latestTelemetry?.battery || 95}%
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">Active Sensor Node</div>
                </div>
              </div>

              {/* Real-time Telemetry History Chart */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Cold-Chain Temperature Sensor Telemetry Stream (AWS IoT)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live sensor timeseries stored in DynamoDB table: multipurpose-scm-iot-telemetry-dev
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                    {telemetryHistory.length} Telemetry Events
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        telemetryHistory.length > 0
                          ? telemetryHistory
                          : [{ timestamp: 'Initial', temperature: 4.2 }]
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#94a3b8"
                        tickFormatter={(time) => (time.includes('T') ? time.split('T')[1].slice(0, 5) : time)}
                      />
                      <YAxis stroke="#94a3b8" domain={[0, 15]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
                      />
                      <ReferenceLine y={8} stroke="#f43f5e" strokeDasharray="3 3" label="Max 8°C" />
                      <ReferenceLine y={2} stroke="#38bdf8" strokeDasharray="3 3" label="Min 2°C" />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name="Cargo Temperature (°C)"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-800/60 rounded-2xl border border-slate-700">
              Select a shipment to inspect live IoT sensor metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
