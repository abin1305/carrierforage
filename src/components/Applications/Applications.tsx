import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobApplication, JobStatus } from '../../types';
import {
  Briefcase,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  MapPin,
} from 'lucide-react';

const STATUSES: { id: JobStatus; label: string; color: string }[] = [
  { id: 'Applied', label: 'Applied', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { id: 'Assessment', label: 'OA Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'Interview Scheduled', label: 'Interview Scheduled', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'Selected', label: 'Offer Received', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
];

export const Applications: React.FC = () => {
  const {
    jobs,
    addJobApplication,
    updateJobApplication,
    updateJobStatus,
    deleteJobApplication,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    type: 'Full-Time' as JobApplication['type'],
    status: 'Applied' as JobStatus,
    ctcOrStipend: '',
    location: '',
    jobUrl: '',
    nextRoundDate: '',
    notes: '',
  });

  const filteredApps = jobs.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      app.companyName.toLowerCase().includes(term) ||
      app.position.toLowerCase().includes(term) ||
      app.notes.toLowerCase().includes(term) ||
      app.location.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      companyName: '',
      position: '',
      type: 'Full-Time',
      status: 'Applied',
      ctcOrStipend: '14 - 18 LPA',
      location: 'Bengaluru / Hybrid',
      jobUrl: '',
      nextRoundDate: '',
      notes: '',
    });
    setEditingApp(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      companyName: app.companyName,
      position: app.position,
      type: app.type,
      status: app.status,
      ctcOrStipend: app.ctcOrStipend || '',
      location: app.location || '',
      jobUrl: app.jobUrl || '',
      nextRoundDate: app.nextRoundDate || '',
      notes: app.notes || '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.position.trim()) return;

    if (editingApp) {
      updateJobApplication(editingApp.id, {
        ...formData,
      });
    } else {
      addJobApplication({
        ...formData,
      });
    }
    setShowAddModal(false);
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Internship & Placement Applications Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track off-campus and on-campus application funnels, upcoming assessments, and offers.
          </p>
        </div>

        <button
          id="add-application-modal-btn"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUSES.map((st) => {
          const count = jobs.filter((a) => a.status === st.id).length;
          return (
            <button
              key={st.id}
              onClick={() => setStatusFilter(statusFilter === st.id ? 'all' : st.id)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                statusFilter === st.id
                  ? 'border-indigo-500 bg-indigo-950/30'
                  : cardBg
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-400 block truncate">{st.label}</span>
              <span className="text-xl font-bold text-slate-100 mt-1 block">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Applications Table / Cards */}
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className="p-4 border-b border-inherit flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Showing {filteredApps.length} applications
          </span>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="divide-y divide-inherit">
          {filteredApps.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No job applications found matching your criteria.
            </div>
          ) : (
            filteredApps.map((app) => {
              const statusCfg = STATUSES.find((s) => s.id === app.status) || STATUSES[0];
              return (
                <div
                  key={app.id}
                  id={`app-row-${app.id}`}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-100">{app.companyName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-300">
                        {app.type}
                      </span>
                      {app.location && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {app.location}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-slate-300">{app.position}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Applied: {app.appliedDate}
                      </span>
                      {app.ctcOrStipend && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <DollarSign className="w-3 h-3" /> {app.ctcOrStipend}
                        </span>
                      )}
                      {app.nextRoundDate && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Clock className="w-3 h-3" /> Next Round: {app.nextRoundDate}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1 line-clamp-1">{app.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => updateJobStatus(app.id, e.target.value as JobStatus)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold outline-none ${statusCfg.color} bg-slate-800`}
                    >
                      {STATUSES.map((st) => (
                        <option key={st.id} value={st.id} className="bg-slate-900 text-slate-100">
                          {st.label}
                        </option>
                      ))}
                    </select>

                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                        title="Job Posting"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleOpenEdit(app)}
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteJobApplication(app.id)}
                      className="p-1.5 rounded bg-slate-700 hover:bg-rose-600 text-slate-300 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Application Modal */}
      {showAddModal && (
        <div
          id="app-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-slate-100">
                {editingApp ? 'Edit Application' : 'Log New Application'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Atlassian"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Position / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE Intern"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Package / Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. 18 LPA or 50k/mo"
                    value={formData.ctcOrStipend}
                    onChange={(e) => setFormData({ ...formData, ctcOrStipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Next Round Date</label>
                  <input
                    type="date"
                    value={formData.nextRoundDate}
                    onChange={(e) => setFormData({ ...formData, nextRoundDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Location / Office</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad / Hybrid"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Job Link / Portal URL</label>
                <input
                  type="url"
                  placeholder="https://careers.google.com/jobs/..."
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Application Notes</label>
                <textarea
                  rows={2}
                  placeholder="Referral name, job ID, test links..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  {editingApp ? 'Save Changes' : 'Record Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
