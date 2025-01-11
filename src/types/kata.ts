export interface Kata {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  authorId: string;
  createdAt: Date;
  language: 'javascript' | 'typescript' | 'python' | 'java';
  testCases: TestCase[];
  solutions: Solution[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface Solution {
  userId: string;
  code: string;
  performance: number;
  passedTests: number;
  totalTests: number;
  submittedAt: Date;
} 