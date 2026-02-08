'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ProgressBar from '@/components/ui/ProgressBar';

interface CombatModeProps {
  topic: any;
  onComplete: (results: {
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    timeSpent: number;
    weakAreas: string[];
  }) => void;
  onNavigate: (view: string) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'mcq';
  options: string[];
  correctAnswer: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  xpReward: number;
}

export default function CombatMode({ topic, onComplete, onNavigate }: CombatModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const topicName = topic?.name || topic?.title || topic?.topic || 'General Knowledge';
        const difficulty = (topic?.difficulty || 'Medium').toLowerCase() as 'easy' | 'medium' | 'hard';
        
        const response = await studyGenieBackend.generateQuiz(topicName, difficulty, 10);
        
        if (response.quiz && Array.isArray(response.quiz)) {
          const formattedQuestions = response.quiz.slice(0, 7).map((q: any, idx: number) => ({
            id: `q-${idx}`,
            question: q.question || 'Sample question',
            type: 'mcq' as const,
            options: q.options?.map((opt: any) => opt.text || opt) || ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: q.options?.findIndex((opt: any) => opt.is_correct) ?? 0,
            difficulty: q.difficulty || difficulty,
            explanation: q.explanation || 'Explanation not available',
            xpReward: 50
          }));
          setQuestions(formattedQuestions);
        } else {
          throw new Error('Invalid quiz response format');
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions([
          {
            id: 'q-1',
            question: 'If Rani has 10 apples and gives 4 apples to her friend, how many apples are left?',
            type: 'mcq',
            options: ['5 apples', '6 apples', '7 apples', '8 apples'],
            correctAnswer: 1,
            difficulty: 'Easy',
            explanation: '10 - 4 = 6 apples',
            xpReward: 50
          },
          {
            id: 'q-2',
            question: 'What is the capital of France?',
            type: 'mcq',
            options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
            correctAnswer: 2,
            difficulty: 'Easy',
            explanation: 'Paris is the capital of France.',
            xpReward: 50
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadQuestions();
  }, [topic]);

  // Timer
  useEffect(() => {
    if (!isLoading && questions.length > 0 && currentQuestion < questions.length) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading, questions.length, currentQuestion]);

  const handleAnswerSelect = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);

    const question = questions[currentQuestion];
    const isCorrect = index === question.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + question.xpReward);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWeakAreas((prev) => [...prev, question.question]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      onComplete({
        score,
        questionsAnswered: questions.length,
        correctAnswers,
        timeSpent: timeElapsed,
        weakAreas: Array.from(new Set(weakAreas)),
      });
    }
  };

  if (isLoading) {
    return (
      <AppShell
        navProps={{
          showBack: true,
          onBack: () => onNavigate('skillTree'),
        }}
      >
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#3FDFD5] border-t-transparent animate-spin" />
            <p className="text-base font-medium" style={{ color: '#61210F' }}>
              Loading questions...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (questions.length === 0) {
    return (
      <AppShell
        navProps={{
          showBack: true,
          onBack: () => onNavigate('skillTree'),
        }}
      >
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="text-center">
            <p className="text-base font-medium mb-4" style={{ color: '#61210F' }}>
              No questions available
            </p>
            <SecondaryButton onClick={() => onNavigate('skillTree')}>
              Back to Skill Tree
            </SecondaryButton>
          </div>
        </div>
      </AppShell>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('skillTree'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#61210F' }}>
                Question {currentQuestion + 1} of {questions.length}
              </h1>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {topic?.name || topic?.title || 'Quiz'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} style={{ color: '#6B7280' }} />
              <span className="text-sm font-medium" style={{ color: '#61210F' }}>
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar progress={progress} />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 mb-6">
            <div className="mb-6">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: question.difficulty === 'Easy' ? '#D1FAE5' : question.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                  color: question.difficulty === 'Easy' ? '#065F46' : question.difficulty === 'Medium' ? '#92400E' : '#991B1B',
                }}
              >
                {question.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>
              {question.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = answered && isSelected;

                let buttonStyle = {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                };

                if (answered) {
                  if (isCorrect) {
                    buttonStyle = {
                      backgroundColor: '#D1FAE5',
                      borderColor: '#10B981',
                      color: '#065F46',
                    };
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = {
                      backgroundColor: '#FEE2E2',
                      borderColor: '#EF4444',
                      color: '#991B1B',
                    };
                  }
                } else if (isSelected) {
                  buttonStyle = {
                    backgroundColor: '#FEF3C7',
                    borderColor: '#F59E0B',
                    color: '#92400E',
                  };
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all font-medium"
                    style={buttonStyle}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                        style={{
                          backgroundColor: buttonStyle.borderColor + '40',
                          color: buttonStyle.color,
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 size={20} style={{ color: '#10B981' }} className="ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
                <p className="text-sm font-medium mb-2" style={{ color: '#61210F' }}>
                  Explanation:
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 mt-8">
            <SecondaryButton
              onClick={() => onNavigate('skillTree')}
              className="flex-1"
            >
              <ArrowLeft size={18} className="mr-2" />
              Exit Quiz
            </SecondaryButton>
            {answered && (
              <PrimaryButton
                onClick={handleNext}
                className="flex-1"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question <ArrowRight size={18} className="ml-2" />
                  </>
                ) : (
                  <>
                    Complete Quiz <CheckCircle2 size={18} className="ml-2" />
                  </>
                )}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
