'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  iconColor?: string;
}

export default function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  className = '',
  iconColor = '#3FDFD5',
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all text-left ${className}`}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon size={32} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold mb-1" style={{ color: '#1F2937' }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

