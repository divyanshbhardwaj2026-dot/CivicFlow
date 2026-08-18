import React, { useState } from 'react';
import { X, Flame, Users, ShieldAlert, Sparkles, MapPin, CheckCircle, ArrowRight, Building2, AlertTriangle } from 'lucide-react';
import { ComplaintCluster, Complaint } from '../../types';

interface IncidentClusterDetailModalProps {
  cluster: ComplaintCluster | null;
  memberComplaints?: Complaint[];
  complaints?: Complaint[];
  onClose: () => void;
  onDispatchCluster?: (clusterId: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const IncidentClusterDetailModal: React.FC<IncidentClusterDetailModalProps> = ({
  cluster,
  memberComplaints = [],
  complaints = [],
  onClose,
  onDispatchCluster,
  onSelectComplaint,
}) => {
  const [isDispatching, setIsDispatching] = useState(false);

  if (!cluster) return null;

  const clusterMemberIds = cluster.member_complaint_ids || (cluster as any).complaint_ids || [];
  const linkedComplaints =
    memberComplaints.length > 0
      ? memberComplaints
      : complaints.filter(c => clusterMemberIds.includes(c.id));

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      if (onDispatchCluster) onDispatchCluster(cluster.id);
    }, 600);
  };

  const locationText = cluster.location || (cluster as any).location_summary || 'Zonal Ward';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in font-sans">
      <div
        id="incident-cluster-detail-modal"
        className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl p-6 sm:p-8 shadow-xl text-slate-900 relative my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                {cluster.id}
              </span>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                Acute Incident Cluster
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {((cluster.confidence || 0.95) * 100).toFixed(0)}% AI Triangulation
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{cluster.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Location Summary */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-slate-900">{locationText}</span>
              <span>({cluster.city_name})</span>
            </div>
            <span className="font-semibold text-slate-600">{cluster.category.replace('_', ' ')}</span>
          </div>

          {/* AI Recommended Response Plan */}
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>AI Recommended Municipal Mitigation Plan:</span>
            </div>
            <p className="text-xs leading-relaxed">{cluster.recommended_action}</p>
          </div>

          {/* Linked Citizen Reports */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                Linked Citizen Grievances ({linkedComplaints.length})
              </span>
              <span className="text-[11px] text-slate-500">Co-located within 250m radius</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              {linkedComplaints.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Linked grievances registered in system records.
                </div>
              ) : (
                linkedComplaints.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onSelectComplaint(c);
                    }}
                    className="p-3 hover:bg-white transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-slate-800">#{c.id}</span>
                        <span className="text-[10px] text-slate-500">{c.location}</span>
                      </div>
                      <p className="text-slate-700 truncate max-w-md">{c.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          {cluster.status !== 'RESOLVED' ? (
            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isDispatching ? 'Dispatching Crew...' : 'Authorize Emergency Field Squad'}</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Emergency Squad Dispatched</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
