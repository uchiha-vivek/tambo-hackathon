'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  progress?: number;
  progressLabel?: string;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  progress,
  progressLabel,
  iconColor = '#3FDFD5',
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-4xl font-bold mb-1" style={{ color: '#61210F' }}>
        {value}
      </p>
      <p className="text-sm mb-2 font-medium" style={{ color: '#61210F' }}>
        {label}
      </p>
      {progress !== undefined && (
        <>
          <div className="w-full rounded-full h-2 overflow-hidden bg-gray-100">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${progress}%`, 
                background: 'linear-gradient(90deg, #3FDFD5, #61210F)' 
              }}
            />
          </div>
          {progressLabel && (
            <p className="text-xs mt-2 font-medium" style={{ color: '#61210F' }}>
              {progressLabel}
            </p>
          )}
        </>
      )}
    </div>
  );
}

