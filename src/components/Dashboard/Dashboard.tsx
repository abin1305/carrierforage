import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Trophy,
  Flame,
  Calendar,
  BookOpen,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  ArrowUpRight,
  TrendingUp,
  Target,
  FileCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    profile,
    tasks,
    readinessScore,
    readinessBreakdown,
    codingProblems,
    companies,
    mockResults,
    isDarkMode,
    setActiveTab,
    toggleTaskComplete,
  } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueTasks = tasks.filter((t) => t.status === 'overdue').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  // Weekly study progress data
  const weeklyProgressData = [
    { day: 'Mon', hours: 4.5, problems: 3 },
    { day: 'Tue', hours: 5.0, problems: 4 },
    { day: 'Wed', hours: 3.5, problems: 2 },
    { day: 'Thu', hours: 6.0, problems: 5 },
    { day: 'Fri', hours: 4.0, problems: 3 },
    { day: 'Sat', hours: 7.5, problems: 6 },
    { day: 'Sun', hours: 5.5, problems: 4 },
  ];

  // Skill radar data
  const skillDevelopmentData = [
    { subject: 'Data Structures', current: 85, fullMark: 100 },
    { subject: 'Web Dev & API', current: 90, fullMark: 100 },
    { subject: 'Core CS (DBMS/OS)', current: 78, fullMark: 100 },
    { subject: 'Quantitative Apt', current: 82, fullMark: 100 },
    { subject: 'Logical Reasoning', current: 88, fullMark: 100 },
    { subject: 'HR & Communication', current: 80, fullMark: 100 },
  ];

  // Task status distribution
  const taskStatusData = [
    { name: 'Completed', value: completedTasks || 1, color: '#10b981' },
    { name: 'In Progress / Pending', value: pendingTasks || 1, color: '#6366f1' },
    { name: 'Overdue', value: overdueTasks || 0, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  // Placement readiness target companies
  const targetCompanies = companies.slice(0, 4);

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div
        id="dashboard-hero-card"
        className={`p-6 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border-slate-700/60'
            : 'bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Placement Season 2026
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Target: {profile.targetCompany}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              You are on a <span className="font-semibold text-orange-400">{profile.currentStreak}-day learning streak</span>. Your placement readiness composite is currently <span className="font-semibold text-emerald-400">{readinessScore}%</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="action-start-mock-apt-btn"
              onClick={() => setActiveTab('aptitude')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Start Aptitude Mock</span>
            </button>
            <button
              id="action-ai-mock-interview-btn"
              onClick={() => setActiveTab('interview')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-400" />
              <span>AI Mock Interview</span>
            </button>
            <button
              id="action-view-resume-ats-btn"
              onClick={() => setActiveTab('resume')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>ATS Resume Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Readiness Score */}
        <div id="stat-readiness-score" className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Readiness Score</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{readinessScore}%</span>
            <span className="text-[11px] text-slate-400">Tier-1 Qualified</span>
          </div>
          <div className="mt-2 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${readinessScore}%` }} />
          </div>
        </div>

        {/* Total & Completed Tasks */}
        <div id="stat-tasks-summary" className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Task Completion</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-100">
              {completedTasks} <span className="text-sm font-normal text-slate-400">/ {totalTasks}</span>
            </span>
            <span className="text-[11px] text-indigo-400">
              {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}% Done
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            {pendingTasks} pending, {overdueTasks} overdue
          </p>
        </div>

        {/* Learning Streak */}
        <div id="stat-streak-metric" className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Learning Streak</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-400">{profile.currentStreak} Days</span>
            <span className="text-[11px] text-slate-400">Best: {profile.longestStreak}d</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Consistent daily practice</p>
        </div>

        {/* Study Hours This Week */}
        <div id="stat-hours-metric" className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hours This Week</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-400">{profile.studyHoursThisWeek}h</span>
            <span className="text-[11px] text-slate-400">Goal: 30h</span>
          </div>
          <div className="mt-2 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all"
              style={{ width: `${Math.min(100, Math.round((profile.studyHoursThisWeek / 30) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study & Problems Graph (2 cols) */}
        <div id="chart-weekly-progress" className={`lg:col-span-2 p-5 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Weekly Activity & Study Velocity</h2>
              <p className="text-xs text-slate-400">Daily hours invested and coding problems solved</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Hours
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Problems
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgressData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                <Area type="monotone" dataKey="problems" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProblems)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Development Radar (1 col) */}
        <div id="chart-skill-radar" className={`p-5 rounded-xl border ${cardBg}`}>
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-slate-100">Skill Competency Radar</h2>
            <p className="text-xs text-slate-400">Assessment across placement dimensions</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillDevelopmentData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                <Radar name="Proficiency" dataKey="current" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Company Progress & Deadlines & Task Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Preparation Status */}
        <div id="widget-target-companies" className={`p-5 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Target Companies Track</h2>
              <p className="text-xs text-slate-400">Eligibility & preparation status</p>
            </div>
            <button
              id="view-all-companies-btn"
              onClick={() => setActiveTab('placement')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {targetCompanies.map((comp) => (
              <div
                key={comp.id}
                id={`company-track-item-${comp.id}`}
                onClick={() => setActiveTab('placement')}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {comp.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{comp.name}</h3>
                    <p className="text-[11px] text-slate-400">{comp.ctcRange}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    comp.status === 'ready'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : comp.status === 'in_progress'
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : comp.status === 'applied'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-700/40 text-slate-400'
                  }`}
                >
                  {comp.status === 'in_progress'
                    ? 'In Progress'
                    : comp.status === 'ready'
                    ? 'Ready'
                    : comp.status === 'applied'
                    ? 'Applied'
                    : 'Not Started'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div id="widget-upcoming-deadlines" className={`p-5 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Upcoming Deadlines</h2>
              <p className="text-xs text-slate-400">Prioritized placement milestones</p>
            </div>
            <button
              id="view-all-tasks-btn"
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              Tasks <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No upcoming pending tasks</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  id={`deadline-task-${t.id}`}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    isDarkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      id={`check-task-${t.id}`}
                      onClick={() => toggleTaskComplete(t.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p className="font-medium text-slate-200 leading-tight line-clamp-1">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {t.deadline}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                            t.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-400'
                              : t.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-700/40 text-slate-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Breakdown Donut */}
        <div id="widget-task-donut" className={`p-5 rounded-xl border ${cardBg}`}>
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-slate-100">Task Completion Breakdown</h2>
            <p className="text-xs text-slate-400">Proportion of active vs completed work</p>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400">Completed: {completedTasks}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-slate-400">Active: {pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
