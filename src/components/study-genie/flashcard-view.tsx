'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCw, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { studyGenieBackend, Flashcard as BackendFlashcard } from '@/services/studygenie-backend';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

interface FlashcardViewProps {
  topic: any;
  onComplete: () => void;
  onNavigate: (view: string) => void;
}

export default function FlashcardView({ topic, onComplete, onNavigate }: FlashcardViewProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [difficultCards, setDifficultCards] = useState<Set<string>>(new Set());

  // Load flashcards from StudyGenie Backend
  useEffect(() => {
    async function loadFlashcards() {
      setIsLoading(true);
      try {
        const topicName = topic?.name || 'General Knowledge';
        
        // Generate flashcards using real backend
        const response = await studyGenieBackend.generateFlashcards(topicName, 10);
        
        // Transform to our format
        const cards: Flashcard[] = response.flashcards.map((card, idx) => ({
          id: `card-${idx + 1}`,
          question: card.front,
          answer: card.back,
          topic: card.topic
        }));

        setFlashcards(cards);
      } catch (error) {
        console.error('Error loading flashcards:', error);
        // Fallback demo cards
        const demoCards: Flashcard[] = [
          {
            id: '1',
            question: `What is ${topic?.name || 'this concept'}?`,
            answer: `${topic?.name || 'This concept'} is a fundamental programming concept that involves...`,
            topic: topic?.name || 'General'
          },
          {
            id: '2',
            question: `When should you use ${topic?.name || 'this'}?`,
            answer: `Use ${topic?.name || 'this'} when you need to...`,
            topic: topic?.name || 'General'
          },
          {
            id: '3',
            question: `What are the key properties of ${topic?.name || 'this'}?`,
            answer: `Key properties include: 1) ..., 2) ..., 3) ...`,
            topic: topic?.name || 'General'
          },
        ];
        setFlashcards(demoCards);
      } finally {
        setIsLoading(false);
      }
    }

    loadFlashcards();
  }, [topic]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMastered = () => {
    const currentCard = flashcards[currentIndex];
    setMasteredCards(prev => new Set([...prev, currentCard.id]));
    difficultCards.delete(currentCard.id);
    handleNext();
  };

  const handleDifficult = () => {
    const currentCard = flashcards[currentIndex];
    setDifficultCards(prev => new Set([...prev, currentCard.id]));
    masteredCards.delete(currentCard.id);
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
    setDifficultCards(new Set());
  };

  const progress = ((currentIndex + 1) / flashcards.length) * 100;
  const currentCard = flashcards[currentIndex];
  const masteredCount = masteredCards.size;
  const difficultCount = difficultCards.size;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🃏</div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Flashcards...</h2>
          <p className="text-purple-300">Powered by Tambo AI</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Flashcards Available</h2>
          <button
            onClick={() => onNavigate('skillTree')}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-purple-500/20 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🃏</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{topic?.name || 'Flashcards'}</h2>
                <p className="text-purple-300 text-sm">Master the concepts through active recall</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('skillTree')}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white transition-all"
            >
              Back to Skill Tree
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-purple-300 mt-2 text-center">
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-[calc(100%-200px)] px-8 py-12">
        <div className="max-w-4xl w-full">
          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-white font-semibold">{masteredCount} Mastered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg">
              <XCircle size={20} className="text-red-400" />
              <span className="text-white font-semibold">{difficultCount} Need Review</span>
            </div>
          </div>

          {/* Flashcard */}
          <div className="relative perspective-1000 mb-8">
            <div
              className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={handleFlip}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card (Question) */}
              <div
                className={`absolute inset-0 backface-hidden ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border-2 border-purple-500/40 p-12 flex flex-col items-center justify-center shadow-2xl">
                  <div className="text-purple-300 text-sm font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={16} />
                    QUESTION
                  </div>
                  <p className="text-3xl text-white text-center font-medium leading-relaxed">
                    {currentCard.question}
                  </p>
                  <p className="text-purple-300 text-sm mt-8 animate-pulse">Click to reveal answer</p>
                </div>
              </div>

              {/* Back of card (Answer) */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border-2 border-pink-500/40 p-12 flex flex-col items-center justify-center shadow-2xl">
                  <div className="text-pink-300 text-sm font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={16} />
                    ANSWER
                  </div>
                  <p className="text-2xl text-white text-center leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <p className="text-pink-300 text-sm mt-8">Rate your understanding below</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-white transition-all"
                title="Reset Progress"
              >
                <RotateCw size={20} />
              </button>

              {isFlipped && (
                <>
                  <button
                    onClick={handleDifficult}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 rounded-xl text-red-300 font-semibold transition-all"
                  >
                    <XCircle size={20} />
                    Need Review
                  </button>
                  <button
                    onClick={handleMastered}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 hover:border-green-500/60 rounded-xl text-green-300 font-semibold transition-all"
                  >
                    <CheckCircle size={20} />
                    Mastered
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
