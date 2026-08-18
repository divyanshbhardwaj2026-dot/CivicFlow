import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, ShieldAlert, Sparkles, MapPin, Building2, User, RefreshCw, Check, X, Shield, Clock } from 'lucide-react';
import { Complaint, ComplaintStatus, Priority, City, Department, User as UserType } from '../../types';
import { api } from '../../lib/api';

interface ComplaintsTableProps {
  complaints: Complaint[];
  cities: City[];
  departments: Department[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPriority: string;
  onSelectPriority: (priority: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onComplaintUpdated?: (complaint: Complaint) => void;
  currentUser?: UserType | null;
}

export const ComplaintsTable: React.FC<ComplaintsTableProps> = ({
  complaints,
  cities,
  departments,
  selectedCity,
  onSelectCity,
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onSelectComplaint,
  onComplaintUpdated,
  currentUser,
}) => {
  const [reassigningComplaint, setReassigningComplaint] = useState<Complaint | null>(null);
  const [targetDeptId, setTargetDeptId] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('');
  const [isReassigning, setIsReassigning] = useState(false);

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

  const handleOpenReassign = (e: React.MouseEvent, c: Complaint) => {
    e.stopPropagation();
    setReassigningComplaint(c);
    setTargetDeptId(c.department_id || departments[0]?.id || '');
    setReassignReason('');
  };

  const handleConfirmReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassigningComplaint || !targetDeptId) return;

    setIsReassigning(true);
    try {
      const selectedDept = departments.find(d => d.id === targetDeptId);
      const updated = await api.reassignComplaint(reassigningComplaint.id, {
        department_id: targetDeptId,
        department_name: selectedDept?.name,
        reason: reassignReason || 'Reassigned during municipal triage review',
        changed_by: currentUser?.name || 'Department Administrator',
      });

      if (onComplaintUpdated) onComplaintUpdated(updated);
      setReassigningComplaint(null);
    } catch (err) {
      console.error('Reassign error:', err);
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden font-sans">
      {/* Header & Filter Controls Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Live Grievance Triage &amp; Administrator Routing Feed</h3>
            <p className="text-xs text-slate-500">Autonomous category classification, jurisdiction mapping, and department admin ledger</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            Showing {complaints.length} Records
          </span>
        </div>

        {/* Filter Matrix Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
          {/* Search Field */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search keyword, location, citizen, officer, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={e => onSelectCity(e.target.value)}
            className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none"
          >
            <option value="all">All Cities</option>
            {cities.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={e => onSelectPriority(e.target.value)}
            className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value={Priority.CRITICAL}>Critical Only</option>
            <option value={Priority.HIGH}>High Priority</option>
            <option value={Priority.MEDIUM}>Medium Priority</option>
            <option value={Priority.LOW}>Low Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => onSelectStatus(e.target.value)}
            className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
            <option value={ComplaintStatus.ASSIGNED}>Assigned</option>
            <option value={ComplaintStatus.ROUTED}>Routed</option>
            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
          </select>
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Grievance ID &amp; Time</th>
              <th className="py-3 px-4">Citizen &amp; Description</th>
              <th className="py-3 px-4">Location &amp; Ward</th>
              <th className="py-3 px-4">Department &amp; Administrator</th>
              <th className="py-3 px-4">Priority &amp; SLA</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                  No grievances found matching the current filter parameters.
                </td>
              </tr>
            ) : (
              complaints.map(c => (
                <tr
                  key={c.id}
                  onClick={() => onSelectComplaint(c)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* ID and Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 group-hover:text-blue-700">#{c.id}</div>
                    <div className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>

                  {/* Description & Citizen Info */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{c.description}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <span className="font-medium text-slate-700">{c.citizen_name || 'Citizen Resident'}</span>
                      <span>• {c.original_language || 'Auto'}</span>
                    </div>
                  </td>

                  {/* Location & Ward */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{c.location}</div>
                    <div className="text-[10px] text-slate-500">{c.city_name} {c.ward_name ? `(${c.ward_name})` : ''}</div>
                  </td>

                  {/* Department & Assigned Administrator */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{c.department_name || 'Assigned Department'}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{c.assigned_officer_name || c.administrator_name || 'Pending Dispatch'}</span>
                    </div>
                  </td>

                  {/* Priority & SLA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityStyles[c.priority] || priorityStyles[Priority.MEDIUM]}`}>
                        {c.priority}
                      </span>
                    </div>
                    {c.sla_deadline ? (
                      <div className={`text-[10px] flex items-center gap-1 ${c.is_breached ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        <Clock className="w-3 h-3" />
                        <span>SLA: {new Date(c.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ) : null}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusStyles[c.status] || statusStyles[ComplaintStatus.SUBMITTED]}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={e => handleOpenReassign(e, c)}
                        className="p-1.5 rounded-md bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors shadow-2xs cursor-pointer"
                        title="Reassign Department / Administrator"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectComplaint(c);
                        }}
                        className="p-1.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors shadow-2xs cursor-pointer"
                        title="Inspect Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Reassign Modal */}
      {reassigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Reassign Complaint #{reassigningComplaint.id}</h3>
              </div>
              <button
                onClick={() => setReassigningComplaint(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReassign} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Department</label>
                <select
                  value={targetDeptId}
                  onChange={e => setTargetDeptId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reassignment Reason / Transfer Note</label>
                <input
                  type="text"
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  placeholder="e.g. Issue involves underground water line, transferring from Roads to Water Board"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassigningComplaint(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReassigning}
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isReassigning ? 'Reassigning...' : 'Confirm Reassignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

