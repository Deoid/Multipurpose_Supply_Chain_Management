import React from 'react';

const STATUS_STYLES = {
  OPTIMAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  VERIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  
  LOW_STOCK: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  PROCESSING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',

  QUEUED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  IN_TRANSIT: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/30',

  CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  BREACH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default function StatusBadge({ status }) {
  const norm = String(status || '').toUpperCase();
  const style = STATUS_STYLES[norm] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
}
