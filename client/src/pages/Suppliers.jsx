import React, { useState, useEffect } from 'react';
import { Building2, Star, Clock, CheckCircle2, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { fetchSuppliers } from '../services/api';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSuppliers();
        if (res.success) setSuppliers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Supplier Relationship Management (SRM)</h2>
            <AwsArchitectureBadge service="dynamodb" action="Vendor Master Registry" />
          </div>
          <p className="text-xs text-slate-400">
            Monitor vendor reliability scores, contract lead times, and digital quality certifications.
          </p>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading verified suppliers...</div>
        ) : (
          suppliers.map((sup) => (
            <div
              key={sup.supplierId}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-aws-orange font-bold">{sup.supplierId}</span>
                  <StatusBadge status={sup.status} />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{sup.name}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] mb-3">
                  {sup.category}
                </span>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{sup.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-400 text-[11px] truncate">{sup.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Lead Time: <strong className="text-white">{sup.leadTimeDays} Days</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{sup.rating} / 5.0</span>
                </div>
                <div className="text-xs text-slate-400">
                  Reliability: <strong className="text-emerald-400">{sup.reliabilityRate}%</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
