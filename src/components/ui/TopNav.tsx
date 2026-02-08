'use client';

import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface TopNavProps {
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export default function TopNav({ 
  showBack = false, 
  showClose = false, 
  onBack, 
  onClose,
  title,
  subtitle 
}: TopNavProps) {
  return (
    <nav className="bg-[#61210F] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        )}
        {title && (
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
          </div>
        )}
        {!title && (
          <>
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl font-bold text-white">StudyGenie</h1>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {subtitle && !title && (
          <p className="text-white/80 text-sm">{subtitle}</p>
        )}
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        {!subtitle && !showClose && (
          <p className="text-white/80 text-sm">Turn your syllabus into a learning adventure</p>
        )}
      </div>
    </nav>
  );
}

