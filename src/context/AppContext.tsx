import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  Task,
  Resource,
  CompanyPrep,
  AptitudeQuestion,
  MockTestResult,
  InterviewQuestion,
  CodingProblem,
  CareerRoadmap,
  JobApplication,
  ResumeData,
  Badge,
  NotificationItem,
} from '../types';
import {
  initialProfile,
  initialTasks,
  initialResources,
  initialCompanies,
  initialAptitudeQuestions,
  initialInterviewQuestions,
  initialCodingProblems,
  initialRoadmaps,
  initialJobApplications,
  initialResume,
  initialBadges,
  initialNotifications,
} from '../data/initialData';
import confetti from 'canvas-confetti';

export type ActiveTab =
  | 'dashboard'
  | 'resources'
  | 'placement'
  | 'aptitude'
  | 'interview'
  | 'coding'
  | 'tasks'
  | 'roadmaps'
  | 'jobs'
  | 'resume'
  | 'profile';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Resources
  resources: Resource[];
  addResource: (res: Omit<Resource, 'id' | 'dateAdded'>) => void;
  updateResource: (id: string, updated: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  toggleResourceComplete: (id: string) => void;
  toggleResourceBookmark: (id: string) => void;

  // Companies
  companies: CompanyPrep[];
  updateCompanyStatus: (id: string, status: CompanyPrep['status']) => void;
  toggleCompanyBookmark: (id: string) => void;
  updateCompanyNotes: (id: string, notes: string) => void;

  // Aptitude
  aptitudeQuestions: AptitudeQuestion[];
  mockResults: MockTestResult[];
  recordMockTestResult: (result: Omit<MockTestResult, 'id' | 'date'>) => void;
  addAptitudeQuestion: (q: Omit<AptitudeQuestion, 'id'>) => void;

  // Interview
  interviewQuestions: InterviewQuestion[];
  saveInterviewQuestion: (id: string) => void;
  recordInterviewPractice: (id: string, notes?: string) => void;
  addInterviewQuestion: (q: Omit<InterviewQuestion, 'id' | 'practiceCount'>) => void;

  // Coding
  codingProblems: CodingProblem[];
  dailyCodingGoal: number;
  setDailyCodingGoal: (goal: number) => void;
  addCodingProblem: (p: Omit<CodingProblem, 'id' | 'solvedDate'>) => void;
  updateCodingProblemStatus: (id: string, status: CodingProblem['status']) => void;

  // Roadmaps
  roadmaps: CareerRoadmap[];
  toggleRoadmapMilestone: (roadmapId: string, milestoneId: string) => void;

  // Jobs
  jobs: JobApplication[];
  addJobApplication: (job: Omit<JobApplication, 'id' | 'appliedDate'>) => void;
  updateJobStatus: (id: string, status: JobApplication['status']) => void;
  updateJobApplication: (id: string, updated: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;

  // Resume
  resume: ResumeData;
  updateResume: (updated: Partial<ResumeData>) => void;

  // Badges & Notifications
  badges: Badge[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Analytics & Readiness
  readinessScore: number;
  readinessBreakdown: {
    tasksScore: number;
    codingScore: number;
    aptitudeScore: number;
    interviewScore: number;
    resumeScore: number;
  };
  triggerConfetti: () => void;
  resetAllToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`careerforge_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`careerforge_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadStorage('dark_mode', true));
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [profile, setProfile] = useState<UserProfile>(() => loadStorage('profile', initialProfile));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage('tasks', initialTasks));
  const [resources, setResources] = useState<Resource[]>(() => loadStorage('resources', initialResources));
  const [companies, setCompanies] = useState<CompanyPrep[]>(() => loadStorage('companies', initialCompanies));
  const [aptitudeQuestions, setAptitudeQuestions] = useState<AptitudeQuestion[]>(() => loadStorage('apt_questions', initialAptitudeQuestions));
  const [mockResults, setMockResults] = useState<MockTestResult[]>(() => loadStorage('mock_results', [
    {
      id: 'mock-1',
      testName: 'General Aptitude Assessment #1',
      date: '2026-09-02',
      totalQuestions: 15,
      score: 13,
      timeSpentSeconds: 720,
      topicBreakdown: {
        'Quantitative Aptitude': { total: 6, correct: 5 },
        'Logical Reasoning': { total: 5, correct: 5 },
        'Verbal Ability': { total: 4, correct: 3 },
      },
    },
    {
      id: 'mock-2',
      testName: 'TCS NQT Foundation Mock Test',
      date: '2026-09-07',
      totalQuestions: 20,
      score: 17,
      timeSpentSeconds: 1100,
      topicBreakdown: {
        'Quantitative Aptitude': { total: 8, correct: 7 },
        'Logical Reasoning': { total: 7, correct: 6 },
        'Verbal Ability': { total: 5, correct: 4 },
      },
    },
  ]));
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>(() => loadStorage('interview_questions', initialInterviewQuestions));
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(() => loadStorage('coding_problems', initialCodingProblems));
  const [dailyCodingGoal, setDailyCodingGoal] = useState<number>(() => loadStorage('coding_goal', 3));
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>(() => loadStorage('roadmaps', initialRoadmaps));
  const [jobs, setJobs] = useState<JobApplication[]>(() => loadStorage('jobs', initialJobApplications));
  const [resume, setResume] = useState<ResumeData>(() => loadStorage('resume', initialResume));
  const [badges, setBadges] = useState<Badge[]>(() => loadStorage('badges', initialBadges));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('notifications', initialNotifications));

  // Sync to localStorage
  useEffect(() => saveStorage('dark_mode', isDarkMode), [isDarkMode]);
  useEffect(() => saveStorage('profile', profile), [profile]);
  useEffect(() => saveStorage('tasks', tasks), [tasks]);
  useEffect(() => saveStorage('resources', resources), [resources]);
  useEffect(() => saveStorage('companies', companies), [companies]);
  useEffect(() => saveStorage('apt_questions', aptitudeQuestions), [aptitudeQuestions]);
  useEffect(() => saveStorage('mock_results', mockResults), [mockResults]);
  useEffect(() => saveStorage('interview_questions', interviewQuestions), [interviewQuestions]);
  useEffect(() => saveStorage('coding_problems', codingProblems), [codingProblems]);
  useEffect(() => saveStorage('coding_goal', dailyCodingGoal), [dailyCodingGoal]);
  useEffect(() => saveStorage('roadmaps', roadmaps), [roadmaps]);
  useEffect(() => saveStorage('jobs', jobs), [jobs]);
  useEffect(() => saveStorage('resume', resume), [resume]);
  useEffect(() => saveStorage('badges', badges), [badges]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981'],
      });
    } catch {
      // safe fallback
    }
  };

  // Readiness Score Computation
  const readinessBreakdown = useMemo(() => {
    // 1. Tasks: Completed / Total
    const totalT = tasks.length || 1;
    const completedT = tasks.filter((t) => t.status === 'completed').length;
    const tasksScore = Math.min(100, Math.round((completedT / totalT) * 100));

    // 2. Coding: Solved count & streak
    const solvedCount = codingProblems.filter((p) => p.status === 'Solved').length;
    const codingScore = Math.min(100, Math.round((solvedCount / 8) * 70 + Math.min(profile.currentStreak * 2.5, 30)));

    // 3. Aptitude: Average of mock tests or baseline
    const aptAccuracies = mockResults.map((m) => (m.score / m.totalQuestions) * 100);
    const aptitudeScore = aptAccuracies.length > 0
      ? Math.round(aptAccuracies.reduce((a, b) => a + b, 0) / aptAccuracies.length)
      : 75;

    // 4. Interview: Practice volume
    const totalPracticed = interviewQuestions.reduce((acc, q) => acc + q.practiceCount, 0);
    const interviewScore = Math.min(100, Math.round((totalPracticed / 15) * 100));

    // 5. Resume ATS score
    const resumeScore = resume.atsScore || 85;

    return {
      tasksScore,
      codingScore,
      aptitudeScore,
      interviewScore,
      resumeScore,
    };
  }, [tasks, codingProblems, profile.currentStreak, mockResults, interviewQuestions, resume.atsScore]);

  const readinessScore = useMemo(() => {
    const { tasksScore, codingScore, aptitudeScore, interviewScore, resumeScore } = readinessBreakdown;
    const composite =
      tasksScore * 0.2 +
      codingScore * 0.25 +
      aptitudeScore * 0.2 +
      interviewScore * 0.15 +
      resumeScore * 0.2;
    return Math.min(99, Math.max(20, Math.round(composite)));
  }, [readinessBreakdown]);

  // Profile actions
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Task actions
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}` };
    setTasks((prev) => [newTask, ...prev]);
    addNotification({
      title: 'New Task Created',
      message: `"${task.title}" added with ${task.priority} priority.`,
      type: 'info',
    });
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'completed' ? 'pending' : 'completed';
          if (newStatus === 'completed') {
            triggerConfetti();
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Resources actions
  const addResource = (res: Omit<Resource, 'id' | 'dateAdded'>) => {
    const newRes: Resource = {
      ...res,
      id: `res-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setResources((prev) => [newRes, ...prev]);
    addNotification({
      title: 'Resource Added',
      message: `"${res.title}" placed in ${res.subCategory}.`,
      type: 'info',
    });
  };

  const updateResource = (id: string, updated: Partial<Resource>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleResourceComplete = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const toggleResourceBookmark = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  // Companies actions
  const updateCompanyStatus = (id: string, status: CompanyPrep['status']) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const toggleCompanyBookmark = (id: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c)));
  };

  const updateCompanyNotes = (id: string, notes: string) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
  };

  // Aptitude actions
  const recordMockTestResult = (result: Omit<MockTestResult, 'id' | 'date'>) => {
    const newResult: MockTestResult = {
      ...result,
      id: `mock-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setMockResults((prev) => [newResult, ...prev]);
    triggerConfetti();
    addNotification({
      title: 'Mock Assessment Finished',
      message: `Scored ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}%).`,
      type: 'achievement',
    });
  };

  const addAptitudeQuestion = (q: Omit<AptitudeQuestion, 'id'>) => {
    const newQ: AptitudeQuestion = { ...q, id: `apt-${Date.now()}` };
    setAptitudeQuestions((prev) => [...prev, newQ]);
  };

  // Interview actions
  const saveInterviewQuestion = (id: string) => {
    setInterviewQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isSaved: !q.isSaved } : q))
    );
  };

  const recordInterviewPractice = (id: string, notes?: string) => {
    setInterviewQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            practiceCount: q.practiceCount + 1,
            lastPracticed: new Date().toISOString().split('T')[0],
            userNotes: notes || q.userNotes,
          };
        }
        return q;
      })
    );
  };

  const addInterviewQuestion = (q: Omit<InterviewQuestion, 'id' | 'practiceCount'>) => {
    const newQ: InterviewQuestion = {
      ...q,
      id: `int-${Date.now()}`,
      practiceCount: 0,
    };
    setInterviewQuestions((prev) => [...prev, newQ]);
  };

  // Coding actions
  const addCodingProblem = (p: Omit<CodingProblem, 'id' | 'solvedDate'>) => {
    const newP: CodingProblem = {
      ...p,
      id: `cp-${Date.now()}`,
      solvedDate: new Date().toISOString().split('T')[0],
    };
    setCodingProblems((prev) => [newP, ...prev]);
    triggerConfetti();
  };

  const updateCodingProblemStatus = (id: string, status: CodingProblem['status']) => {
    setCodingProblems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  // Roadmaps
  const toggleRoadmapMilestone = (roadmapId: string, milestoneId: string) => {
    setRoadmaps((prev) =>
      prev.map((rm) => {
        if (rm.id === roadmapId) {
          const updatedMilestones = rm.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          return { ...rm, milestones: updatedMilestones };
        }
        return rm;
      })
    );
  };

  // Jobs actions
  const addJobApplication = (job: Omit<JobApplication, 'id' | 'appliedDate'>) => {
    const newJob: JobApplication = {
      ...job,
      id: `job-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    addNotification({
      title: 'Application Logged',
      message: `Applied to ${job.companyName} for ${job.position}.`,
      type: 'info',
    });
  };

  const updateJobStatus = (id: string, status: JobApplication['status']) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          if (status === 'Selected') {
            triggerConfetti();
          }
          return { ...j, status };
        }
        return j;
      })
    );
  };

  const updateJobApplication = (id: string, updated: Partial<JobApplication>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updated } : j)));
  };

  const deleteJobApplication = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  // Resume actions
  const updateResume = (updated: Partial<ResumeData>) => {
    setResume((prev) => ({ ...prev, ...updated }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newN: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const resetAllToDefault = () => {
    setProfile(initialProfile);
    setTasks(initialTasks);
    setResources(initialResources);
    setCompanies(initialCompanies);
    setAptitudeQuestions(initialAptitudeQuestions);
    setInterviewQuestions(initialInterviewQuestions);
    setCodingProblems(initialCodingProblems);
    setRoadmaps(initialRoadmaps);
    setJobs(initialJobApplications);
    setResume(initialResume);
    setBadges(initialBadges);
    setNotifications(initialNotifications);
    triggerConfetti();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDarkMode,
        setIsDarkMode,
        searchTerm,
        setSearchTerm,
        profile,
        updateProfile,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        resources,
        addResource,
        updateResource,
        deleteResource,
        toggleResourceComplete,
        toggleResourceBookmark,
        companies,
        updateCompanyStatus,
        toggleCompanyBookmark,
        updateCompanyNotes,
        aptitudeQuestions,
        mockResults,
        recordMockTestResult,
        addAptitudeQuestion,
        interviewQuestions,
        saveInterviewQuestion,
        recordInterviewPractice,
        addInterviewQuestion,
        codingProblems,
        dailyCodingGoal,
        setDailyCodingGoal,
        addCodingProblem,
        updateCodingProblemStatus,
        roadmaps,
        toggleRoadmapMilestone,
        jobs,
        addJobApplication,
        updateJobStatus,
        updateJobApplication,
        deleteJobApplication,
        resume,
        updateResume,
        badges,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        readinessScore,
        readinessBreakdown,
        triggerConfetti,
        resetAllToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
