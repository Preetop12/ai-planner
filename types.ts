
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface StudyTask {
  id: string;
  day: number;
  topic: string;
  subtopics: string[];
  durationMinutes: number;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  subject: string;
  targetDate: string;
  dailyHours: number;
  tasks: StudyTask[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelUsed?: string;
  timestamp: string;
}

export interface PlanGenerationInput {
  subject: string;
  syllabus: string;
  examDate: string;
  dailyStudyHours: number;
  learningStyle: 'visual' | 'reading' | 'practical';
  fileData?: {
    base64: string;
    mimeType: string;
  };
}
