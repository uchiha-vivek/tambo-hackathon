'use client';

import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function PrimaryButton({ children, onClick, className = '', disabled = false }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-[0.75rem] font-semibold text-white transition-all ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-[#3FDFD5] to-[#61210F] hover:shadow-lg'
      } ${className}`}
    >
      {children}
    </button>
  );
}

