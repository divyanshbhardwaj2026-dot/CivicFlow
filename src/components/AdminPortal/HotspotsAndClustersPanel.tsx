import React from 'react';
import { Flame, ShieldAlert, Users, ArrowRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { ComplaintCluster } from '../../types';

interface HotspotsAndClustersPanelProps {
  clusters: ComplaintCluster[];
  onSelectCluster: (cluster: ComplaintCluster) => void;
  onDispatchCluster?: (clusterId: string) => void;
}

export const HotspotsAndClustersPanel: React.FC<HotspotsAndClustersPanelProps> = ({
  clusters,
  onSelectCluster,
  onDispatchCluster,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs font-sans space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-600" />
          <h3 className="font-bold text-sm text-slate-900">Active Incident Clusters &amp; Hotspots</h3>
        </div>
        <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          {clusters.length} Critical Outbreaks
        </span>
      </div>

      <p className="text-xs text-slate-500">
        AI spatial clustering detects correlated grievances across neighborhoods, isolating acute infrastructure failures for rapid batch response.
      </p>

      {/* Cluster List */}
      <div className="space-y-3">
        {clusters.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-semibold">
            No active emergency incident clusters detected.
          </div>
        ) : (
          clusters.map(cluster => {
            const count = cluster.complaint_count || (cluster.member_complaint_ids || []).length || 3;
            const locationText = cluster.location || (cluster as any).location_summary || 'Zonal Ward';

            return (
              <div
                key={cluster.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                        {cluster.id}
                      </span>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {count} Linked Grievances
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{cluster.title}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {((cluster.confidence || 0.95) * 100).toFixed(0)}% Match
                    </span>
                  </div>
                </div>

                {/* Location and Category */}
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {locationText}, {cluster.city_name}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{cluster.category.replace('_', ' ')}</span>
                </div>

                {/* AI Recommended Municipal Action */}
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>AI Recommended Response:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{cluster.recommended_action}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectCluster(cluster)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Inspect Linked Reports</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {cluster.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => onDispatchCluster && onDispatchCluster(cluster.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Dispatch Emergency Crew</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Squad Dispatched</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
