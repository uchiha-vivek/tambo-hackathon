'use client';

import { useState } from 'react';
import { Copy, Download, Share2, X } from 'lucide-react';

interface ScoreCardProps {
  xpEarned: number;
  focusTime: number;
  weakAreas: string[];
  interviewReadiness: number;
  sessionDate: Date;
  onClose?: () => void;
}

export default function ScoreCard({
  xpEarned,
  focusTime,
  weakAreas,
  interviewReadiness,
  sessionDate,
  onClose
}: ScoreCardProps) {
  const [copied, setCopied] = useState(false);

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleShare = () => {
    const text = `I just earned ${xpEarned} XP and achieved ${interviewReadiness}% interview readiness on StudyGenie! 🎮📚`;
    if (navigator.share) {
      navigator.share({
        title: 'StudyGenie Session',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-8 py-12 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full transition-all text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm z-10 group"
            aria-label="Close"
            title="Close"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
          <p className="text-5xl mb-4">🏆</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Session Complete!</h2>
          <p className="text-gray-600">{sessionDate.toLocaleDateString()}</p>
        </div>

        {/* Stats Grid */}
        <div className="p-8 space-y-6 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            {/* XP Earned */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">⭐ XP EARNED</p>
              <p className="text-4xl font-bold text-gray-800">{xpEarned}</p>
              <p className="text-xs text-gray-500 mt-2">+15 Level Progress</p>
            </div>

            {/* Focus Time */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">⏱️ FOCUS TIME</p>
              <p className="text-4xl font-bold text-gray-800">{formatFocusTime(focusTime)}</p>
              <p className="text-xs text-gray-500 mt-2">+2 Streak Days</p>
            </div>

            {/* Interview Readiness */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">🎯 INTERVIEW READY</p>
              <p className="text-4xl font-bold text-gray-800">{interviewReadiness}%</p>
              <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                  style={{ width: `${interviewReadiness}%` }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">🔥 CURRENT STREAK</p>
              <p className="text-4xl font-bold text-gray-800">13</p>
              <p className="text-xs text-gray-500 mt-2">Days in a row</p>
            </div>
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-400 flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
                Areas to Improve
              </h3>
              <div className="flex flex-wrap gap-2">
                {weakAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white border border-red-200 rounded-xl text-red-700 text-sm font-medium shadow-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-400 flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              Revision ETA
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <span className="text-gray-700 font-medium">Binary Trees</span>
                <span className="text-sm text-purple-600 font-semibold">2 days</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <span className="text-gray-700 font-medium">Graph Algorithms</span>
                <span className="text-sm text-purple-600 font-semibold">3 days</span>
              </div>
            </div>
          </div>

          {/* Spotify-style Share */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Achievement</h3>
            <p className="text-gray-700 text-sm mb-4">
              📤 "I just earned {xpEarned} XP and achieved {interviewReadiness}% interview readiness on StudyGenie! 🎮📚"
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all shadow-sm"
              >
                <Share2 size={18} />
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 font-semibold transition-all">
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-6 flex flex-col sm:flex-row justify-between gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-all flex items-center justify-center gap-2 font-medium">
            <X size={18} />
            <span>Close</span>
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-all font-medium">
              ← Back to Dashboard
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all transform hover:scale-105 shadow-sm">
              Next Battle →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
