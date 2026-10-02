export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'learning' | 'aptitude' | 'coding' | 'placement' | 'interview';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
  estimatedMinutes: number;
  isRecurring?: boolean;
}

export type ResourceCategory =
  | 'web_dev'
  | 'data_science'
  | 'power_bi'
  | 'cloud_computing'
  | 'ai_ml'
  | 'cyber_security';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  subCategory: string; // e.g. React, Node.js, Python, AWS
  type: 'video' | 'pdf' | 'article' | 'course' | 'github';
  url: string;
  fileSimulatedName?: string;
  duration?: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  notes: string;
  dateAdded: string;
}

export interface CompanyPrep {
  id: string;
  name: string;
  logo: string;
  tier: 'Tier 1' | 'Tier 2' | 'Product' | 'Service';
  ctcRange: string;
  eligibility: {
    cgpa: number;
    backlogsAllowed: number;
    eligibleBranches: string[];
  };
  selectionRounds: {
    roundNumber: number;
    title: string;
    description: string;
    duration: string;
    format: string;
  }[];
  previousQuestions: {
    id: string;
    round: string;
    question: string;
    sampleSolution?: string;
    frequency: 'Very High' | 'High' | 'Medium';
  }[];
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  experiences: {
    studentName: string;
    role: string;
    year: string;
    feedback: string;
    offerStatus: 'Selected' | 'Final Round';
  }[];
  status: 'not_started' | 'in_progress' | 'ready' | 'applied';
  notes: string;
  isBookmarked: boolean;
}

export type AptitudeTopic =
  | 'Quantitative Aptitude'
  | 'Logical Reasoning'
  | 'Verbal Ability'
  | 'Data Interpretation';

export interface AptitudeQuestion {
  id: string;
  topic: AptitudeTopic;
  subTopic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MockTestResult {
  id: string;
  testName: string;
  date: string;
  totalQuestions: number;
  score: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<string, { total: number; correct: number }>;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR';
  subTopic: string; // DBMS, OOP, Operating System, Networks, Cloud Computing, AI/ML, Tell Me About Yourself, etc.
  question: string;
  sampleAnswer: string;
  keyPoints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isSaved: boolean;
  practiceCount: number;
  lastPracticed?: string;
  userNotes?: string;
}

export type CodingPlatform = 'LeetCode' | 'HackerRank' | 'CodeChef' | 'GeeksforGeeks';

export interface CodingProblem {
  id: string;
  title: string;
  platform: CodingPlatform;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'Solved' | 'Revision Needed' | 'Attempted';
  solvedDate: string;
  solutionUrl?: string;
  notes?: string;
}

export interface CodingContest {
  id: string;
  name: string;
  platform: CodingPlatform;
  date: string;
  time: string;
  duration: string;
  url: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  skills: string[];
  resourcesCount: number;
  projects: string[];
}

export interface CareerRoadmap {
  id: string;
  title: string;
  description: string;
  role: string;
  estimatedWeeks: number;
  category: string;
  milestones: RoadmapMilestone[];
}

export type JobStatus =
  | 'Applied'
  | 'Assessment'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  type: 'Internship' | 'Full-Time';
  ctcOrStipend: string;
  location: string;
  appliedDate: string;
  status: JobStatus;
  nextRoundDate?: string;
  notes: string;
  jobUrl?: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    portfolio: string;
    location: string;
    summary: string;
  };
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    cgpa: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    id: string;
    title: string;
    techStack: string[];
    liveUrl: string;
    repoUrl: string;
    bullets: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialUrl: string;
  }[];
  atsScore?: number;
  atsFeedback?: {
    summary?: string;
    matchedSkills?: string[];
    missingKeywords?: string[];
    actionVerbReview?: string;
    topRecommendations?: string[];
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  earned: boolean;
  earnedDate?: string;
  category: 'streak' | 'coding' | 'aptitude' | 'interview' | 'placement';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  branch: string;
  graduationYear: string;
  cgpa: string;
  targetRole: string;
  targetCompany: string;
  targetCTC: string;
  currentStreak: number;
  longestStreak: number;
  studyHoursThisWeek: number;
}
