import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Award,
  BarChart3,
  Calendar,
  Download,
  Flame,
  Clock,
  Target,
  GraduationCap,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ProfileAnalytics: React.FC = () => {
  const {
    profile,
    updateProfile,
    readinessScore,
    readinessBreakdown,
    codingProblems,
    tasks,
    jobApplications,
    mockResults,
    isDarkMode,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Readiness components bar data
  const readinessComponents = [
    { name: 'Task Sprints (25%)', score: readinessBreakdown.taskScore, fill: '#6366f1' },
    { name: 'DSA & Coding (25%)', score: readinessBreakdown.codingScore, fill: '#10b981' },
    { name: 'Aptitude Tests (25%)', score: readinessBreakdown.aptitudeScore, fill: '#f59e0b' },
    { name: 'Resume ATS (25%)', score: readinessBreakdown.resumeScore, fill: '#8b5cf6' },
  ];

  // Activity heatmap simulated days (last 28 days)
  const activityDays = Array.from({ length: 28 }, (_, i) => {
    const intensity = (i * 7 + 3) % 5; // 0 to 4
    return { day: i + 1, intensity };
  });

  const handleExportSummary = () => {
    const report = {
      student: profile.name,
      college: profile.college,
      cgpa: profile.cgpa,
      targetCompany: profile.targetCompany,
      overallReadinessScore: `${readinessScore}%`,
      breakdown: readinessBreakdown,
      totalCodingProblemsSolved: codingProblems.filter((p) => p.status === 'Solved').length,
      tasksCompleted: tasks.filter((t) => t.status === 'completed').length,
      applicationsLogged: jobApplications.length,
      exportTimestamp: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CareerForge_Placement_Report_${profile.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Student Profile & Placement Readiness Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit your cumulative candidate portfolio score, learning consistency, and export readiness transcripts.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Readiness Report</span>
        </button>
      </div>

      {/* Profile Overview & Edit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Profile Details (5 cols) */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">{profile.name}</h3>
                <p className="text-xs text-slate-400">{profile.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {savedSuccess && (
            <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">College</span>
                <span className="font-semibold text-slate-200 text-right">{profile.college}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Degree & Branch</span>
                <span className="font-semibold text-slate-200">{profile.degree}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Current CGPA</span>
                <span className="font-bold text-emerald-400">{profile.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Graduation Year</span>
                <span className="font-semibold text-slate-200">{profile.graduationYear}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Primary Target Company</span>
                <span className="font-bold text-indigo-400">{profile.targetCompany}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Aspirant Target Role</span>
                <span className="font-semibold text-slate-200">{profile.targetRole}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">College Name</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Grad Year</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Target Company</label>
                  <input
                    type="text"
                    value={formData.targetCompany}
                    onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile Details
              </button>
            </form>
          )}
        </div>

        {/* Right: Readiness Score Composite Breakdown (7 cols) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-100">Placement Readiness Index Breakdown</h2>
              <p className="text-xs text-slate-400">Weighted evaluation across 4 pillars of hiring eligibility</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">{readinessScore}%</span>
              <span className="text-[10px] text-slate-400 block">Overall Score</span>
            </div>
          </div>

          {/* Bar chart of breakdown */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessComponents} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {readinessComponents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-slate-700/40">
            <div>
              <span className="text-slate-400 block text-[10px]">Tasks</span>
              <span className="font-bold text-indigo-400">{readinessBreakdown.taskScore}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DSA / Coding</span>
              <span className="font-bold text-emerald-400">{readinessBreakdown.codingScore}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Aptitude Mocks</span>
              <span className="font-bold text-amber-400">{readinessBreakdown.aptitudeScore}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Resume Match</span>
              <span className="font-bold text-purple-400">{readinessBreakdown.resumeScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Grid */}
      <div className={`p-6 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-sm text-slate-100">28-Day Consistency Heatmap</h2>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-900/60" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5 pt-2">
          {activityDays.map((d) => {
            const colors = [
              'bg-slate-800/80',
              'bg-emerald-950 border border-emerald-900',
              'bg-emerald-800',
              'bg-emerald-600',
              'bg-emerald-400',
            ];
            return (
              <div
                key={d.day}
                className={`h-8 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-300 transition-transform hover:scale-110 cursor-pointer ${
                  colors[d.intensity]
                }`}
                title={`Day ${d.day}: ${d.intensity * 2 + 1} study hours logged`}
              >
                {d.day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
