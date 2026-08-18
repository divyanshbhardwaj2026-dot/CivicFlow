import React, { useEffect } from 'react';
import { X, Sparkles, Bell, ArrowRight, ShieldAlert } from 'lucide-react';
import { SSEEvent, Complaint } from '../types';

interface RealtimeToastProps {
  event: SSEEvent | null;
  onClose: () => void;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const RealtimeToast: React.FC<RealtimeToastProps> = ({ event, onClose, onSelectComplaint }) => {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-slate-200 rounded-xl p-4 shadow-lg text-slate-900 animate-slide-up font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 flex-shrink-0 mt-0.5">
            {event.type === 'cluster_created' || event.type === 'cluster_updated' ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Live Broadcast
              </span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{event.data?.message || 'New civic event recorded'}</p>
            {event.data?.complaint && (
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {event.data.complaint.category.replace('_', ' ')} • {event.data.complaint.location}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {event.data?.complaint && onSelectComplaint && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={() => {
              onSelectComplaint(event.data.complaint);
              onClose();
            }}
            className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Dossier</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
