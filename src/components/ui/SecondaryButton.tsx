'use client';

import React from 'react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function SecondaryButton({ children, onClick, className = '', disabled = false }: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-[0.75rem] font-semibold transition-all border ${
        disabled
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-[#61210F] border-[#61210F]/20 hover:bg-[#61210F]/5 hover:border-[#61210F]/40'
      } ${className}`}
    >
      {children}
    </button>
  );
}

