'use client';

import React from 'react';
import { BookOpen, Lock, AlertTriangle, Zap, Crown, CheckCircle2, RotateCw } from 'lucide-react';

interface SkillNodeCardProps {
  topic: {
    id: string;
    name?: string;
    title?: string;
    difficulty?: string;
    status?: string;
  };
  state: 'locked' | 'weak' | 'fastTrack' | 'boss' | 'mastered' | 'inProgress';
  onClick?: () => void;
}

export default function SkillNodeCard({ topic, state, onClick }: SkillNodeCardProps) {
  // Support both name and title fields (backend might use different field names)
  const topicName = topic.name || topic.title || topic.topic || 'Untitled Topic';
  const difficulty = topic.difficulty || 'Medium';

  const stateConfig = {
    locked: {
      icon: Lock,
      iconColor: '#9CA3AF',
      bgColor: '#F3F4F6',
      borderColor: '#E5E7EB',
      textColor: '#9CA3AF',
      label: 'Locked',
    },
    weak: {
      icon: AlertTriangle,
      iconColor: '#F59E0B',
      bgColor: '#FEF3C7',
      borderColor: '#FCD34D',
      textColor: '#92400E',
      label: 'Weak - Needs Revision',
    },
    fastTrack: {
      icon: Zap,
      iconColor: '#F59E0B',
      bgColor: '#FEF3C7',
      borderColor: '#FCD34D',
      textColor: '#92400E',
      label: 'Fast Track - Exam Priority',
    },
    boss: {
      icon: Crown,
      iconColor: '#EF4444',
      bgColor: '#FEE2E2',
      borderColor: '#FCA5A5',
      textColor: '#991B1B',
      label: 'Boss Battle',
    },
    mastered: {
      icon: CheckCircle2,
      iconColor: '#10B981',
      bgColor: '#D1FAE5',
      borderColor: '#6EE7B7',
      textColor: '#065F46',
      label: 'Mastered',
    },
    inProgress: {
      icon: BookOpen,
      iconColor: '#3FDFD5',
      bgColor: '#E0F7FA',
      borderColor: '#80DEEA',
      textColor: '#00695C',
      label: 'In Progress',
    },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  const difficultyColors = {
    Easy: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    Medium: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    Hard: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  };

  const diffConfig = difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.Medium;

  return (
    <button
      onClick={onClick}
      disabled={state === 'locked'}
      className={`w-full bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border-2 transition-all text-left ${
        state === 'locked'
          ? 'opacity-50 cursor-not-allowed border-gray-200'
          : 'hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border-gray-100'
      }`}
      style={{
        backgroundColor: state === 'locked' ? '#F9FAFB' : config.bgColor,
        borderColor: state === 'locked' ? '#E5E7EB' : config.borderColor,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${config.iconColor}20` }}
        >
          <Icon size={20} style={{ color: config.iconColor }} />
        </div>
        {state !== 'locked' && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: diffConfig.bg,
              color: diffConfig.text,
              border: `1px solid ${diffConfig.border}`,
            }}
          >
            {difficulty}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold mb-2" style={{ color: state === 'locked' ? '#9CA3AF' : '#1F2937' }}>
        {topicName}
      </h3>

      <p className="text-xs font-medium mb-3" style={{ color: config.textColor }}>
        {config.label}
      </p>

      {state === 'fastTrack' && (
        <div className="mb-3">
          <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>
            ⚡ Exam Priority
          </span>
        </div>
      )}

      <div className="w-full rounded-full h-2 bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: state === 'mastered' ? '100%' : state === 'locked' ? '0%' : '60%',
            background: state === 'mastered'
              ? 'linear-gradient(90deg, #10B981, #059669)'
              : 'linear-gradient(90deg, #3FDFD5, #61210F)',
          }}
        />
      </div>

      <p className="text-xs mt-2 font-medium" style={{ color: '#6B7280' }}>
        ⚡ 200 XP
      </p>
    </button>
  );
}

