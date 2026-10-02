import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyPrep } from '../../types';
import {
  Building2,
  Bookmark,
  CheckCircle2,
  Clock,
  GraduationCap,
  FileQuestion,
  HelpCircle,
  Users,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  Save,
} from 'lucide-react';

export const PlacementPrep: React.FC = () => {
  const {
    companies,
    updateCompanyStatus,
    toggleCompanyBookmark,
    updateCompanyNotes,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'process' | 'questions' | 'resources' | 'experiences'>('process');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [noteDraft, setNoteDraft] = useState<string>('');

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  // Initialize draft notes when selected company changes
  React.useEffect(() => {
    if (selectedCompany) {
      setNoteDraft(selectedCompany.notes || '');
    }
  }, [selectedCompanyId]);

  const filteredCompanies = companies.filter((c) => {
    const matchesTier = filterTier === 'all' || c.tier.toLowerCase().includes(filterTier.toLowerCase());
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.tier.toLowerCase().includes(term) ||
      c.notes.toLowerCase().includes(term);

    return matchesTier && matchesSearch;
  });

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Company-Wise Placement Preparation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hiring patterns, eligibility rules, previous interview questions, and senior placement archives.
          </p>
        </div>

        {/* Tier filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Tier:</span>
          {['all', 'Product', 'Service', 'Tier 1'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer capitalize ${
                filterTier === t
                  ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left Company List + Right Detailed Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Companies Sidebar / List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1">
            Companies ({filteredCompanies.length})
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredCompanies.map((c) => {
              const isSelected = c.id === selectedCompanyId;
              return (
                <div
                  key={c.id}
                  id={`company-select-${c.id}`}
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                        : 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                      : cardBg
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-700/40 text-indigo-400'
                        }`}
                      >
                        {c.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm leading-tight">{c.name}</h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{c.ctcRange}</span>
                      </div>
                    </div>

                    <button
                      id={`bookmark-company-btn-${c.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompanyBookmark(c.id);
                      }}
                      className="text-slate-400 hover:text-amber-400 p-1 cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${c.isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/30 text-slate-300">
                      {c.tier}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : c.status === 'in_progress'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : c.status === 'applied'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-700/40 text-slate-400'
                      }`}
                    >
                      {c.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Company In-Depth Hub */}
        <div className="lg:col-span-8">
          {selectedCompany ? (
            <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-inherit">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                    {selectedCompany.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-100">{selectedCompany.name}</h2>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {selectedCompany.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Estimated Package: <span className="font-semibold text-emerald-400">{selectedCompany.ctcRange}</span>
                    </p>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Prep Status:</span>
                  <select
                    id="company-status-select"
                    value={selectedCompany.status}
                    onChange={(e) => updateCompanyStatus(selectedCompany.id, e.target.value as CompanyPrep['status'])}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready">Ready for Test</option>
                    <option value="applied">Applied</option>
                  </select>
                </div>
              </div>

              {/* Eligibility Bar */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Min CGPA Criteria</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{selectedCompany.eligibility.cgpa} / 10.0</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Standing Backlogs</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {selectedCompany.eligibility.backlogsAllowed === 0 ? 'Strictly 0 Allowed' : 'Max 1 Backlog'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Eligible Branches</span>
                  <span className="font-bold text-slate-200 mt-0.5 block truncate">
                    {selectedCompany.eligibility.eligibleBranches.join(', ')}
                  </span>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="flex border-b border-inherit gap-6 text-xs font-semibold">
                <button
                  id="tab-selection-process"
                  onClick={() => setActiveTab('process')}
                  className={`pb-2.5 cursor-pointer transition-colors relative ${
                    activeTab === 'process' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Selection Rounds ({selectedCompany.selectionRounds.length})
                  {activeTab === 'process' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
                <button
                  id="tab-previous-questions"
                  onClick={() => setActiveTab('questions')}
                  className={`pb-2.5 cursor-pointer transition-colors relative ${
                    activeTab === 'questions' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Previous Questions ({selectedCompany.previousQuestions.length})
                  {activeTab === 'questions' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
                <button
                  id="tab-senior-experiences"
                  onClick={() => setActiveTab('experiences')}
                  className={`pb-2.5 cursor-pointer transition-colors relative ${
                    activeTab === 'experiences' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Interview Experiences ({selectedCompany.experiences.length})
                  {activeTab === 'experiences' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
                <button
                  id="tab-prep-resources"
                  onClick={() => setActiveTab('resources')}
                  className={`pb-2.5 cursor-pointer transition-colors relative ${
                    activeTab === 'resources' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Resources & Links ({selectedCompany.resources.length})
                  {activeTab === 'resources' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
              </div>

              {/* Tab 1: Selection Process Stepper */}
              {activeTab === 'process' && (
                <div className="space-y-3 text-xs">
                  {selectedCompany.selectionRounds.map((round) => (
                    <div
                      key={round.roundNumber}
                      id={`round-step-${round.roundNumber}`}
                      className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 flex items-start gap-4"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs border border-indigo-500/30">
                        {round.roundNumber}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-semibold text-slate-100 text-sm">{round.title}</h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {round.duration}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 leading-relaxed">{round.description}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Format: {round.format}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Previous Questions */}
              {activeTab === 'questions' && (
                <div className="space-y-3 text-xs">
                  {selectedCompany.previousQuestions.map((q) => (
                    <div
                      key={q.id}
                      id={`company-prev-q-${q.id}`}
                      className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">
                          {q.round}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            q.frequency === 'Very High'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          Frequency: {q.frequency}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-200 text-sm leading-snug">{q.question}</p>
                      {q.sampleSolution && (
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs">
                          <span className="font-bold text-slate-400 block mb-0.5">Solution Approach:</span>
                          {q.sampleSolution}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Experiences */}
              {activeTab === 'experiences' && (
                <div className="space-y-3 text-xs">
                  {selectedCompany.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-200">
                            {exp.studentName.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-200">{exp.studentName}</span>
                          <span className="text-slate-400">({exp.role}, {exp.year})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {exp.offerStatus}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">"{exp.feedback}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Resources & Links */}
              {activeTab === 'resources' && (
                <div className="space-y-2.5 text-xs">
                  {selectedCompany.resources.map((res, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-semibold text-slate-200">{res.title}</p>
                          <span className="text-[10px] text-slate-400">{res.type}</span>
                        </div>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 flex items-center gap-1 text-[11px]"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Personal Notes for Company */}
              <div className="pt-4 border-t border-inherit">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    My Preparation Notes for {selectedCompany.name}
                  </label>
                  <button
                    id="save-company-notes-btn"
                    onClick={() => updateCompanyNotes(selectedCompany.id, noteDraft)}
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" /> Save Notes
                  </button>
                </div>
                <textarea
                  id="company-notes-textarea"
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Record topics you need to revise, questions from mock drives, or specific algorithm weaknesses..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 text-xs outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
