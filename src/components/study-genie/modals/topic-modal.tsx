'use client';

import { X, BookOpen, Code, Zap, Target } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ActionCard from '@/components/ui/ActionCard';

interface TopicModalProps {
  topic: any;
  onClose: () => void;
  onNavigate: (view: string, topic?: any) => void;
}

export default function TopicModal({ topic, onClose, onNavigate }: TopicModalProps) {
  // Support multiple field name variations
  const topicName = topic?.name || topic?.title || topic?.topic || 'Topic';
  const difficulty = topic?.difficulty || 'Medium';
  const xp = topic?.xp || 200;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[1.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between rounded-t-[1.5rem]">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#61210F' }}>
              {topicName}
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Difficulty: {difficulty} • {xp} XP
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Learning Objectives */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#1F2937' }}>
              <BookOpen size={20} style={{ color: '#3FDFD5' }} />
              Learning Objectives
            </h3>
            <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                ✓ Master the fundamental concepts of {topicName}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                ✓ Solve practice problems with confidence
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                ✓ Prepare for interview questions
              </p>
            </div>
          </div>

          {/* Learning Options */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
              Choose Your Learning Mode
            </h3>
            <div className="space-y-3">
              <ActionCard
                icon={Target}
                title="Combat Mode (Quiz)"
                description="Test your knowledge with interactive quiz battles"
                iconColor="#3FDFD5"
                onClick={() => {
                  onNavigate('combat', topic);
                  onClose();
                }}
              />
              <ActionCard
                icon={BookOpen}
                title="Flashcards"
                description="Active recall practice with spaced repetition"
                iconColor="#61210F"
                onClick={() => {
                  onNavigate('flashcards', topic);
                  onClose();
                }}
              />
              <ActionCard
                icon={Code}
                title="Code Practice"
                description="Solve coding challenges with hints and feedback"
                iconColor="#3FDFD5"
                onClick={() => {
                  onNavigate('editor', topic);
                  onClose();
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Difficulty</p>
              <p className="text-2xl font-bold" style={{ color: '#61210F' }}>
                {difficulty}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>XP Reward</p>
              <p className="text-2xl font-bold" style={{ color: '#3FDFD5' }}>
                +{xp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
