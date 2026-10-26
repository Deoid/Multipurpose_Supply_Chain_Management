import React from 'react';
import {
  DollarSign,
  Package,
  Truck,
  ThermometerSnowflake,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Cloud,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import MetricCard from '../components/MetricCard';
import AwsArchitectureBadge from '../components/AwsArchitectureBadge';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard({ data, onRefresh }) {
  const kpis = data?.kpis || {};
  const alerts = data?.recentAlerts || [];
  const forecast = data?.demandForecast || [];
  const aws = data?.awsInfrastructure || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">SCM Global Control Tower</h2>
            <AwsArchitectureBadge service="dynamodb" action="Real-time Stream" />
          </div>
          <p className="text-sm text-slate-400">
            End-to-end visibility across multi-site warehouses, IoT cold-chain transit, and AWS SQS order queues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400">AWS Infrastructure</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {aws.mode || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Inventory Value"
          value={`$${(kpis.totalInventoryValue || 0).toLocaleString()}`}
          subtitle={`${kpis.totalSkus || 0} active SKUs tracked across hubs`}
          icon={DollarSign}
          trend="+12.4% vs last mo"
          badge={<AwsArchitectureBadge service="dynamodb" action="Stored in" />}
        />
        <MetricCard
          title="Cold-Chain Compliance"
          value={kpis.coldChainComplianceRate || '100%'}
          subtitle="Pharmaceutical temp range (2°C - 8°C)"
          icon={ThermometerSnowflake}
          trend={kpis.coldChainComplianceRate === '100%' ? '+0.0% breach' : '-2.1% breach'}
          badge={<AwsArchitectureBadge service="iot" action="Monitored via" />}
        />
        <MetricCard
          title="Active Order Pipeline"
          value={kpis.activeOrders || 0}
          subtitle={`SQS Queue Depth: ${kpis.sqsQueueDepth || 0} pending messages`}
          icon={Package}
          trend="+5 new today"
          badge={<AwsArchitectureBadge service="sqs" action="Queued by" />}
        />
        <MetricCard
          title="Fleet in Transit"
          value={kpis.inTransitShipments || 0}
          subtitle="Real-time GPS & telemetry streams"
          icon={Truck}
          trend="99.2% on-time ETA"
          badge={<AwsArchitectureBadge service="sns" action="Alerts by" />}
        />
      </div>

      {/* Analytics Charts & Live SNS Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecasting Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">AI Demand Forecasting & Throughput</h3>
              <p className="text-xs text-slate-400">Actual order volumes vs Machine Learning predictive forecast</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
              30-Day Predictive Horizon
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historical Actual Orders"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="AI Predicted Demand"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live SNS Alerts Feed */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-aws-orange" />
                <h3 className="text-base font-bold text-white">Amazon SNS Alerts Feed</h3>
              </div>
              <AwsArchitectureBadge service="sns" action="Topic" />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No alerts currently triggered. All systems nominal.</p>
              ) : (
                alerts.map((alert, idx) => (
                  <div
                    key={alert.alertId || idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs space-y-1 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={alert.severity || 'INFO'} />
                      <span className="text-[10px] text-slate-400">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-200">{alert.subject}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Fanout: Email, SMS, Webhook</span>
            <span className="text-emerald-400 font-medium">Auto-subscribed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
