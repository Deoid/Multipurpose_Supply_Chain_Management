import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  Building2,
  Cpu,
  Link2,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'SCM Control Tower', icon: LayoutDashboard },
  { id: 'inventory', label: 'Warehouse & Inventory', icon: Boxes },
  { id: 'orders', label: 'Orders & SQS Pipeline', icon: ShoppingCart },
  { id: 'shipments', label: 'Fleet & IoT Telemetry', icon: Truck },
  { id: 'blockchain', label: 'Blockchain Ledger & Escrow', icon: Link2 },
  { id: 'suppliers', label: 'Supplier Procurement', icon: Building2 },
  { id: 'architecture', label: 'AWS Architecture & Docs', icon: Cpu },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Supply Chain Modules
        </div>
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-aws-orange text-slate-950 font-bold shadow-md shadow-orange-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <Link2 className="w-4 h-4" />
          <span>Blockchain Integrity</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          SHA-256 Merkle chain, PoA consensus, and automated cold-chain escrow release.
        </p>
      </div>
    </aside>
  );
}
