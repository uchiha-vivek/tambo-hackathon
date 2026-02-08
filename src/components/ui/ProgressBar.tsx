'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({ progress, className = '', showLabel = false, label }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full rounded-full h-2 overflow-hidden bg-gray-100">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{ 
            width: `${Math.min(100, Math.max(0, progress))}%`, 
            background: 'linear-gradient(90deg, #3FDFD5, #61210F)' 
          }}
        />
      </div>
      {showLabel && label && (
        <p className="text-xs mt-2 font-medium" style={{ color: '#61210F' }}>
          {label}
        </p>
      )}
    </div>
  );
}

