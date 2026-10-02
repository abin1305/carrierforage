import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Flame,
  User,
  X,
  PlusCircle,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenQuickTask?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenQuickTask }) => {
  const {
    isDarkMode,
    setIsDarkMode,
    searchTerm,
    setSearchTerm,
    profile,
    readinessScore,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
            title="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search companies, questions, topics, resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border transition-all outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                isDarkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
              }`}
            />
            {searchTerm && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Add Task Button */}
          {onOpenQuickTask && (
            <button
              id="quick-add-task-btn"
              onClick={onOpenQuickTask}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Quick Task</span>
            </button>
          )}

          {/* Placement Readiness Pill */}
          <button
            id="readiness-score-pill-btn"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
              readinessScore >= 85
                ? isDarkMode
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDarkMode
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-400'
                : 'bg-amber-50 border-amber-300 text-amber-700'
            }`}
            title="Your overall Placement Readiness Score"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Readiness: {readinessScore}%</span>
          </button>

          {/* Learning Streak Pill */}
          <div
            id="streak-indicator-pill"
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
              isDarkMode
                ? 'bg-orange-950/40 border-orange-800/50 text-orange-400'
                : 'bg-orange-50 border-orange-200 text-orange-600'
            }`}
            title={`${profile.currentStreak} day learning streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span className="whitespace-nowrap">{profile.currentStreak}d Streak</span>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setIsDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown Trigger */}
          <div className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div
                id="notifications-popup-menu"
                className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-xl z-50 overflow-hidden ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="p-3.5 border-b border-inherit flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      id="clear-all-notifs-btn"
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-indigo-500 cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-inherit">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        id={`notif-item-${n.id}`}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          !n.read
                            ? isDarkMode
                              ? 'bg-slate-800/60 hover:bg-slate-800'
                              : 'bg-slate-50 hover:bg-slate-100'
                            : 'hover:bg-slate-800/20 opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === 'achievement' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                          {n.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                          {n.type === 'info' && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <p className="font-semibold">{n.title}</p>
                            <p className="text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Mini */}
          <button
            id="user-profile-nav-btn"
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2 border-l border-slate-700/50 cursor-pointer"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="hidden lg:block text-left text-xs leading-tight">
              <span className="font-semibold block truncate max-w-[110px]">{profile.name}</span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[110px]">
                {profile.targetRole.split(' ')[0]} Track
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
