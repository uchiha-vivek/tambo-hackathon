'use client';

import { useState, useEffect } from 'react';
import { Heart, Zap, Volume2, VolumeX } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';

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
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track session metrics
  const [startTime] = useState(Date.now());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  // Load questions from StudyGenie AI Backend on component mount
  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const topicName = topic?.name || 'General Knowledge';
        const topicDifficulty = (topic?.difficulty || 'Medium').toLowerCase() as 'easy' | 'medium' | 'hard';
        
        // Generate quiz using real backend
        const quizResponse = await studyGenieBackend.generateQuiz(topicName, topicDifficulty, 10);
        
        // Transform to our format
        const transformedQuestions = studyGenieBackend.transformQuizToTamboFormat(quizResponse);
        setQuestions(transformedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        // Fallback to demo questions if backend fails
        setQuestions(getDemoQuestions());
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [topic]);

  const getDemoQuestions = (): Question[] => {
    return [
      {
        id: 'demo-1',
        question: 'What is the time complexity of binary search?',
        type: 'mcq',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correctAnswer: 1,
        difficulty: 'Medium',
        explanation: 'Binary search divides the search space in half each iteration',
        xpReward: 15
      }
    ];
  };

  const getEnemyType = () => {
    if (!questions[currentQuestion]) return '🐢 Goblin';
    const q = questions[currentQuestion];
    if (q.difficulty === 'Easy') return '🐢 Goblin';
    if (q.difficulty === 'Medium') return '🗡️ Knight';
    return '🐉 Dragon';
  };

  const handleAnswer = (index: number) => {
    if (answered || !questions[currentQuestion]) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = index === currentQ.correctAnswer;

    // Calculate damage based on total questions (10 questions = 10 damage each)
    const damagePerQuestion = Math.ceil(100 / questions.length);

    if (isCorrect) {
      setEnemyHP(prev => Math.max(0, prev - damagePerQuestion));
      setScore(prev => prev + currentQ.xpReward);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setPlayerHP(prev => Math.max(0, prev - damagePerQuestion));
      // Track weak areas (topics where user got wrong answers)
      const questionTopic = topic?.name || 'General';
      setWeakAreas(prev => prev.includes(questionTopic) ? prev : [...prev, questionTopic]);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setEnemyHP(100);
    } else {
      // Calculate session metrics
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Pass complete results to parent
      onComplete({
        score,
        questionsAnswered: questions.length,
        correctAnswers,
        timeSpent,
        weakAreas
      });
    }
  };

  const questionsRemaining = questions.length - currentQuestion - 1;

  if (isLoading || questions.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Preparing Battle...</h2>
          <p className="text-purple-300">AI is generating quiz questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-900 to-slate-900 overflow-hidden">
      {/* Health Bars */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-purple-500/30 px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 items-center">
          {/* Player Health */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-400" size={20} />
              <span className="text-white font-semibold">Your Health</span>
            </div>
            <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden border border-red-500/40">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${playerHP}%` }}
              />
            </div>
            <p className="text-sm text-red-300 mt-1">{playerHP} HP</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-300">VS</p>
          </div>

          {/* Enemy Health */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold">{getEnemyType()}</span>
            </div>
            <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden border border-orange-500/40">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300"
                style={{ width: `${enemyHP}%` }}
              />
            </div>
            <p className="text-sm text-orange-300 mt-1">{enemyHP} HP</p>
          </div>
        </div>
      </div>

      {/* Combat Arena */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Question Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-purple-500/40 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-1">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-purple-600/30 rounded-full text-sm text-purple-200 border border-purple-500/40">
                    {questions[currentQuestion].difficulty}
                  </span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 hover:bg-slate-700 rounded transition-all"
                  >
                    {soundEnabled ? <Volume2 className="text-purple-300" size={18} /> : <VolumeX className="text-slate-400" size={18} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-purple-300 text-sm">SCORE</p>
                <p className="text-3xl font-bold text-purple-400">{score}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8">
              {questions[currentQuestion].question}
            </h2>

            {/* Multiple Choice Options */}
            {questions[currentQuestion].type === 'mcq' && (
              <div className="space-y-3">
                {questions[currentQuestion].options!.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === questions[currentQuestion].correctAnswer;
                  let buttonClass = 'bg-slate-700/50 border-slate-600/50 hover:border-purple-500/60';

                  if (answered) {
                    if (isCorrect) {
                      buttonClass = 'bg-green-600/30 border-green-500/60 text-green-100';
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'bg-red-600/30 border-red-500/60 text-red-100';
                    } else {
                      buttonClass = 'bg-slate-700/30 border-slate-600/40 opacity-50';
                    }
                  } else if (isSelected) {
                    buttonClass = 'bg-purple-600/40 border-purple-500/60';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !answered && handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left font-semibold text-white hover:scale-102 ${buttonClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {answered && (
            <div className="flex gap-4 justify-center">
              {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                <div className="text-center">
                  <p className="text-2xl mb-4">🎉 Correct! Enemy defeated!</p>
                  <button
                    onClick={goToNextQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-bold transition-all transform hover:scale-105"
                  >
                    {questionsRemaining > 0 ? `Next Battle (${questionsRemaining} remaining)` : 'Complete Battle'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl mb-4">❌ Wrong! Try the next one.</p>
                  <button
                    onClick={goToNextQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold transition-all transform hover:scale-105"
                  >
                    {questionsRemaining > 0 ? `Next Battle (${questionsRemaining} remaining)` : 'Complete Battle'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="mt-8 bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm">Battle Progress</p>
              <p className="text-sm text-purple-400">{currentQuestion + 1}/{questions.length}</p>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
