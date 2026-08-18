import React from 'react';
import { AlertOctagon, Clock, CheckCircle2, FileText, TrendingUp, Sparkles, ShieldAlert } from 'lucide-react';
import { DashboardMetrics } from '../../types';

interface KPIGridProps {
  metrics: DashboardMetrics | null;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics }) => {
  const m = metrics || {
    total_complaints: 1842,
    pending_complaints: 284,
    resolved_complaints: 1512,
    in_progress_complaints: 46,
    critical_complaints: 14,
    high_priority_complaints: 89,
    average_resolution_hours: 18.5,
    ai_routed_percentage: 96,
    active_clusters: 3,
    today_new_complaints: 18,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {/* Total Complaints */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider">Total Complaints</span>
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{m.total_complaints.toLocaleString()}</div>
        <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{m.today_new_complaints} logged today</span>
        </div>
      </div>

      {/* Critical Emergencies */}
      <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between text-rose-800">
          <span className="text-xs font-bold uppercase tracking-wider">Critical Alerts</span>
          <AlertOctagon className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-3xl font-black text-rose-700 mt-2 tracking-tight">{m.critical_complaints}</div>
        <div className="text-xs text-rose-700 font-semibold mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          <span>Immediate SLA &lt; 2h</span>
        </div>
      </div>

      {/* Pending / In Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-3xl font-black text-amber-700 mt-2 tracking-tight">{m.pending_complaints}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          <span>{m.in_progress_complaints} currently in field</span>
        </div>
      </div>

      {/* AI Routed Rate & Resolution */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider">AI Autonomous Routing</span>
          <Sparkles className="w-4 h-4 text-blue-700" />
        </div>
        <div className="text-3xl font-black text-blue-700 mt-2 tracking-tight">{m.ai_routed_percentage}%</div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          <span>Avg resolution: {m.average_resolution_hours}h</span>
        </div>
      </div>
    </div>
  );
};
