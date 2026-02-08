/**
 * Spaced Repetition Algorithm (SM-2)
 * SuperMemo 2 algorithm for flashcard scheduling
 */

export interface FlashcardReview {
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: Date;
}

export interface ReviewResult {
  quality: number; // 0-5 (0=complete blackout, 5=perfect response)
  newEaseFactor: number;
  newInterval: number;
  newRepetitions: number;
  nextReview: Date;
}

/**
 * Calculate next review date using SM-2 algorithm
 * @param currentEaseFactor Current ease factor (default 2.5)
 * @param currentInterval Current interval in days
 * @param currentRepetitions Current number of successful repetitions
 * @param quality Quality of recall (0-5)
 * @returns Updated flashcard review data
 */
export function calculateNextReview(
  currentEaseFactor: number = 2.5,
  currentInterval: number = 1,
  currentRepetitions: number = 0,
  quality: number
): ReviewResult {
  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;

  // Update ease factor based on quality
  newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor is 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  // Calculate new interval based on quality
  if (quality < 3) {
    // If quality is low, reset repetitions and interval
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // If quality is good, increase interval
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
    newRepetitions = newRepetitions + 1;
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    quality,
    newEaseFactor,
    newInterval,
    newRepetitions,
    nextReview,
  };
}

/**
 * Get flashcards due for review
 * @param flashcards Array of flashcards
 * @returns Flashcards that are due for review
 */
export function getDueFlashcards<T extends { nextReview: Date }>(
  flashcards: T[]
): T[] {
  const now = new Date();
  return flashcards.filter(
    (card) => new Date(card.nextReview) <= now && !card.mastered
  );
}

/**
 * Get flashcards by difficulty (for review prioritization)
 */
export function prioritizeFlashcards<T extends { 
  easeFactor: number; 
  nextReview: Date;
  mastered: boolean;
}>(
  flashcards: T[]
): T[] {
  return flashcards
    .filter((card) => !card.mastered)
    .sort((a, b) => {
      // Prioritize cards with lower ease factor (harder cards)
      if (a.easeFactor !== b.easeFactor) {
        return a.easeFactor - b.easeFactor;
      }
      // Then prioritize cards due sooner
      return (
        new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
      );
    });
}

/**
 * Calculate mastery status
 * @param easeFactor Current ease factor
 * @param repetitions Number of successful repetitions
 * @param interval Current interval in days
 * @returns true if card is considered mastered
 */
export function isMastered(
  easeFactor: number,
  repetitions: number,
  interval: number
): boolean {
  // Card is mastered if:
  // - Ease factor is high (>= 2.5)
  // - Has been reviewed successfully many times (>= 10)
  // - Interval is long (>= 30 days)
  return easeFactor >= 2.5 && repetitions >= 10 && interval >= 30;
}

