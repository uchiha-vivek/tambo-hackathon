'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Lock, Zap, Flame, Star, AlertTriangle, Crown, TrendingUp } from 'lucide-react';
import { generateSkillTreeUI } from '@/services/tambo-ui-generator';
import TopicModal from './modals/topic-modal';

interface SkillTreeEnhancedProps {
  syllabus: any;
  onNavigate: (view: string) => void;
  onTopicSelect?: (topic: any) => void;
}

export default function SkillTreeEnhanced({ syllabus, onNavigate, onTopicSelect }: SkillTreeEnhancedProps) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['unit-1']));
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [playerXP, setPlayerXP] = useState(2340);

  // Generate Tambo UI spec on mount (only when syllabus changes)
  useEffect(() => {
    async function generateTamboUI() {
      if (!syllabus) return;
      
      try {
        const userProgress = {
          topics: {},
          xp: playerXP
        };
        
        const spec = await generateSkillTreeUI(syllabus, userProgress);
        // Log to show Tambo UI is working
        console.log('🎨 [TAMBO UI] Skill Tree layout generated:', {
          layout: spec.props.layout,
          topics: spec.props.topics?.length || 0,
          connections: spec.props.connections?.length || 0,
          completionRate: `${spec.props.completionRate?.toFixed(1) || 0}%`
        });
      } catch (error) {
        console.error('Tambo UI generation error:', error);
      }
    }
    
    generateTamboUI();
    // Only regenerate when syllabus changes, not on every playerXP update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabus]);

  // Simulate topic states
  const topicStates = {
    locked: '🔒',
    weak: '⚠️',
    fastTrack: '⚡',
    boss: '👑',
    mastered: '✅',
    inProgress: '🔄'
  };

  const getTopicState = (topic: any, unitIndex: number, topicIndex: number) => {
    // Locked if in later units and not enough XP
    if (unitIndex > 0 && playerXP < 1000) return 'locked';
    
    // Boss topics are the last topic in hard units
    if (topic.difficulty === 'Hard' && topicIndex === 2) return 'boss';
    
    // Fast track topics (exam priority)
    if (topicIndex === 1 && unitIndex === 0) return 'fastTrack';
    
    // Weak topics (need revision)
    if (Math.random() < 0.2) return 'weak';
    
    // Mastered topics
    if (Math.random() < 0.3) return 'mastered';
    
    return 'inProgress';
  };

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'from-green-600/30 to-emerald-700/30 border-green-500/40';
      case 'Medium':
        return 'from-yellow-600/30 to-orange-700/30 border-yellow-500/40';
      case 'Hard':
        return 'from-red-600/30 to-rose-700/30 border-red-500/40';
      default:
        return 'from-purple-600/30 to-pink-700/30 border-purple-500/40';
    }
  };

  const getStateStyles = (state: string) => {
    switch (state) {
      case 'locked':
        return {
          border: 'border-slate-600/40',
          bg: 'bg-slate-800/30',
          hover: '',
          opacity: 'opacity-50',
          cursor: 'cursor-not-allowed'
        };
      case 'weak':
        return {
          border: 'border-orange-500/60',
          bg: 'bg-orange-600/10',
          hover: 'hover:border-orange-500/80 hover:scale-102',
          opacity: '',
          cursor: 'cursor-pointer'
        };
      case 'fastTrack':
        return {
          border: 'border-yellow-500/60',
          bg: 'bg-yellow-600/10',
          hover: 'hover:border-yellow-500/80 hover:scale-102',
          opacity: '',
          cursor: 'cursor-pointer'
        };
      case 'boss':
        return {
          border: 'border-red-500/60',
          bg: 'bg-gradient-to-br from-red-600/20 to-orange-600/20',
          hover: 'hover:border-red-500/80 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30',
          opacity: '',
          cursor: 'cursor-pointer'
        };
      case 'mastered':
        return {
          border: 'border-green-500/60',
          bg: 'bg-green-600/10',
          hover: 'hover:border-green-500/80 hover:scale-102',
          opacity: 'opacity-70',
          cursor: 'cursor-pointer'
        };
      default:
        return {
          border: 'border-purple-500/40',
          bg: 'bg-purple-600/10',
          hover: 'hover:border-purple-500/60 hover:scale-102',
          opacity: '',
          cursor: 'cursor-pointer'
        };
    }
  };

  const handleStartQuiz = (topic: any) => {
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    setSelectedTopic(null);
    onNavigate('combat');
  };

  const handleStartPractice = (topic: any) => {
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    setSelectedTopic(null);
    onNavigate('editor');
  };

  const handleStartFlashcards = (topic: any) => {
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    setSelectedTopic(null);
    onNavigate('flashcards');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-slate-950/95 via-purple-950/95 to-slate-950/95 backdrop-blur-xl border-b border-purple-500/30 px-8 py-6 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                🌳 Knowledge Skill Tree
              </h2>
              <p className="text-purple-300 text-sm">Master each node to unlock your full potential</p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Total XP</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {playerXP}
                </p>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-purple-500/50 rounded-xl text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                ← Dashboard
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">
              <span>🔒</span>
              <span className="text-slate-300">Locked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-600/20 rounded-full border border-orange-500/40">
              <span>⚠️</span>
              <span className="text-orange-300">Weak - Needs Revision</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600/20 rounded-full border border-yellow-500/40">
              <span>⚡</span>
              <span className="text-yellow-300">Fast Track - Exam Priority</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 rounded-full border border-red-500/40">
              <span>👑</span>
              <span className="text-red-300">Boss Battle</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full border border-green-500/40">
              <span>✅</span>
              <span className="text-green-300">Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Tree Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {syllabus.units.map((unit: any, unitIndex: number) => {
            const completedTopics = unit.topics.filter((t: any) => 
              getTopicState(t, unitIndex, 0) === 'mastered'
            ).length;
            const completionPercentage = (completedTopics / unit.topics.length) * 100;

            return (
              <div
                key={unit.id}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 overflow-hidden hover:border-purple-500/50 transition-all shadow-2xl"
              >
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-8 hover:bg-slate-700/30 transition-all"
                >
                  <div className="flex items-center gap-5 text-left flex-1">
                    <div className="relative">
                      <ChevronDown
                        size={32}
                        className={`text-purple-400 transition-all group-hover:text-purple-300 ${
                          expandedUnits.has(unit.id) ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl">
                          {unitIndex === 0 ? '📚' : unitIndex === 1 ? '🌳' : '⚡'}
                        </span>
                        <div>
                          <h3 className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {unit.name}
                          </h3>
                          <p className="text-purple-300 text-sm mt-1">
                            {unit.topics.length} topics • {unit.weightage}% of course • {unit.difficulty} difficulty
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-slate-700"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - completionPercentage / 100)}`}
                          className="text-purple-400 transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-lg font-bold text-purple-400">{Math.round(completionPercentage)}%</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-purple-300">Progress</p>
                      <p className="text-2xl font-bold text-white">{completedTopics}/{unit.topics.length}</p>
                    </div>
                  </div>
                </button>

                {/* Topics Grid */}
                {expandedUnits.has(unit.id) && (
                  <div className="border-t border-purple-500/30 p-8 bg-slate-950/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unit.topics.map((topic: any, topicIndex: number) => {
                        const state = getTopicState(topic, unitIndex, topicIndex);
                        const styles = getStateStyles(state);
                        const isLocked = state === 'locked';

                        return (
                          <button
                            key={topic.id}
                            onClick={() => !isLocked && setSelectedTopic({ ...topic, state })}
                            disabled={isLocked}
                            className={`relative overflow-hidden group rounded-xl p-6 border-2 transition-all ${styles.border} ${styles.bg} ${styles.hover} ${styles.opacity} ${styles.cursor}`}
                          >
                            {/* State Badge */}
                            <div className="absolute top-3 right-3 text-2xl">
                              {topicStates[state as keyof typeof topicStates]}
                            </div>

                            {/* Boss Topic Special Effect */}
                            {state === 'boss' && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
                            )}

                            <div className="relative z-10">
                              {/* Topic Icon */}
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center mb-4 border border-purple-500/40">
                                <span className="text-2xl">
                                  {state === 'boss' ? '👑' : state === 'fastTrack' ? '⚡' : '📖'}
                                </span>
                              </div>

                              {/* Topic Info */}
                              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                {topic.name}
                              </h4>
                              
                              <div className="flex items-center justify-between text-sm mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  topic.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300' :
                                  topic.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300' :
                                  'bg-red-600/30 text-red-300'
                                }`}>
                                  {topic.difficulty}
                                </span>
                                <span className="text-purple-300 flex items-center gap-1">
                                  <Zap size={14} />
                                  {topic.estimatedHours * 100} XP
                                </span>
                              </div>

                              {/* Progress Bar */}
                              {state !== 'locked' && (
                                <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      state === 'mastered' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                      state === 'weak' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                      state === 'boss' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                                      'bg-gradient-to-r from-purple-500 to-pink-500'
                                    }`}
                                    style={{ 
                                      width: state === 'mastered' ? '100%' : 
                                             state === 'inProgress' ? '50%' : 
                                             state === 'weak' ? '30%' : '0%' 
                                    }}
                                  />
                                </div>
                              )}

                              {/* State Labels */}
                              {state === 'boss' && (
                                <p className="text-xs text-red-300 mt-2 font-semibold">🏆 Boss Challenge</p>
                              )}
                              {state === 'fastTrack' && (
                                <p className="text-xs text-yellow-300 mt-2 font-semibold">⚡ Exam Priority</p>
                              )}
                              {state === 'weak' && (
                                <p className="text-xs text-orange-300 mt-2 font-semibold">⚠️ Needs Revision</p>
                              )}
                              {isLocked && (
                                <p className="text-xs text-slate-400 mt-2">Locked • Need {1000 - playerXP} more XP</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Modal */}
      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onStartQuiz={() => handleStartQuiz(selectedTopic)}
          onStartPractice={() => handleStartPractice(selectedTopic)}
          onStartFlashcards={() => handleStartFlashcards(selectedTopic)}
        />
      )}
    </div>
  );
}
