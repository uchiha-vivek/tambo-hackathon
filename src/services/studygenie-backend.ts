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

  private getApiUrl(endpoint: string): string {
    if (this.useProxy) {
      return `/api${endpoint}`;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
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
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to upload PDF');
      }

      return await response.json();
    } catch (error) {
      console.error('PDF upload error:', error);
      throw error;
    }
  }

  async generateQuiz(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    numQuestions: number = 10
  ): Promise<QuizResponse> {
    try {
      const url = this.getApiUrl('/generate-quiz');
      
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
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to generate quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw error;
    }
  }

  async generateCodingChallenge(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    language: string = 'python'
  ): Promise<CodingChallenge> {
    try {
      const url = this.getApiUrl('/generate-coding-challenge');
      
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
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to generate coding challenge');
      }

      return await response.json();
    } catch (error) {
      console.error('Coding challenge generation error:', error);
      throw error;
    }
  }

  async generateFlashcards(
    topic: string,
    numCards: number = 10
  ): Promise<FlashcardsResponse> {
    try {
      const url = this.getApiUrl('/generate-flashcards');
      
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
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to generate flashcards');
      }

      return await response.json();
    } catch (error) {
      console.error('Flashcards generation error:', error);
      throw error;
    }
  }

  transformSkillMapToUnits(skillMap: SkillMapResponse): any {
    const units: any[] = [];
    let unitId = 1;

    // Validate skillMap structure
    if (!skillMap || !skillMap.skill_map || !Array.isArray(skillMap.skill_map)) {
      console.error('Invalid skillMap structure:', skillMap);
      throw new Error('Invalid skill map data received from backend');
    }

    // Group topics into units - since backend doesn't always provide difficulty,
    // we'll group them by topic order or assign default difficulties
    const topicsPerUnit = 5; // Group every 5 topics into a unit
    const allTopics = skillMap.skill_map;

    for (let i = 0; i < allTopics.length; i += topicsPerUnit) {
      const topicBatch = allTopics.slice(i, i + topicsPerUnit);
      
      const unit = {
        id: `unit-${unitId}`,
        name: `Module ${unitId}: ${topicBatch[0]?.topic || 'Topics'}`,
        topics: topicBatch.map((topic, idx) => ({
          id: `${unitId}-${idx + 1}`,
          name: topic.topic,
          difficulty: topic.difficulty || this.assignDefaultDifficulty(i + idx, allTopics.length),
          subtopics: topic.subtopics,
          description: topic.description,
          estimatedHours: topic.estimated_hours || 2,
          prerequisites: topic.prerequisites || [],
          status: 'locked' as const,
        })),
      };

      units.push(unit);
      unitId++;
    }

    return {
      curriculum: 'AI-Generated Curriculum',
      units,
      totalTopics: skillMap.total_topics,
    };
  }

  private assignDefaultDifficulty(index: number, total: number): 'Easy' | 'Medium' | 'Hard' {
    // Assign difficulty based on position: early topics = easy, later = harder
    const position = index / total;
    if (position < 0.33) return 'Easy';
    if (position < 0.67) return 'Medium';
    return 'Hard';
  }

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

export const studyGenieBackend = new StudyGenieBackendService();
