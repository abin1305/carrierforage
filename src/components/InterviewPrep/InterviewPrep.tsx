import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InterviewQuestion } from '../../types';
import { evaluateInterviewAnswer, InterviewEvaluation } from '../../services/aiService';
import {
  MessageSquareCode,
  Bookmark,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Clock,
  User,
  Cpu,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const InterviewPrep: React.FC = () => {
  const {
    interviewQuestions,
    saveInterviewQuestion,
    recordInterviewPractice,
    addInterviewQuestion,
    isDarkMode,
    searchTerm,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Technical' | 'HR'>('All');
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>('All');
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(null);

  // AI Mock Interview state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<InterviewEvaluation | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const technicalTopics = ['DBMS', 'OOP', 'Operating System', 'Networks', 'Cloud Computing', 'AI/ML'];
  const hrTopics = ['Tell Me About Yourself', 'Strengths & Weaknesses', 'Career Goals'];

  const filteredQuestions = interviewQuestions.filter((q) => {
    const matchesCategory = categoryFilter === 'All' || q.category === categoryFilter;
    const matchesTopic = selectedSubTopic === 'All' || q.subTopic === selectedSubTopic;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      q.question.toLowerCase().includes(term) ||
      q.subTopic.toLowerCase().includes(term) ||
      q.sampleAnswer.toLowerCase().includes(term);

    return matchesCategory && matchesTopic && matchesSearch;
  });

  const handleStartMockAI = (q: InterviewQuestion) => {
    setActiveQuestion(q);
    setUserAnswer('');
    setAiResult(null);
  };

  const handleEvaluateAI = async () => {
    if (!activeQuestion || !userAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const evaluation = await evaluateInterviewAnswer({
        question: activeQuestion.question,
        category: activeQuestion.category,
        answer: userAnswer,
      });

      setAiResult(evaluation);
      recordInterviewPractice(activeQuestion.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-indigo-400" />
            Interview Preparation & AI Mock Evaluator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Master Core CS technical rounds and HR STAR frameworks with real-time AI scoring and feedback.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          {['All', 'Technical', 'HR'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat as any);
                setSelectedSubTopic('All');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                categoryFilter === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat} Questions
            </button>
          ))}
        </div>
      </div>

      {/* Subtopic Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSubTopic('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border ${
            selectedSubTopic === 'All'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          All Topics
        </button>
        {(categoryFilter === 'HR' ? hrTopics : technicalTopics).map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedSubTopic(topic)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border ${
              selectedSubTopic === topic
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main Grid: Questions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => {
          const isDetailsOpen = !!expandedDetails[q.id];
          return (
            <div
              key={q.id}
              id={`interview-q-card-${q.id}`}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${cardBg}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                      {q.subTopic}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Practiced {q.practiceCount}x
                    </span>
                  </div>

                  <button
                    onClick={() => saveInterviewQuestion(q.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                    title={q.isSaved ? 'Saved' : 'Save'}
                  >
                    <Bookmark className={`w-4 h-4 ${q.isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="font-semibold text-sm text-slate-100 leading-snug">{q.question}</h3>

                {/* Key Bullet Points Checklist */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">Crucial Points to Cover:</span>
                  {q.keyPoints.slice(0, 2).map((pt, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {isDetailsOpen && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="font-bold text-indigo-400 block mb-0.5">Sample Ideal Answer:</span>
                      <p className="leading-relaxed">{q.sampleAnswer}</p>
                    </div>
                    {q.userNotes && (
                      <div className="pt-2 border-t border-slate-800">
                        <span className="font-bold text-amber-400 block mb-0.5">Personal Notes:</span>
                        <p>{q.userNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedDetails({ ...expandedDetails, [q.id]: !isDetailsOpen })}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {isDetailsOpen ? (
                    <>
                      <span>Hide Solution</span> <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Model Answer</span> <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  id={`ai-mock-eval-btn-${q.id}`}
                  onClick={() => handleStartMockAI(q)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Mock Answer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Mock Interview Modal */}
      {activeQuestion && (
        <div
          id="ai-mock-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-100">AI Mock Interview Simulator</h2>
                  <span className="text-[10px] text-slate-400">{activeQuestion.category} • {activeQuestion.subTopic}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveQuestion(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question Display */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Interviewer asks:</span>
              <p className="text-sm font-semibold text-slate-100">{activeQuestion.question}</p>
            </div>

            {/* Answer Input */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Your Spoken / Typed Response:
              </label>
              <textarea
                id="interview-user-answer-textarea"
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer using the STAR framework: Situation, Task, Action, Result. Quantify metrics and mention technical decisions..."
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-100 outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Tip: Mention concrete trade-offs, time complexity, and real engineering hurdles.
              </span>
              <button
                id="submit-ai-evaluation-btn"
                disabled={isEvaluating || !userAnswer.trim()}
                onClick={handleEvaluateAI}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for AI Evaluation</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Evaluation Report */}
            {aiResult && (
              <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3.5 mt-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm text-slate-100">AI Evaluation Report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400">
                      Verdict: {aiResult.overallVerdict}
                    </span>
                    <span className="text-base font-extrabold text-emerald-400">
                      {aiResult.score} / 10
                    </span>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {aiResult.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-1.5">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Points to Improve
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {aiResult.improvements.map((im, idx) => (
                        <li key={idx}>{im}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* STAR Framework rating */}
                {aiResult.starFrameworkRating && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-400 block mb-0.5">STAR Framework Assessment:</span>
                    <p className="text-slate-300">{aiResult.starFrameworkRating}</p>
                  </div>
                )}

                {/* Sample Ideal Answer */}
                {aiResult.sampleIdealAnswer && (
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">Recommended Benchmark Answer:</span>
                    <p className="text-slate-300 leading-relaxed italic">{aiResult.sampleIdealAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
