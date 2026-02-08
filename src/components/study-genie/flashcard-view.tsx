'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ProgressBar from '@/components/ui/ProgressBar';

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

  useEffect(() => {
    async function loadFlashcards() {
      setIsLoading(true);
      try {
        const topicName = topic?.name || topic?.title || topic?.topic || 'General Knowledge';
        const response = await studyGenieBackend.generateFlashcards(topicName, 10);
        
        const cards: Flashcard[] = response.flashcards.map((card: any, idx: number) => ({
          id: `card-${idx + 1}`,
          question: card.front,
          answer: card.back,
          topic: card.topic || topicName
        }));

        setFlashcards(cards);
      } catch (error) {
        console.error('Error loading flashcards:', error);
        setFlashcards([
          {
            id: '1',
            question: `What is ${topic?.name || 'this concept'}?`,
            answer: `${topic?.name || 'This concept'} is a fundamental concept that involves...`,
            topic: topic?.name || 'General'
          },
          {
            id: '2',
            question: `When should you use ${topic?.name || 'this'}?`,
            answer: `Use ${topic?.name || 'this'} when you need to...`,
            topic: topic?.name || 'General'
          },
        ]);
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
    } else {
      onComplete();
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
    setDifficultCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    handleNext();
  };

  const handleDifficult = () => {
    const currentCard = flashcards[currentIndex];
    setDifficultCards(prev => new Set([...prev, currentCard.id]));
    setMasteredCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    handleNext();
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
              Loading flashcards...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (flashcards.length === 0) {
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
              No flashcards available
            </p>
            <SecondaryButton onClick={() => onNavigate('skillTree')}>
              Back to Skill Tree
            </SecondaryButton>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('skillTree'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#61210F' }}>
                Card {currentIndex + 1} of {flashcards.length}
              </p>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                {masteredCards.size} mastered
              </p>
            </div>
            <ProgressBar progress={progress} />
          </div>

          {/* Flashcard */}
          <div className="mb-8">
            <div
              className="relative w-full h-96 perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden rounded-[1.5rem] p-8 flex flex-col items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 ${
                    !isFlipped ? 'z-10' : ''
                  }`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF620' }}>
                    <span className="text-3xl">?</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#1F2937' }}>
                    {currentCard.question}
                  </h2>
                  <p className="text-sm text-center" style={{ color: '#6B7280' }}>
                    Click to flip
                  </p>
                </div>

                {/* Back */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden rounded-[1.5rem] p-8 flex flex-col items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 ${
                    isFlipped ? 'z-10' : ''
                  }`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                    <CheckCircle size={32} style={{ color: '#3FDFD5' }} />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#1F2937' }}>
                    Answer
                  </h2>
                  <p className="text-lg text-center" style={{ color: '#6B7280' }}>
                    {currentCard.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <SecondaryButton
                onClick={handleFlip}
                className="flex items-center gap-2"
              >
                <RotateCw size={18} />
                Flip Card
              </SecondaryButton>
            </div>

            <div className="flex gap-3">
              <SecondaryButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1"
              >
                <ChevronLeft size={18} className="inline mr-2" />
                Previous
              </SecondaryButton>
              <SecondaryButton
                onClick={handleDifficult}
                className="flex-1"
                style={{
                  backgroundColor: '#FEE2E2',
                  borderColor: '#FCA5A5',
                  color: '#991B1B',
                }}
              >
                <XCircle size={18} className="inline mr-2" />
                Difficult
              </SecondaryButton>
              <PrimaryButton
                onClick={handleMastered}
                className="flex-1"
              >
                <CheckCircle size={18} className="inline mr-2" />
                Mastered
              </PrimaryButton>
              <SecondaryButton
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight size={18} className="inline ml-2" />
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
