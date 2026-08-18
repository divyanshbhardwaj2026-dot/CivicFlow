import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building2,
  User,
  Clock,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  MessageSquare,
  Star,
  ArrowRight,
  ShieldCheck,
  Activity,
  Send,
  Image as ImageIcon,
  Check,
  FileText,
  AlertCircle,
  CornerDownRight,
  Shield,
  Phone,
} from 'lucide-react';
import { Complaint, ComplaintStatus, Priority, User as UserType } from '../../types';
import { api } from '../../lib/api';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onComplaintUpdated?: (updated: Complaint) => void;
  isAdmin?: boolean;
  currentUser?: UserType | null;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onComplaintUpdated,
  isAdmin = false,
  currentUser,
}) => {
  const [rating, setRating] = useState(complaint?.feedback?.rating || 5);
  const [feedbackComment, setFeedbackComment] = useState(complaint?.feedback?.comment || '');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!complaint?.feedback);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // New comment input
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Admin action states
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!complaint) return null;

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const updated = await api.submitFeedback(complaint.id, rating, feedbackComment);
      setFeedbackSubmitted(true);
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const authorId = currentUser?.id || (isAdmin ? 'usr-admin-default' : complaint.citizen_id || 'usr-citizen-default');
      const authorName = currentUser?.name || (isAdmin ? 'Department Administrator' : complaint.citizen_name || 'Citizen Resident');
      const authorRole = currentUser?.role || (isAdmin ? 'DEPARTMENT_ADMIN' : 'CITIZEN');

      const updated = await api.addComment(complaint.id, {
        author_id: authorId,
        author_name: authorName,
        author_role: authorRole,
        text: newCommentText.trim(),
        is_internal: false,
      });

      setNewCommentText('');
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleResolve = async () => {
    setUpdatingStatus(true);
    try {
      const updated = await api.resolveComplaint(complaint.id, {
        resolution_notes: resolutionNotes || 'Issue rectified by municipal engineering squad.',
        resolved_by: currentUser?.name || 'Department Administrator',
        action_taken: actionTaken || 'Field inspection & repair work completed',
        after_image_url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&auto=format&fit=crop&q=80',
      });
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      console.error('Resolve error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const timelineEvents = complaint.timeline && complaint.timeline.length > 0
    ? complaint.timeline
    : (complaint.history || []).map((h, idx) => ({
        id: h.id || `ev-${idx}`,
        event: h.new_status,
        timestamp: h.timestamp,
        actor: h.changed_by || 'System',
        notes: h.comment,
        status: h.new_status,
      }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in font-sans">
      <div
        id="complaint-detail-modal"
        className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl p-6 sm:p-8 shadow-xl text-slate-900 relative my-8 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                #{complaint.id}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityStyles[complaint.priority] || priorityStyles[Priority.MEDIUM]}`}>
                {complaint.priority} Priority
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusStyles[complaint.status] || statusStyles[ComplaintStatus.SUBMITTED]}`}>
                {complaint.status.replace('_', ' ')}
              </span>
              {complaint.sla_deadline && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  complaint.is_breached ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  SLA: {new Date(complaint.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({complaint.sla_hours || 48}h)
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{complaint.category.replace(/_/g, ' ')}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Location & Jurisdiction Ribbon */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">{complaint.location}</span>
                <span className="text-[11px] text-slate-500">{complaint.city_name} {complaint.ward_name ? `• ${complaint.ward_name}` : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:justify-end text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] block">Submitted: {new Date(complaint.created_at).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Citizen: {complaint.citizen_name || 'Resident'}</span>
              </div>
            </div>
          </div>

          {/* Grievance Text & Supporting Images */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Citizen Grievance Text ({complaint.original_language || 'Multilingual'}):
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{complaint.description}</p>
            </div>

            {complaint.normalized_text && complaint.normalized_text !== complaint.description && (
              <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" /> AI Normalized Summary:
                </span>
                <p className="text-xs text-blue-950 leading-relaxed">{complaint.normalized_text}</p>
              </div>
            )}

            {/* Photo Attachment (if any) */}
            {(complaint.image_url || (complaint.attachments && complaint.attachments.length > 0)) && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> Attached Evidence Photos:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[complaint.image_url, ...(complaint.attachments || [])].filter(Boolean).map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-24 h-20 object-cover rounded-lg border border-slate-300 hover:opacity-90 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Decision Support & Action Recommendation */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> AI Action & Routing Recommendation
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {(complaint.ai_confidence * 100).toFixed(0)}% Triage Confidence
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {complaint.suggested_action || 'Inspect field condition and execute standard departmental operating procedure.'}
            </p>

            {complaint.related_complaints_count && complaint.related_complaints_count > 0 ? (
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {complaint.related_complaints_count} related citizen reports clustered in this zone
                  {complaint.cluster_id ? ' (Linked to Active Incident Cluster)' : ''}
                </span>
              </div>
            ) : null}
          </div>

          {/* Department, Jurisdiction & Officer Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Department</span>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <span className="font-bold text-slate-900">{complaint.department_name || 'Municipal Redressal Cell'}</span>
              </div>
              {complaint.jurisdiction_name && (
                <div className="text-[11px] text-slate-500 pl-6">
                  Jurisdiction: <span className="font-medium text-slate-700">{complaint.jurisdiction_name}</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Administrator / Officer</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="font-bold text-slate-900">{complaint.assigned_officer_name || complaint.administrator_name || 'Pending Zonal Pickup'}</span>
              </div>
              {complaint.officer_phone && (
                <div className="text-[11px] text-slate-500 pl-6 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{complaint.officer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Evidence (If Resolved) */}
          {complaint.resolution_evidence && (
            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field Resolution Evidence & Officer Report</span>
              </div>
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">Action Taken:</strong> {complaint.resolution_evidence.action_taken || 'Repairs completed'}
              </p>
              {complaint.resolution_evidence.after_image_url && (
                <div className="mt-2">
                  <span className="text-[11px] font-bold text-emerald-900 block mb-1">Post-Resolution Photo Verification:</span>
                  <img
                    src={complaint.resolution_evidence.after_image_url}
                    alt="Resolved evidence"
                    className="w-32 h-24 object-cover rounded-lg border border-emerald-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Status Timeline History */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-700" />
              <span>Full Routing & Resolution Timeline</span>
            </span>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineEvents.map((t: any, idx: number) => (
                <div key={t.id || idx} className="flex items-start gap-3 relative pl-6">
                  <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {t.status || t.event || 'Status Update'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {t.notes && <p className="text-[11px] text-slate-600 mt-1">{t.notes}</p>}
                    <div className="text-[10px] text-slate-400 mt-1">Performer: {t.actor || 'Municipal Workflow Engine'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Comments & Updates Thread */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-700" />
                <span>Grievance Updates & Administrator Responses ({complaint.comments?.length || 0})</span>
              </span>
            </div>

            {/* List of comments */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {complaint.comments && complaint.comments.length > 0 ? (
                complaint.comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-lg border text-xs ${
                      c.author_role === 'DEPARTMENT_ADMIN' || c.author_role === 'CITY_ADMIN' || c.author_role === 'OFFICER'
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{c.author_name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                          {c.author_role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-500 py-2 text-center italic">
                  No comments yet. Administrators and citizens can post progress updates below.
                </div>
              )}
            </div>

            {/* Post new comment */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder="Post a query, update, or response..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-blue-600 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newCommentText.trim()}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingComment ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>

          {/* Citizen Feedback Rating Submission */}
          {complaint.status === ComplaintStatus.RESOLVED && (
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-emerald-900">Citizen Resolution Feedback</span>
              </div>

              {feedbackSubmitted ? (
                <div className="text-xs text-slate-700">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                    ))}
                    <span className="font-bold ml-1 text-slate-900">{rating} / 5 Stars</span>
                  </div>
                  {feedbackComment && <p className="italic text-slate-600 text-[11px]">"{feedbackComment}"</p>}
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(starVal => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${starVal <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} Star Rating</span>
                  </div>
                  <input
                    type="text"
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Share quick feedback on resolution speed & quality..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs cursor-pointer"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Citizen Feedback'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Administrator Action Bar inside Detail Modal */}
          {isAdmin && complaint.status !== ComplaintStatus.RESOLVED && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 mt-2 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Administrator Official Resolution</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={actionTaken}
                  onChange={e => setActionTaken(e.target.value)}
                  placeholder="Action taken (e.g. Cleared 2 metric tons of waste)..."
                  className="px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Official closing remarks / sign-off notes..."
                  className="px-3 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={handleResolve}
                disabled={updatingStatus}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{updatingStatus ? 'Resolving...' : 'Confirm Resolution & Sign Off'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

