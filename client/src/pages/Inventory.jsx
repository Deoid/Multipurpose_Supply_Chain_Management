import React, { useState, useEffect } from 'react';
import { Plus, Boxes, Search, AlertCircle, Warehouse, ShieldAlert } from 'lucide-react';
import { fetchInventory, createInventoryItem } from '../services/api';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Inventory({ onRefreshControlTower }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Item Form state
  const [formData, setFormData] = useState({
    warehouseId: 'WH-CHI-01',
    sku: '',
    productName: '',
    category: 'Pharmaceutical Cold-Chain',
    quantity: 500,
    safetyStock: 100,
    reorderLevel: 250,
    unitPrice: 50,
    storageRequirements: 'Cold Storage (2°C to 8°C)',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchInventory();
      if (res.success) setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createInventoryItem(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({
          warehouseId: 'WH-CHI-01',
          sku: '',
          productName: '',
          category: 'Pharmaceutical Cold-Chain',
          quantity: 500,
          safetyStock: 100,
          reorderLevel: 250,
          unitPrice: 50,
          storageRequirements: 'Cold Storage (2°C to 8°C)',
        });
        loadData();
        if (onRefreshControlTower) onRefreshControlTower();
      }
    } catch (err) {
      alert('Error saving inventory item: ' + err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchWarehouse = selectedWarehouse === 'ALL' || item.warehouseId === selectedWarehouse;
    const matchSearch =
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchWarehouse && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Multi-Facility Warehouse Inventory</h2>
            <AwsArchitectureBadge service="dynamodb" action="Partition: warehouseId, Sort: sku" />
          </div>
          <p className="text-xs text-slate-400">
            Real-time stock ledger with automated safety stock alerts & Amazon SNS broadcast triggers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aws-orange hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add SKU to DynamoDB</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, or Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-aws-orange"
          />
        </div>

        {/* Warehouse Filter Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'WH-CHI-01', 'WH-BOS-02', 'WH-FRA-03'].map((wh) => (
            <button
              key={wh}
              onClick={() => setSelectedWarehouse(wh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWarehouse === wh
                  ? 'bg-slate-700 text-white border border-aws-orange'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {wh === 'ALL' ? 'All Hubs' : wh}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Warehouse & SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Storage Environment</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Safety Stock</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Loading inventory records from DynamoDB...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= item.safetyStock;
                  return (
                    <tr key={`${item.warehouseId}-${item.sku}`} className="hover:bg-slate-750/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{item.sku}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Warehouse className="w-3 h-3 text-aws-orange" />
                          {item.warehouseId}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{item.productName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-[11px]">{item.storageRequirements}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white text-sm">{item.quantity.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.safetyStock.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={isLow ? 'LOW_STOCK' : 'OPTIMAL'} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Register New SKU in Amazon DynamoDB</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Warehouse Facility</label>
                  <select
                    value={formData.warehouseId}
                    onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="WH-CHI-01">WH-CHI-01 (Chicago)</option>
                    <option value="WH-BOS-02">WH-BOS-02 (Boston)</option>
                    <option value="WH-FRA-03">WH-FRA-03 (Frankfurt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MED-BIOL-102"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monoclonal Antibody Conjugates"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
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
                  <label className="block text-slate-400 mb-1">Storage Environment</label>
                  <input
                    type="text"
                    value={formData.storageRequirements}
                    onChange={(e) => setFormData({ ...formData, storageRequirements: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Safety Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.safetyStock}
                    onChange={(e) => setFormData({ ...formData, safetyStock: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
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
                  Save to DynamoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
