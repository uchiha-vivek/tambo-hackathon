'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface QuestCardProps {
  title: string;
  progress: number;
  total: number;
  xp: number;
  completed: boolean;
}

export default function QuestCard({ title, progress, total, xp, completed }: QuestCardProps) {
  const progressPercent = (progress / total) * 100;

  return (
    <div
      className={`p-4 rounded-2xl border backdrop-blur-sm transition-all ${
        completed
          ? 'bg-[#3FDFD5]/20 border-[#3FDFD5]/40'
          : 'bg-white/40 border-[#61210F]/20 hover:border-[#3FDFD5]/40'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold flex-1" style={{ color: '#61210F' }}>
          {title}
        </p>
        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#3FDFD5' }}>
          <Zap size={12} />
          {xp}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${progressPercent}%`,
              background: completed 
                ? 'linear-gradient(90deg, #3FDFD5, #61210F)' 
                : 'linear-gradient(90deg, #61210F, #3FDFD5)'
            }}
          />
        </div>
        <p className="text-xs font-semibold" style={{ color: '#61210F' }}>
          {progress}/{total}
        </p>
      </div>
    </div>
  );
}

