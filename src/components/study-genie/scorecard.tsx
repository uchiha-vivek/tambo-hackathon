'use client';

import { X, Trophy, Clock, Target } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatCard from '@/components/ui/StatCard';

interface ScoreCardProps {
  xpEarned: number;
  focusTime: number;
  weakAreas: string[];
  interviewReadiness: number;
  sessionDate: Date;
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

export default function ScoreCard({
  xpEarned,
  focusTime,
  weakAreas,
  interviewReadiness,
  sessionDate,
  onClose,
  onNavigate,
}: ScoreCardProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[1.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-[1.5rem]">
          <h2 className="text-2xl font-bold" style={{ color: '#61210F' }}>
            Quiz Complete!
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Trophy}
              label="XP Earned"
              value={xpEarned}
              iconColor="#F59E0B"
            />
            <StatCard
              icon={Clock}
              label="Time Spent"
              value={formatTime(focusTime)}
              iconColor="#3FDFD5"
            />
            <StatCard
              icon={Target}
              label="Interview Ready"
              value={`${interviewReadiness}%`}
              progress={interviewReadiness}
              iconColor="#61210F"
            />
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
                Areas to Review
              </h3>
              <div className="space-y-2">
                {weakAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#FEF3C7' }}
                  >
                    <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                      {area}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <SecondaryButton onClick={onClose}>
              Close
            </SecondaryButton>
            {onNavigate && (
              <>
                <SecondaryButton onClick={() => { onNavigate('dashboard'); onClose(); }}>
                  Back to Dashboard
                </SecondaryButton>
                <PrimaryButton onClick={() => { onNavigate('skillTree'); onClose(); }}>
                  Next Battle
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
