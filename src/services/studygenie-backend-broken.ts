/**
 * StudyGenie AI Backend Integration
 * Uses Next.js API routes as proxy to avoid CORS issues
 */

// Use local Next.js API routes that proxy to the backend
const USE_PROXY = true; // Set to true to use Next.js API proxy (avoids CORS)
const BACKEND_URL = process.env.NEXT_PUBLIC_STUDYGENIE_BACKEND_URL || 'https://studygenie-ai.onrender.com';

export interface SkillMapTopic {
  topic: string;
  subtopics: string[];
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimated_hours: number;
  prerequisites?: string[];
}

export interface SkillMapResponse {
  skill_map: SkillMapTopic[];
  total_topics: number;
}

export interface QuizOption {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  xp_reward?: number;
}

export interface QuizResponse {
  quiz: QuizQuestion[];
  total_questions: number;
  topics_covered: string[];
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  follow_up_questions: string[];
  key_points?: string[];
}

export interface InterviewQAResponse {
  interview_qa: InterviewQuestion[];
  total_questions: number;
  topics_covered: string[];
}

export interface UploadPDFResponse {
  status: 'success';
  skill_map: SkillMapResponse;
  quiz: QuizResponse;
  interview_qa: InterviewQAResponse;
  metadata: {
    filename: string;
    text_length: number;
    total_topics: number;
    quiz_questions: number;
    interview_questions: number;
  };
}

export interface CodingChallenge {
  challenge: {
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    starter_code: string;
    test_cases: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    hints: string[];
    time_complexity: string;
    space_complexity: string;
    xp_reward: number;
  };
}

export interface Flashcard {
  front: string;
  back: string;
  difficulty: string;
  topic: string;
}

export interface FlashcardsResponse {
  flashcards: Flashcard[];
  total_cards: number;
  topic: string;
}

class StudyGenieBackendService {
  private baseUrl: string;
  private useProxy: boolean;

  constructor() {
    this.baseUrl = BACKEND_URL;
    this.useProxy = USE_PROXY;
  }

  /**
   * Get the correct API URL (proxy or direct)
   */
  private getApiUrl(endpoint: string): string {
    if (this.useProxy) {
      // Use Next.js API routes (no CORS issues)
      return `/api${endpoint}`;
    }
    // Direct backend call (may have CORS issues in development)
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Check if backend is healthy
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      // Always check direct backend for health
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('Backend health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Backend health check error:', error);
      throw error;
    }
  }

  /**
   * Upload PDF syllabus and generate comprehensive study materials
   */
  async uploadPDF(
    file: File,
    quizQuestions: number = 15,
    interviewQuestions: number = 12
  ): Promise<UploadPDFResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quiz_questions', quizQuestions.toString());
      formData.append('interview_questions', interviewQuestions.toString());

      const url = this.getApiUrl('/upload-pdf');
      console.log('📤 Uploading PDF to:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' })
    interviewQuestions: number = 12
  ): Promise<UploadPDFResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quiz_questions', quizQuestions.toString());
      formData.append('interview_questions', interviewQuestions.toString());

      const response = await fetch(`${this.baseUrl}/api/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload PDF');
      }url = this.getApiUrl('/generate-quiz');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' })
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    numQuestions: number = 10
  ): Promise<QuizResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        consurl = this.getApiUrl('/generate-coding-challenge');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          language,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' })
  async generateCodingChallenge(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    language: string = 'python'
  ): Promise<CodingChallenge> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-coding-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          language,
        }),
      });url = this.getApiUrl('/generate-flashcards');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          num_cards: numCards,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' })

  /**
   * Generate flashcards for a topic
   */
  async generateFlashcards(
    topic: string,
    numCards: number = 10
  ): Promise<FlashcardsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          num_cards: numCards,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate flashcards');
      }

      return await response.json();
    } catch (error) {
      console.error('Flashcards generation error:', error);
      throw error;
    }
  }

  /**
   * Transform backend skill map to frontend format
   */
  transformSkillMapToUnits(skillMap: SkillMapResponse): any {
    const units: any[] = [];
    let unitId = 1;

    // Group topics by difficulty or create logical units
    const topicsByDifficulty: { [key: string]: SkillMapTopic[] } = {
      Easy: [],
      Medium: [],
      Hard: [],
    };

    skillMap.skill_map.forEach((topic) => {
      topicsByDifficulty[topic.difficulty].push(topic);
    });

    // Create units from grouped topics
    Object.entries(topicsByDifficulty).forEach(([difficulty, topics]) => {
      if (topics.length === 0) return;

      const unit = {
        id: `unit-${unitId}`,
        name: `${difficulty} Level Topics`,
        topics: topics.map((topic, idx) => ({
          id: `${unitId}-${idx + 1}`,
          name: topic.topic,
          difficulty: topic.difficulty,
          subtopics: topic.subtopics,
          description: topic.description,
          estimatedHours: topic.estimated_hours,
          prerequisites: topic.prerequisites || [],
          status: 'locked' as const,
        })),
      };

      units.push(unit);
      unitId++;
    });

    return {
      curriculum: 'AI-Generated Curriculum',
      units,
      totalTopics: skillMap.total_topics,
    };
  }

  /**
   * Transform backend quiz to Tambo format
   */
  transformQuizToTamboFormat(quiz: QuizResponse): any[] {
    return quiz.quiz.map((q, idx) => {
      const correctIndex = q.options.findIndex((opt) => opt.is_correct);
      
      return {
        id: `q-${idx + 1}`,
        question: q.question,
        type: 'mcq' as const,
        difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) as 'Easy' | 'Medium' | 'Hard',
        options: q.options.map((opt) => opt.text),
        correctAnswer: correctIndex,
        explanation: q.explanation,
        xpReward: q.xp_reward || (q.difficulty === 'easy' ? 10 : q.difficulty === 'medium' ? 15 : 25),
      };
    });
  }
}

// Export singleton instance
export const studyGenieBackend = new StudyGenieBackendService();
