'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveProgress, getUserStats, getWeakAreas } from '@/lib/progress-service';

export interface GameState {
  level: number;
  xp: number;
  totalXP: number;
  health: number;
  focus: number;
  streak: number;
  skillsCompleted: number;
  totalSkills: number;
  interviewReadiness: number;
  weakAreas: string[];
  lastActiveDate: Date;
}

const INITIAL_STATE: GameState = {
  level: 1,
  xp: 0,
  totalXP: 500,
  health: 100,
  focus: 50,
  streak: 0,
  skillsCompleted: 0,
  totalSkills: 0,
  interviewReadiness: 0,
  weakAreas: [],
  lastActiveDate: new Date(),
};

const XP_THRESHOLDS = [0, 500, 1200, 2200, 3500, 5000, 6800, 8800, 11000, 13500, 16500];

export function useGameState(userId?: string) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load game state from storage/API
  useEffect(() => {
    async function loadGameState() {
      if (userId) {
        try {
          const stats = await getUserStats(userId);
          const weakAreas = await getWeakAreas(userId);
          
          setGameState({
            level: stats.profile?.level || 1,
            xp: stats.profile?.xp || 0,
            totalXP: stats.profile?.totalXP || 500,
            health: 100,
            focus: 75,
            streak: stats.profile?.streak || 0,
            skillsCompleted: stats.masteredTopics || 0,
            totalSkills: 0, // Will be set from syllabus
            interviewReadiness: stats.profile?.interviewReadiness || 0,
            weakAreas,
            lastActiveDate: stats.profile?.lastActiveDate || new Date(),
          });
        } catch (error) {
          console.error('Error loading game state:', error);
        }
      } else {
        // Load from localStorage for demo
        const saved = localStorage.getItem('studygenie_game_state');
        if (saved) {
          setGameState(JSON.parse(saved));
        }
      }
      setIsLoading(false);
    }
    loadGameState();
  }, [userId]);

  // Save game state
  const saveGameState = useCallback((state: GameState) => {
    if (userId) {
      // Save to database via API
      // This would be done through progress service
    } else {
      localStorage.setItem('studygenie_game_state', JSON.stringify(state));
    }
  }, [userId]);

  // Earn XP and check for level up
  const earnXP = useCallback((amount: number, source: string = 'activity') => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newTotalXP = prev.totalXP;

      // Check for level up
      for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newXP >= XP_THRESHOLDS[i]) {
          if (i + 1 > newLevel) {
            newLevel = i + 1;
            newTotalXP = XP_THRESHOLDS[Math.min(i + 1, XP_THRESHOLDS.length - 1)] || prev.totalXP * 1.5;
          }
          break;
        }
      }

      const newState = {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalXP: newTotalXP,
      };

      saveGameState(newState);
      return newState;
    });
  }, [saveGameState]);

  // Update focus meter
  const updateFocus = useCallback((amount: number) => {
    setGameState(prev => {
      const newFocus = Math.max(0, Math.min(100, prev.focus + amount));
      return { ...prev, focus: newFocus };
    });
  }, []);

  // Update health
  const updateHealth = useCallback((amount: number) => {
    setGameState(prev => {
      const newHealth = Math.max(0, Math.min(100, prev.health + amount));
      return { ...prev, health: newHealth };
    });
  }, []);

  // Update streak
  const updateStreak = useCallback((increment: boolean = true) => {
    setGameState(prev => ({
      ...prev,
      streak: increment ? prev.streak + 1 : 0,
      lastActiveDate: new Date(),
    }));
  }, []);

  // Add weak area
  const addWeakArea = useCallback((area: string) => {
    setGameState(prev => ({
      ...prev,
      weakAreas: [...new Set([...prev.weakAreas, area])],
    }));
  }, []);

  // Update interview readiness
  const updateInterviewReadiness = useCallback((score: number) => {
    setGameState(prev => ({
      ...prev,
      interviewReadiness: Math.max(0, Math.min(100, score)),
    }));
  }, []);

  // Update skills completed
  const updateSkillsCompleted = useCallback((count: number, total: number) => {
    setGameState(prev => ({
      ...prev,
      skillsCompleted: count,
      totalSkills: total,
    }));
  }, []);

  return {
    gameState,
    isLoading,
    earnXP,
    updateFocus,
    updateHealth,
    updateStreak,
    addWeakArea,
    updateInterviewReadiness,
    updateSkillsCompleted,
    setGameState,
  };
}

