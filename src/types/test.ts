export interface Question {
  id: number;
  type: 'multiple-choice' | 'reading' | 'vocabulary';
  section: 'grammar' | 'vocabulary' | 'reading';
  question: string;
  options: string[];
  correct: number;
  difficulty: 'A1' | 'A2';
  explanation: string;
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  level: string;
  sectionScores: {
    grammar: number;
    vocabulary: number;
    reading: number;
  };
  recommendations: string[];
  completedAt: Date;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  state: string;
  country: string;
  followsInstagram: string;
  education: string;
  profession: string;
  company: string;
  jobFunction: string;
  hasStudiedEnglish: boolean;
  whereStudied?: string;
  studyYears?: number;
  englishImportance: string;
  conversationLevel: number;
  writingLevel: number;
  readingLevel: number;
  listeningLevel: number;
  grammarLevel: number;
  preferredStudyType: string;
  classesPerWeek: string;
  preferredSchedule: string;
}