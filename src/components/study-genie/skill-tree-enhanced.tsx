'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Lock, AlertTriangle, Zap, Crown, CheckCircle2, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import SkillNodeCard from '@/components/ui/SkillNodeCard';
import TopicModal from './modals/topic-modal';

interface SkillTreeEnhancedProps {
  syllabus: any;
  onNavigate: (view: string, topic?: any) => void;
  onTopicSelect?: (topic: any) => void;
}

export default function SkillTreeEnhanced({ syllabus, onNavigate, onTopicSelect }: SkillTreeEnhancedProps) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [playerXP, setPlayerXP] = useState(2340);

  // Initialize expanded units
  useEffect(() => {
    if (syllabus?.units) {
      setExpandedUnits(new Set(syllabus.units.map((u: any) => u.id || u.name)));
      // Debug: Log syllabus structure
      console.log('[Skill Tree] Syllabus loaded:', {
        unitsCount: syllabus.units.length,
        totalTopics: syllabus.units.reduce((sum: number, u: any) => sum + (u.topics?.length || 0), 0),
        units: syllabus.units.map((u: any) => ({
          name: u.name || u.title,
          topicsCount: u.topics?.length || 0
        }))
      });
    } else {
      console.warn('[Skill Tree] No syllabus or units found:', syllabus);
    }
  }, [syllabus]);

  const getTopicState = (topic: any, unitIndex: number, topicIndex: number) => {
    // Locked if in later units and not enough XP
    if (unitIndex > 0 && playerXP < 1000) return 'locked';
    
    // Boss topics are the last topic in hard units
    if (topic.difficulty === 'Hard' && topicIndex === (syllabus?.units?.[unitIndex]?.topics?.length || 0) - 1) {
      return 'boss';
    }
    
    // Fast track topics (exam priority)
    if (topicIndex === 1 && unitIndex === 0) return 'fastTrack';
    
    // Weak topics (need revision)
    if (Math.random() < 0.2) return 'weak';
    
    // Mastered topics
    if (Math.random() < 0.3) return 'mastered';
    
    return 'inProgress';
  };

  const handleTopicClick = (topic: any, state: string) => {
    if (state === 'locked') return;
    // Set topic in parent immediately for navigation
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    // Show modal for learning mode selection
    setSelectedTopic(topic);
  };

  const totalXP = playerXP;
  const totalTopics = syllabus?.units?.reduce((sum: number, unit: any) => sum + (unit.topics?.length || 0), 0) || 0;
  const completedTopics = Math.floor(totalTopics * 0.2); // Simulate 20% completion

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('dashboard'),
        title: 'Knowledge Skill Tree',
        subtitle: 'Master each node to unlock your full potential',
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Stats */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Lock size={16} style={{ color: '#9CA3AF' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Locked</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Weak - Needs Revision</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: '#F59E0B' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Fast Track - Exam Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown size={16} style={{ color: '#EF4444' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Boss Battle</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Mastered</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>TOTAL XP</p>
              <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>{totalXP}</p>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-6">
            {syllabus?.units && syllabus.units.length > 0 ? (
              syllabus.units.map((unit: any, unitIndex: number) => {
                const unitId = unit.id || unit.name || `unit-${unitIndex}`;
                const unitName = unit.name || unit.title || `Unit ${unitIndex + 1}`;
                const topics = unit.topics || [];
                const completedInUnit = Math.floor(topics.length * 0.2);
                const progressPercent = topics.length > 0 ? (completedInUnit / topics.length) * 100 : 0;

              return (
                <div
                  key={unitId}
                  className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                        <BookOpen size={20} style={{ color: '#3FDFD5' }} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                          {unitName}
                        </h2>
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          {topics.length} topics • {progressPercent.toFixed(0)}% of course • {unit.difficulty || 'Medium'} difficulty
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold mb-1" style={{ color: '#3FDFD5' }}>
                        {progressPercent.toFixed(0)}%
                      </p>
                      <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        Progress {completedInUnit}/{topics.length}
                      </p>
                    </div>
                  </div>

                  {/* Topics Grid */}
                  {topics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topics.map((topic: any, topicIndex: number) => {
                        const state = getTopicState(topic, unitIndex, topicIndex);
                        return (
                          <SkillNodeCard
                            key={topic.id || `topic-${unitId}-${topicIndex}`}
                            topic={topic}
                            state={state}
                            onClick={() => handleTopicClick(topic, state)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        No topics in this unit
                      </p>
                    </div>
                  )}
                </div>
              );
              })
            ) : (
              <div className="bg-white rounded-[1.5rem] p-12 text-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                  <BookOpen size={32} style={{ color: '#3FDFD5' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#61210F' }}>
                  No Topics Available
                </h3>
                <p className="text-base mb-4" style={{ color: '#6B7280' }}>
                  Your syllabus doesn't have any units or topics yet.
                </p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  Please upload a syllabus with course content to see the skill tree.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Modal */}
      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onNavigate={onNavigate}
        />
      )}
    </AppShell>
  );
}
