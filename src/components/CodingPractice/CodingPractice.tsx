import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CodingProblem, CodingPlatform } from '../../types';
import { upcomingContests } from '../../data/initialData';
import {
  Code2,
  Plus,
  Flame,
  Target,
  Trophy,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Search,
  Filter,
  X,
} from 'lucide-react';

export const CodingPractice: React.FC = () => {
  const {
    codingProblems,
    dailyCodingGoal,
    setDailyCodingGoal,
    addCodingProblem,
    updateCodingProblemStatus,
    profile,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode' as CodingPlatform,
    difficulty: 'Medium' as CodingProblem['difficulty'],
    topic: 'Dynamic Programming',
    status: 'Solved' as CodingProblem['status'],
    solutionUrl: '',
    notes: '',
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const solvedToday = codingProblems.filter(
    (p) => p.status === 'Solved' && p.solvedDate === todayStr
  ).length;

  const totalSolved = codingProblems.filter((p) => p.status === 'Solved').length;
  const easyCount = codingProblems.filter((p) => p.difficulty === 'Easy' && p.status === 'Solved').length;
  const mediumCount = codingProblems.filter((p) => p.difficulty === 'Medium' && p.status === 'Solved').length;
  const hardCount = codingProblems.filter((p) => p.difficulty === 'Hard' && p.status === 'Solved').length;

  const filteredProblems = codingProblems.filter((p) => {
    const matchesPlatform = platformFilter === 'All' || p.platform === platformFilter;
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.topic.toLowerCase().includes(term) ||
      p.platform.toLowerCase().includes(term) ||
      (p.notes && p.notes.toLowerCase().includes(term));

    return matchesPlatform && matchesDiff && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addCodingProblem({
      ...formData,
    });
    setShowAddModal(false);
    setFormData({
      title: '',
      platform: 'LeetCode',
      difficulty: 'Medium',
      topic: 'Arrays',
      status: 'Solved',
      solutionUrl: '',
      notes: '',
    });
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Coding Practice & DSA Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log algorithmic problems from LeetCode, CodeChef, HackerRank, and track contest schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="log-problem-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Solved Problem</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Goal Card */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Daily Goal</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-100">{solvedToday}</span>
            <span className="text-xs text-slate-400">/ {dailyCodingGoal} Today</span>
          </div>
          <div className="mt-2 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all"
              style={{ width: `${Math.min(100, (solvedToday / dailyCodingGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* Total Solved */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Solved</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{totalSolved}</span>
            <span className="text-xs text-slate-400">Problems</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Across 4 major platforms</p>
        </div>

        {/* Difficulty Breakdown */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Difficulty Split</span>
            <Code2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold">{easyCount} Easy</span>
            <span className="text-amber-400 font-bold">{mediumCount} Med</span>
            <span className="text-rose-400 font-bold">{hardCount} Hard</span>
          </div>
          <div className="mt-2 flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
            <div className="bg-emerald-500" style={{ width: `${totalSolved ? (easyCount / totalSolved) * 100 : 33}%` }} />
            <div className="bg-amber-500" style={{ width: `${totalSolved ? (mediumCount / totalSolved) * 100 : 33}%` }} />
            <div className="bg-rose-500" style={{ width: `${totalSolved ? (hardCount / totalSolved) * 100 : 33}%` }} />
          </div>
        </div>

        {/* Streak */}
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Coding Streak</span>
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-400">{profile.currentStreak} Days</span>
            <span className="text-xs text-slate-400">Active</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Keep problem solving every day</p>
        </div>
      </div>

      {/* Main Row: Problems Table + Contests Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problems Tracker */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Platform:</span>
              {['All', 'LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    platformFilter === plat
                      ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Problem List Table */}
          <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
            <div className="divide-y divide-inherit">
              {filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  id={`coding-prob-${prob.id}`}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/50 text-slate-300">
                        {prob.platform}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px]">• {prob.topic}</span>
                    </div>

                    <h3 className="font-semibold text-slate-100 text-sm">{prob.title}</h3>

                    {prob.notes && <p className="text-[11px] text-slate-400">{prob.notes}</p>}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={prob.status}
                      onChange={(e) => updateCodingProblemStatus(prob.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 outline-none font-semibold text-[11px]"
                    >
                      <option value="Solved">Solved ✓</option>
                      <option value="Revision Needed">Revision Needed ↻</option>
                      <option value="Attempted">Attempted</option>
                    </select>

                    {prob.solutionUrl && (
                      <a
                        href={prob.solutionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                        title="Problem link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Contests */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Live & Upcoming Contests
          </div>

          <div className="space-y-3">
            {upcomingContests.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border space-y-2.5 ${cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                    {c.platform}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.duration}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-xs">{c.name}</h4>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {c.date} • {c.time}
                  </span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    Register <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Problem Modal */}
      {showAddModal && (
        <div
          id="add-problem-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-slate-100">Log Solved Coding Problem</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lowest Common Ancestor in Binary Search Tree"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="HackerRank">HackerRank</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Topic / Pattern Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Trees, Two Pointers, Dynamic Programming"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Problem URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={formData.solutionUrl}
                  onChange={(e) => setFormData({ ...formData, solutionUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Key Algorithmic Notes</label>
                <textarea
                  rows={2}
                  placeholder="Time/Space complexity, edge cases, corner cases..."
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
                  Log Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
