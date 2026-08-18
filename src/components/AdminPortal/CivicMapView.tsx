import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ShieldAlert, Sparkles, ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { ComplaintCluster, Complaint, Priority } from '../../types';

interface CivicMapViewProps {
  clusters: ComplaintCluster[];
  complaints: Complaint[];
  selectedCity?: string;
  onSelectCluster: (cluster: ComplaintCluster) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CivicMapView: React.FC<CivicMapViewProps> = ({
  clusters,
  complaints,
  selectedCity = 'all',
  onSelectCluster,
  onSelectComplaint,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'clusters' | 'critical'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter complaints based on city
  const filteredComplaints = complaints.filter(
    c => selectedCity === 'all' || (c.city_name || '').toLowerCase() === selectedCity.toLowerCase()
  );

  // Filter clusters based on city
  const filteredClusters = clusters.filter(
    cl => selectedCity === 'all' || (cl.city_name || '').toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4 font-sans">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-sm text-slate-900">Spatial Incident &amp; Cluster Map</h3>
          </div>
          <p className="text-xs text-slate-500">
            Geographic density triangulation and active emergency cluster zones
          </p>
        </div>

        {/* Map Layer Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeLayer === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hotspots
            </button>
            <button
              onClick={() => setActiveLayer('clusters')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeLayer === 'clusters' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Clusters ({filteredClusters.length})
            </button>
            <button
              onClick={() => setActiveLayer('critical')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeLayer === 'critical' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical Only
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Clean Spatial Map Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
        {/* Grid Line Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />

        {/* Map Top-Right Status Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">
            {selectedCity === 'all' ? 'National Grid (5 Hubs)' : `${selectedCity} Zonal Grid`}
          </span>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
          <button
            onClick={() => setZoomLevel(z => Math.min(1.4, z + 0.1))}
            className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.1))}
            className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Spatial Incident Points Rendering */}
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Simulated Hub Coordinate Nodes */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-xs" />
              <div className="bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                Delhi Zonal Hub
              </div>
            </div>
          </div>

          <div className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-xs" />
              <div className="bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                Bengaluru Command
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow-xs" />
              <div className="bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                Mumbai Central
              </div>
            </div>
          </div>

          {/* Render Cluster Hotspots with Pulsing Rings */}
          {filteredClusters.map((cluster, idx) => {
            const leftPos = idx === 0 ? '28%' : idx === 1 ? '68%' : '42%';
            const topPos = idx === 0 ? '30%' : idx === 1 ? '70%' : '52%';
            const count = cluster.complaint_count || (cluster.member_complaint_ids || []).length || 3;

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectCluster(cluster)}
                style={{ left: leftPos, top: topPos }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              >
                {/* Cluster Pulsing Halo */}
                <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />

                {/* Pin Card */}
                <div className="relative bg-rose-700 text-white px-2.5 py-1 rounded-lg shadow-md border-2 border-white flex items-center gap-1.5 hover:scale-105 transition-transform">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">
                    {count} Reports Clustered
                  </span>
                </div>

                <div className="mt-1 bg-white/95 border border-rose-200 px-2 py-0.5 rounded text-[9px] font-bold text-rose-900 shadow-xs max-w-[140px] truncate text-center">
                  {cluster.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-700" />
            <span>Acute Incident Cluster (3+ Co-located Grievances)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span>Municipal Command Node</span>
          </span>
        </div>

        <span className="text-slate-400">Click any cluster marker to view AI emergency action plan</span>
      </div>
    </div>
  );
};
