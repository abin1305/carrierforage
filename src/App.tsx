import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Resources } from './components/Resources/Resources';
import { PlacementPrep } from './components/PlacementPrep/PlacementPrep';
import { Aptitude } from './components/Aptitude/Aptitude';
import { InterviewPrep } from './components/InterviewPrep/InterviewPrep';
import { CodingPractice } from './components/CodingPractice/CodingPractice';
import { TaskManager } from './components/TaskManager/TaskManager';
import { Roadmaps } from './components/Roadmaps/Roadmaps';
import { Applications } from './components/Applications/Applications';
import { ResumeBuilder } from './components/ResumeBuilder/ResumeBuilder';
import { ProfileAnalytics } from './components/ProfileAnalytics/ProfileAnalytics';
import { PlusCircle, X } from 'lucide-react';
import { TaskPriority, TaskCategory } from './types';

const AppContent: React.FC = () => {
  const { activeTab, isDarkMode, addTask } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);

  // Quick Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Coding');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      status: 'pending',
      deadline: taskDueDate,
      description: 'Quick task created from top navbar',
      estimatedMinutes: 30,
    });
    setTaskTitle('');
    setIsQuickTaskOpen(false);
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'resources':
        return <Resources />;
      case 'placement':
        return <PlacementPrep />;
      case 'aptitude':
        return <Aptitude />;
      case 'interview':
        return <InterviewPrep />;
      case 'coding':
        return <CodingPractice />;
      case 'tasks':
        return <TaskManager />;
      case 'roadmaps':
        return <Roadmaps />;
      case 'jobs':
      case 'applications':
        return <Applications />;
      case 'resume':
        return <ResumeBuilder />;
      case 'profile':
        return <ProfileAnalytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/70 text-slate-800'
      }`}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            onOpenQuickTask={() => setIsQuickTaskOpen(true)}
          />

          {/* Main Module Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {renderActiveModule()}
            </div>
          </main>
        </div>
      </div>

      {/* Quick Task Modal */}
      {isQuickTaskOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Quick Add Career Task</h3>
              </div>
              <button
                onClick={() => setIsQuickTaskOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solve 2 LeetCode Dynamic Programming problems"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                    className={`w-full px-3 py-2 rounded-lg border outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Coding">Coding</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Resume">Resume</option>
                    <option value="Interview">Interview</option>
                    <option value="Application">Application</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className={`w-full px-3 py-2 rounded-lg border outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Target Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickTaskOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

