import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import Blockchain from './pages/Blockchain';
import Suppliers from './pages/Suppliers';
import Architecture from './pages/Architecture';
import { fetchControlTower } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [controlTowerData, setControlTowerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadControlTowerData = async () => {
    setLoading(true);
    try {
      const res = await fetchControlTower();
      if (res.success) {
        setControlTowerData(res);
      }
    } catch (err) {
      console.warn('API sync warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadControlTowerData();
    const interval = setInterval(loadControlTowerData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar
        onRefresh={loadControlTowerData}
        loading={loading}
        recentAlerts={controlTowerData?.recentAlerts}
        awsStatus={controlTowerData?.awsInfrastructure}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard data={controlTowerData} onRefresh={loadControlTowerData} />
            )}
            {activeTab === 'inventory' && (
              <Inventory onRefreshControlTower={loadControlTowerData} />
            )}
            {activeTab === 'orders' && (
              <Orders onRefreshControlTower={loadControlTowerData} />
            )}
            {activeTab === 'shipments' && (
              <Shipments onRefreshControlTower={loadControlTowerData} />
            )}
            {activeTab === 'blockchain' && <Blockchain />}
            {activeTab === 'suppliers' && <Suppliers />}
            {activeTab === 'architecture' && <Architecture />}
          </div>
        </main>
      </div>
    </div>
  );
}
