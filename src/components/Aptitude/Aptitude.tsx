import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AptitudeQuestion, AptitudeTopic } from '../../types';
import {
  BrainCircuit,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart3,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

const TOPICS: AptitudeTopic[] = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Interpretation',
];

export const Aptitude: React.FC = () => {
  const { aptitudeQuestions, mockResults, recordMockTestResult, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'practice' | 'mock' | 'history'>('practice');
  const [selectedTopic, setSelectedTopic] = useState<AptitudeTopic | 'All'>('All');

  // Practice mode state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Mock test active state
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testUserAnswers, setTestUserAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [testFinished, setTestFinished] = useState(false);
  const [lastFinishedScore, setLastFinishedScore] = useState<{ score: number; total: number } | null>(null);

  // Timer effect for mock test
  useEffect(() => {
    let interval: any;
    if (isTestActive && !testFinished && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinishMock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, testFinished, timeRemaining]);

  const filteredQuestions = aptitudeQuestions.filter(
    (q) => selectedTopic === 'All' || q.topic === selectedTopic
  );

  const handleStartMock = () => {
    setIsTestActive(true);
    setTestFinished(false);
    setCurrentTestIndex(0);
    setTestUserAnswers({});
    setTimeRemaining(600);
    setLastFinishedScore(null);
  };

  const handleFinishMock = () => {
    setIsTestActive(false);
    setTestFinished(true);

    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number }> = {};

    aptitudeQuestions.forEach((q, idx) => {
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { total: 0, correct: 0 };
      }
      topicBreakdown[q.topic].total += 1;

      if (testUserAnswers[idx] === q.correctIndex) {
        score += 1;
        topicBreakdown[q.topic].correct += 1;
      }
    });

    setLastFinishedScore({ score, total: aptitudeQuestions.length });

    recordMockTestResult({
      testName: 'General Aptitude Full Simulation',
      totalQuestions: aptitudeQuestions.length,
      score,
      timeSpentSeconds: 600 - timeRemaining,
      topicBreakdown,
    });
  };

  // Weak topic calculation across all mock results
  const topicStats = TOPICS.map((topic) => {
    let totalAsked = 0;
    let totalCorrect = 0;

    mockResults.forEach((res) => {
      if (res.topicBreakdown && res.topicBreakdown[topic]) {
        totalAsked += res.topicBreakdown[topic].total;
        totalCorrect += res.topicBreakdown[topic].correct;
      }
    });

    const accuracy = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 75;
    return {
      topic,
      accuracy,
      totalAsked,
      isWeak: accuracy < 65,
    };
  });

  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-xs';

  return (
    <div className="space-y-6">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Aptitude & Reasoning Mastery
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantitative, logical, verbal, and data interpretation practice with weak-area diagnostics.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <button
            id="apt-tab-practice"
            onClick={() => {
              setIsTestActive(false);
              setActiveTab('practice');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              activeTab === 'practice' && !isTestActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Topic Practice
          </button>
          <button
            id="apt-tab-mock"
            onClick={() => {
              setActiveTab('mock');
              if (!isTestActive && !testFinished) handleStartMock();
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              activeTab === 'mock' || isTestActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Timed Mock Test
          </button>
          <button
            id="apt-tab-history"
            onClick={() => {
              setIsTestActive(false);
              setActiveTab('history');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance History
          </button>
        </div>
      </div>

      {/* Weak Areas Diagnostic Alert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topicStats.map((item) => (
          <div
            key={item.topic}
            className={`p-3.5 rounded-xl border ${cardBg} ${
              item.isWeak ? 'border-amber-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300 truncate">{item.topic}</span>
              {item.isWeak ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Focus
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  Strong
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-extrabold text-slate-100">{item.accuracy}%</span>
              <span className="text-[11px] text-slate-400">Accuracy</span>
            </div>
            <div className="mt-2 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.isWeak ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${item.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mode 1: Practice Mode */}
      {activeTab === 'practice' && !isTestActive && (
        <div className="space-y-4">
          {/* Topic Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', ...TOPICS].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const selectedOpt = practiceAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;
              const isExpShown = showExplanation[q.id];

              return (
                <div
                  key={q.id}
                  id={`practice-question-item-${q.id}`}
                  className={`p-5 rounded-xl border space-y-4 ${cardBg}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                        {q.topic}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Topic: {q.subTopic}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-100 leading-relaxed">
                    Q{idx + 1}. {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isThisSelected = selectedOpt === oIdx;
                      let btnStyle = isDarkMode
                        ? 'bg-slate-900/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isAnswered) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold';
                        } else if (isThisSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-400 font-bold';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`opt-btn-${q.id}-${oIdx}`}
                          disabled={isAnswered}
                          onClick={() => setPracticeAnswers({ ...practiceAnswers, [q.id]: oIdx })}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && oIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && isThisSelected && oIdx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        setShowExplanation({ ...showExplanation, [q.id]: !isExpShown })
                      }
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isExpShown ? 'Hide Explanation' : 'View Detailed Solution'}</span>
                    </button>

                    {isAnswered && (
                      <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCorrect ? 'Correct Answer!' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {isExpShown && (
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-slate-400 block mb-1">Step-by-step Solution:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Timed Mock Test */}
      {(activeTab === 'mock' || isTestActive) && (
        <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
          {!isTestActive && !testFinished && (
            <div className="text-center py-8 max-w-md mx-auto space-y-4">
              <Award className="w-12 h-12 text-indigo-400 mx-auto" />
              <h2 className="text-lg font-bold text-slate-100">Ready for a Full Placement Mock Test?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test consists of questions across Quantitative, Reasoning, Verbal, and Data Interpretation. Strict 10-minute timer with instant scoring report.
              </p>
              <button
                id="start-mock-assessment-btn"
                onClick={handleStartMock}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Start 10-Min Assessment
              </button>
            </div>
          )}

          {isTestActive && !testFinished && (
            <div>
              {/* Test Header */}
              <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Question {currentTestIndex + 1} of {aptitudeQuestions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                    {aptitudeQuestions[currentTestIndex]?.topic}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                      timeRemaining < 120
                        ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>
                      {Math.floor(timeRemaining / 60)}:
                      {(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button
                    id="finish-mock-test-btn"
                    onClick={handleFinishMock}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
                  >
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Active Question */}
              {aptitudeQuestions[currentTestIndex] && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-base text-slate-100">
                    {aptitudeQuestions[currentTestIndex].question}
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {aptitudeQuestions[currentTestIndex].options.map((opt, oIdx) => {
                      const isSelected = testUserAnswers[currentTestIndex] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setTestUserAnswers({ ...testUserAnswers, [currentTestIndex]: oIdx })}
                          className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                              : 'bg-slate-900/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full border border-inherit flex items-center justify-center font-bold text-xs shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Footer */}
                  <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs">
                    <button
                      disabled={currentTestIndex === 0}
                      onClick={() => setCurrentTestIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>
                    {currentTestIndex < aptitudeQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentTestIndex((prev) => prev + 1)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-semibold cursor-pointer"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishMock}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-semibold cursor-pointer"
                      >
                        Finish & Review
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Finished Summary Report */}
          {testFinished && lastFinishedScore && (
            <div className="space-y-6">
              <div className="text-center space-y-2 pb-4 border-b border-inherit">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h2 className="text-lg font-bold text-slate-100">Assessment Complete!</h2>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {lastFinishedScore.score} / {lastFinishedScore.total}
                </div>
                <p className="text-xs text-slate-400">
                  Accuracy: {Math.round((lastFinishedScore.score / lastFinishedScore.total) * 100)}% • Speed: {Math.round((600 - timeRemaining) / 60)} mins
                </p>
              </div>

              {/* Question Review */}
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-200">Question-by-Question Review:</h4>
                {aptitudeQuestions.map((q, idx) => {
                  const userChoice = testUserAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-rose-950/20 border-rose-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-300">Q{idx + 1}. {q.topic}</span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                        </span>
                      </div>
                      <p className="text-slate-200 mb-2">{q.question}</p>
                      <div className="p-2 rounded bg-slate-900/60 text-slate-300">
                        <span className="text-slate-400 block font-semibold">Solution:</span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleStartMock}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Mock Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Performance History */}
      {activeTab === 'history' && (
        <div className={`p-5 rounded-xl border ${cardBg}`}>
          <h2 className="font-semibold text-sm text-slate-100 mb-3">Past Assessment Record</h2>
          <div className="space-y-3 text-xs">
            {mockResults.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg border border-slate-700/50 bg-slate-900/30 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-200">{m.testName}</h3>
                  <span className="text-[11px] text-slate-400">
                    Taken on {m.date} • Duration: {Math.round(m.timeSpentSeconds / 60)} mins
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-400">
                    {m.score} / {m.totalQuestions}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({Math.round((m.score / m.totalQuestions) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
