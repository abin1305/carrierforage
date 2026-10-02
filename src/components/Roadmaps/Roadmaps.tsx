import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CareerRoadmap, RoadmapMilestone } from '../../types';
import { generateCustomRoadmap } from '../../services/aiService';
import {
  GitFork,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  RefreshCw,
  Clock,
  Layers,
  Award,
  BookOpen,
  Code2,
} from 'lucide-react';

export const Roadmaps: React.FC = () => {
  const { roadmaps, toggleRoadmapMilestone, isDarkMode } = useApp();

  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(roadmaps[0]?.id || '');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // AI Roadmap Generator Form
  const [aiTargetRole, setAiTargetRole] = useState('Full Stack Software Engineer');
  const [aiCurrentLevel, setAiCurrentLevel] = useState('Intermediate (React, Node.js, 100+ LeetCode)');
  const [aiWeeks, setAiWeeks] = useState(12);
  const [aiHoursPerWeek, setAiHoursPerWeek] = useState(20);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [customRoadmap, setCustomRoadmap] = useState<CareerRoadmap | null>(null);

  const allRoadmaps = customRoadmap ? [customRoadmap, ...roadmaps] : roadmaps;
  const activeRoadmap = allRoadmaps.find((r) => r.id === selectedRoadmapId) || allRoadmaps[0];

  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    try {
      const result = await generateCustomRoadmap({
        targetRole: aiTargetRole,
        currentSkillLevel: aiCurrentLevel,
        weeksAvailable: Number(aiWeeks),
        hoursPerWeek: Number(aiHoursPerWeek),
      });

      setCustomRoadmap(result);
      setSelectedRoadmapId(result.id);
      setShowAiModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const calculateProgress = (roadmap: CareerRoadmap) => {
    const total = roadmap.milestones.length;
    if (!total) return 0;
    const completed = roadmap.milestones.filter((m) => m.completed).length;
    return Math.round((completed / total) * 100);
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-indigo-400" />
            Career Roadmaps & Interactive Learning Paths
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured curriculum with milestone tracking for campus placements and technical interviews.
          </p>
        </div>

        <button
          id="generate-ai-roadmap-modal-btn"
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 cursor-pointer shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate AI Custom Roadmap</span>
        </button>
      </div>

      {/* Roadmap Selection Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allRoadmaps.map((r) => {
          const progress = calculateProgress(r);
          const isSelected = r.id === selectedRoadmapId;
          return (
            <button
              key={r.id}
              id={`roadmap-tab-${r.id}`}
              onClick={() => setSelectedRoadmapId(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer border flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {r.id.startsWith('ai-custom') && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{r.role}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 text-slate-300">
                {progress}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Detailed Card */}
      {activeRoadmap && (
        <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-inherit">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-100">{activeRoadmap.title}</h2>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeRoadmap.estimatedWeeks} Weeks Track
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-700/50 text-slate-300">
                  {activeRoadmap.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{activeRoadmap.description}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400">Track Progress</span>
              <div className="text-2xl font-extrabold text-emerald-400">
                {calculateProgress(activeRoadmap)}%
              </div>
              <span className="text-[10px] text-slate-500">
                {activeRoadmap.milestones.filter((m) => m.completed).length} of {activeRoadmap.milestones.length} milestones
              </span>
            </div>
          </div>

          {/* Stepper Milestones List */}
          <div className="space-y-4">
            {activeRoadmap.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                id={`milestone-${milestone.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  milestone.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      id={`toggle-milestone-btn-${milestone.id}`}
                      onClick={() => toggleRoadmapMilestone(activeRoadmap.id, milestone.id)}
                      className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-400"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">Stage {idx + 1}</span>
                        <h3
                          className={`font-bold text-sm ${
                            milestone.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {milestone.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Capstone Projects */}
                      {milestone.projects && milestone.projects.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-400 font-medium">Recommended Project:</span>
                          <span className="font-semibold text-cyan-300">{milestone.projects.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" /> {milestone.resourcesCount} resources
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Custom Roadmap Generator Modal */}
      {showAiModal && (
        <div
          id="ai-roadmap-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="font-bold text-sm text-slate-100">AI Placement Roadmap Generator</h2>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAi} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Target Engineering Role *</label>
                <input
                  type="text"
                  required
                  value={aiTargetRole}
                  onChange={(e) => setAiTargetRole(e.target.value)}
                  placeholder="e.g. Backend Engineer, Cloud SRE, Data Scientist"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Current Skill Set & Background</label>
                <input
                  type="text"
                  value={aiCurrentLevel}
                  onChange={(e) => setAiCurrentLevel(e.target.value)}
                  placeholder="e.g. Know Java basics, 50 LeetCode solved, built a simple MERN app"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Weeks to Preparation</label>
                  <input
                    type="number"
                    min={4}
                    max={52}
                    value={aiWeeks}
                    onChange={(e) => setAiWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Available Hours / Week</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={aiHoursPerWeek}
                    onChange={(e) => setAiHoursPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 flex items-center gap-2"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Syllabus...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generate Custom Track</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
