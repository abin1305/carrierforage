import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  BrainCircuit,
  MessageSquareCode,
  Code2,
  CheckSquare,
  Map,
  Briefcase,
  FileText,
  LineChart,
  GraduationCap,
  Flame,
  X,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, isDarkMode, tasks, jobs, companies, codingProblems } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const activeInterviews = jobs.filter((j) => j.status === 'Interview Scheduled').length;
  const solvedCodingCount = codingProblems.filter((p) => p.status === 'Solved').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'placement', label: 'Placement Prep', icon: Building2, badge: `${companies.length} Cos` },
    { id: 'aptitude', label: 'Aptitude Practice', icon: BrainCircuit },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquareCode },
    { id: 'coding', label: 'Coding Tracker', icon: Code2, badge: solvedCodingCount, badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, badge: pendingTasksCount, badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'roadmaps', label: 'Career Roadmaps', icon: Map },
    { id: 'jobs', label: 'Internships & Jobs', icon: Briefcase, badge: activeInterviews > 0 ? `${activeInterviews} Int` : undefined, badgeColor: 'bg-indigo-500/20 text-indigo-400' },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'profile', label: 'Profile & Analytics', icon: LineChart },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        id="main-app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">CareerForge</span>
              <span className="text-[10px] text-slate-400 font-medium block">Student Career Hub</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                      item.badgeColor || (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Motivation Card */}
        <div className="p-3 border-t border-inherit">
          <div
            className={`p-3 rounded-xl border text-xs ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[11px] flex items-center gap-1.5 text-indigo-400">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                Target Placement 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Complete 2 mock interviews & 3 coding problems daily for top product tiers.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
