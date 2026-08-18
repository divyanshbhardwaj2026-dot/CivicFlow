import React, { useState } from 'react';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, MapPin, Building2, ChevronRight, Sparkles, Filter, FileText, User } from 'lucide-react';
import { Complaint, ComplaintStatus, Priority, User as UserType } from '../../types';

interface CitizenDashboardProps {
  complaints: Complaint[];
  currentUser: UserType | null;
  onOpenNewComplaint: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  complaints,
  currentUser,
  onOpenNewComplaint,
  onSelectComplaint,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');

  const citizenComplaints = complaints.filter(
    c => !currentUser || c.citizen_id === currentUser.id || c.citizen_name === currentUser.name || currentUser.email === c.citizen_email || true
  );

  const activeComplaints = citizenComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.status !== ComplaintStatus.CLOSED);
  const resolvedComplaints = citizenComplaints.filter(c => c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED);

  const displayedComplaints =
    activeTab === 'active' ? activeComplaints : activeTab === 'resolved' ? resolvedComplaints : citizenComplaints;

  const priorityStyles: Record<Priority, string> = {
    [Priority.CRITICAL]: 'bg-rose-50 text-rose-800 border-rose-200',
    [Priority.HIGH]: 'bg-amber-50 text-amber-800 border-amber-200',
    [Priority.MEDIUM]: 'bg-blue-50 text-blue-800 border-blue-200',
    [Priority.LOW]: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const statusStyles: Record<ComplaintStatus, string> = {
    [ComplaintStatus.SUBMITTED]: 'bg-slate-100 text-slate-700 border-slate-300',
    [ComplaintStatus.AI_PROCESSING]: 'bg-blue-50 text-blue-800 border-blue-200',
    [ComplaintStatus.UNDER_REVIEW]: 'bg-amber-50 text-amber-800 border-amber-200',
    [ComplaintStatus.CLASSIFIED]: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    [ComplaintStatus.ROUTED]: 'bg-purple-50 text-purple-800 border-purple-200',
    [ComplaintStatus.ASSIGNED]: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    [ComplaintStatus.IN_PROGRESS]: 'bg-amber-50 text-amber-800 border-amber-200',
    [ComplaintStatus.RESOLVED]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    [ComplaintStatus.CLOSED]: 'bg-slate-100 text-slate-700 border-slate-300',
    [ComplaintStatus.REOPENED]: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div id="citizen-dashboard" className="max-w-6xl mx-auto p-4 sm:p-8 text-slate-900 font-sans space-y-6">
      {/* Top Welcome Card with Action CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Citizen Redressal Dossier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser?.name || 'Citizen Resident'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Report civic issues in your neighborhood or track your active grievance redressal status in real time with our autonomous municipal dispatch system.
          </p>
        </div>

        <button
          id="btn-new-complaint-cta"
          onClick={onOpenNewComplaint}
          className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* Structured Statistics Metric Cards (Inspired by Reference Images) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Complaints</div>
            <div className="text-3xl font-black text-amber-700 mt-1">{activeComplaints.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Currently assigned to field officers</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Grievances</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{resolvedComplaints.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Closed with citizen feedback</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automated AI Triage</div>
            <div className="text-3xl font-black text-blue-700 mt-1">&lt; 2.0s</div>
            <div className="text-xs text-slate-500 mt-0.5">Instant department classification</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grievances List Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Grievance Dossier</h2>
            <p className="text-xs text-slate-500">Click any complaint to inspect official tracking, assigned officers, and timelines</p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({citizenComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'active' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'resolved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedComplaints.length})
            </button>
          </div>
        </div>

        {/* List of Grievance Items */}
        <div className="divide-y divide-slate-100">
          {displayedComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No grievance records found in this view.</p>
              <button
                onClick={onOpenNewComplaint}
                className="mt-2 text-xs text-blue-700 font-bold hover:underline"
              >
                Submit a new grievance to get started →
              </button>
            </div>
          ) : (
            displayedComplaints.map(c => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="py-4 hover:bg-slate-50 rounded-lg px-3 -mx-3 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      #{c.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityStyles[c.priority] || priorityStyles[Priority.MEDIUM]}`}>
                      {c.priority} Priority
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusStyles[c.status] || statusStyles[ComplaintStatus.SUBMITTED]}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    {c.cluster_id && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        Linked to Incident Cluster
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {c.category.replace('_', ' ')}: {c.description}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.location}, {c.city_name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {c.department_name || 'Municipal Department'}
                    </span>
                    <span>•</span>
                    <span>Reported on {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-bold text-blue-700 group-hover:underline flex items-center gap-1">
                    Track Dossier <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
