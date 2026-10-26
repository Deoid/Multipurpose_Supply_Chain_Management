import React from 'react';
import { Cloud, Bell, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ onRefresh, loading, recentAlerts = [], awsStatus }) {
  const criticalCount = recentAlerts.filter((a) => a.severity === 'CRITICAL').length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md shadow-orange-500/20 text-slate-950 font-black">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Multipurpose Supply Chain Platform</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-aws-orange/20 text-aws-orange border border-aws-orange/30 rounded">
              AWS CLOUD
            </span>
          </div>
          <p className="text-xs text-slate-400">Intelligent Logistics, SQS Queues, IoT Cold-Chain & DynamoDB Store</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* AWS Infrastructure Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
          <Cloud className="w-4 h-4 text-aws-orange" />
          <span className="text-slate-300">AWS Region:</span>
          <span className="font-mono text-white font-medium">us-east-1</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Alerts count badge */}
        <div className="relative flex items-center">
          <button
            title="SNS Alerts Feed"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {criticalCount}
              </span>
            )}
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-aws-orange' : ''}`} />
          <span>Sync Cloud</span>
        </button>
      </div>
    </header>
  );
}
