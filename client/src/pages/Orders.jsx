import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Play,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { fetchOrders, createOrder, processSqsQueue } from '../services/api';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Orders({ onRefreshControlTower }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New Order Form state
  const [formData, setFormData] = useState({
    customerName: 'Genentech BioPharma',
    category: 'Pharmaceutical Cold-Chain',
    priority: 'EXPEDITED',
    destinationCity: 'San Francisco, CA',
    shippingAddress: '1 DNA Way, South San Francisco, CA',
    productName: 'mRNA Cold-Chain Vaccines (vials)',
    quantity: 50,
    price: 45,
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchOrders();
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customerName: formData.customerName,
        category: formData.category,
        priority: formData.priority,
        destinationCity: formData.destinationCity,
        shippingAddress: formData.shippingAddress,
        items: [
          {
            name: formData.productName,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
          },
        ],
      };

      const res = await createOrder(payload);
      if (res.success) {
        setShowModal(false);
        loadOrders();
        if (onRefreshControlTower) onRefreshControlTower();
      }
    } catch (err) {
      alert('Error creating order: ' + err.message);
    }
  };

  const handleTriggerSqsWorker = async () => {
    setProcessing(true);
    try {
      const res = await processSqsQueue();
      if (res.success) {
        loadOrders();
        if (onRefreshControlTower) onRefreshControlTower();
      }
    } catch (err) {
      alert('Error processing SQS queue: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const queuedOrders = orders.filter((o) => o.status === 'QUEUED');
  const processingOrders = orders.filter((o) => o.status === 'PROCESSING');
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'DISPATCHED');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Asynchronous Order Fulfillment Pipeline</h2>
            <AwsArchitectureBadge service="sqs" action="Queue Ingestion" />
            <AwsArchitectureBadge service="s3" action="Invoice Lake" />
          </div>
          <p className="text-xs text-slate-400">
            Orders are enqueued to Amazon SQS with DLQ fallback, written to DynamoDB, and invoices archived in Amazon S3.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSqsWorker}
            disabled={processing || queuedOrders.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              queuedOrders.length > 0
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            <span>Process SQS Queue ({queuedOrders.length} pending)</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aws-orange hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Enqueue New Order</span>
          </button>
        </div>
      </div>

      {/* SQS Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1: Enqueued in SQS */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">1. In SQS Queue</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300">
                {queuedOrders.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Buffered in Amazon SQS FIFO/Standard queue awaiting fulfillment worker pick up.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {queuedOrders.map((ord) => (
                <div key={ord.orderId} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-white font-bold">{ord.orderId}</span>
                    <StatusBadge status={ord.priority} />
                  </div>
                  <div className="text-slate-300 font-medium">{ord.customerName}</div>
                  <div className="text-slate-400 text-[10px]">
                    Dest: {ord.destinationCity} • ${(ord.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage 2: Processing / Fulfillment */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">2. Processing & Packaging</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                {processingOrders.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Picked by Lambda worker; warehouse packaging and cold-chain dry ice loading.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {processingOrders.map((ord) => (
                <div key={ord.orderId} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-white font-bold">{ord.orderId}</span>
                    <StatusBadge status="PROCESSING" />
                  </div>
                  <div className="text-slate-300 font-medium">{ord.customerName}</div>
                  <div className="text-slate-400 text-[10px]">
                    Dest: {ord.destinationCity} • ${(ord.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage 3: Dispatched / In Transit */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">3. Dispatched / Delivered</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                {deliveredOrders.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Handed off to fleet logistics with active IoT telemetry tracking.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {deliveredOrders.map((ord) => (
                <div key={ord.orderId} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-white font-bold">{ord.orderId}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <div className="text-slate-300 font-medium">{ord.customerName}</div>
                  <div className="text-slate-400 text-[10px]">
                    Dest: {ord.destinationCity} • ${(ord.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Ledger */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Full Orders Ledger & Digital S3 Invoices</h3>
          <span className="text-xs text-slate-400">{orders.length} Total Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">S3 Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Loading orders from DynamoDB...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                    No orders placed yet. Click "Enqueue New Order" above!
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-slate-750/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white">{ord.orderId}</div>
                      <div className="text-[10px] text-slate-400">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Today'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{ord.customerName}</td>
                    <td className="py-3 px-4 text-slate-300">{ord.destinationCity}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      ${(ord.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold text-aws-orange">{ord.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>s3://invoices/{ord.orderId}.json</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Enqueue New Order (Amazon SQS)</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer / Enterprise Client</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Pharmaceutical Cold-Chain">Pharmaceutical Cold-Chain</option>
                    <option value="High-Tech Electronics">High-Tech Electronics</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial Machinery">Industrial Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority (SQS Routing)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="EXPEDITED">EXPEDITED</option>
                    <option value="CRITICAL">CRITICAL (SNS alert)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <span className="block font-semibold text-slate-300">Order Line Item</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-400">Product</label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Qty</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-aws-orange text-slate-950 font-bold hover:bg-amber-500"
                >
                  Send to SQS Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
