'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, Flame, Trophy, Target, Book, BookOpen,
  Crown, Lock, AlertTriangle, Clock, 
  Calendar, TrendingUp, Shield, Heart, ArrowLeft, X 
} from 'lucide-react';
import { generateDashboardUI } from '@/services/tambo-ui-generator';
import AppShell from '@/components/ui/AppShell';
import StatCard from '@/components/ui/StatCard';
import ActionCard from '@/components/ui/ActionCard';
import QuestCard from '@/components/ui/QuestCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

interface DashboardEnhancedProps {
  syllabus: any;
  onNavigate: (view: string) => void;
}

export default function DashboardEnhanced({ syllabus, onNavigate }: DashboardEnhancedProps) {
  const [playerStats, setPlayerStats] = useState({
    level: 5,
    xp: 2340,
    totalXP: 5000,
    health: 85,
    focus: 65,
    streak: 12,
    skillsCompleted: 8,
    totalSkills: 18,
    interviewReadiness: 72
  });

  const [tamboUISpec, setTamboUISpec] = useState<any>(null);

  // Generate Tambo UI spec on mount (only once when syllabus changes)
  useEffect(() => {
    async function generateTamboUI() {
      if (!syllabus) return;
      
      try {
        const spec = await generateDashboardUI(playerStats, syllabus);
        setTamboUISpec(spec);
        // Log UI generation
        console.log('[Dashboard UI] Layout generated:', {
          layout: spec.props.layout,
          theme: spec.props.theme,
          widgets: spec.props.widgets?.length || 0,
          recommendations: spec.props.recommendations?.length || 0
        });
      } catch (error) {
        console.error('Tambo UI generation error:', error);
      }
    }
    
    generateTamboUI();
    // Only regenerate when syllabus changes, not on every playerStats update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabus]);

  const [dailyQuests, setDailyQuests] = useState([
    { id: 1, title: 'Complete 3 quiz battles', progress: 2, total: 3, xp: 150, completed: false },
    { id: 2, title: 'Practice 2 coding challenges', progress: 1, total: 2, xp: 200, completed: false },
    { id: 3, title: 'Maintain focus for 30 minutes', progress: 18, total: 30, xp: 100, completed: false },
    { id: 4, title: 'Review 5 flashcards', progress: 5, total: 5, xp: 80, completed: true }
  ]);

  // Simulate focus meter changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerStats(prev => ({
        ...prev,
        focus: Math.min(100, Math.max(0, prev.focus + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const xpPercentage = (playerStats.xp / playerStats.totalXP) * 100;
  const completionPercentage = (playerStats.skillsCompleted / playerStats.totalSkills) * 100;
  const questsCompleted = dailyQuests.filter(q => q.completed).length;
  const totalDailyXP = dailyQuests.reduce((sum, q) => sum + (q.completed ? q.xp : 0), 0);

  // Focus level categories
  const getFocusLevel = (focus: number) => {
    if (focus >= 80) return { label: 'Legendary', color: 'from-[#3FDFD5] to-[#61210F]' };
    if (focus >= 60) return { label: 'Focused', color: 'from-[#3FDFD5]/80 to-[#61210F]/60' };
    if (focus >= 40) return { label: 'Steady', color: 'from-[#61210F]/40 to-[#3FDFD5]/40' };
    return { label: 'Warming Up', color: 'from-gray-400 to-gray-500' };
  };

  const focusLevel = getFocusLevel(playerStats.focus);

  // Streak calendar data (last 7 days)
  const streakData = Array.from({ length: 7 }, (_, i) => ({
    day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
    active: i < 5 // Last 5 days active
  }));

  return (
    <AppShell
      navProps={{
        showBack: true,
        showClose: true,
        onBack: () => onNavigate('upload'),
        onClose: () => onNavigate('landing'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        {/* Hero Section with Player Card */}
        <div className="relative overflow-hidden">
        <div className="relative px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#3FDFD5]/10 border border-[#61210F]/20 rounded-xl text-[#61210F] hover:text-[#61210F] transition-all group shadow-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm">Back</span>
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#3FDFD5]/10 border border-[#61210F]/20 rounded-xl text-[#61210F] hover:text-[#61210F] transition-all group shadow-sm"
              title="Close Dashboard"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform" />
              <span className="font-medium text-sm">Close</span>
            </button>
          </div>

          {/* Course Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] backdrop-blur-xl flex items-center justify-center shadow-lg border border-white/20">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[#61210F] text-xs font-semibold uppercase tracking-wider">Your Course</p>
                <h1 className="text-3xl font-bold text-[#61210F]">
                  {syllabus.curriculum || 'Your Learning Quest'}
                </h1>
              </div>
            </div>
          </div>

          {/* Player Stats Cards - Modern Card Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Trophy}
              label="XP Earned"
              value={playerStats.xp}
              progress={xpPercentage}
              progressLabel="+15 Level Progress"
              iconColor="#3FDFD5"
            />
            <StatCard
              icon={Target}
              label="Focus Time"
              value="0h 0m"
              progress={playerStats.focus}
              progressLabel="+2 Streak Days"
              iconColor="#61210F"
            />
            <StatCard
              icon={Shield}
              label="Interview Ready"
              value={`${playerStats.interviewReadiness}%`}
              progress={playerStats.interviewReadiness}
              progressLabel="Keep practicing!"
              iconColor="#3FDFD5"
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={playerStats.streak}
              iconColor="#61210F"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Quests - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Quests Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#61210F]/20 p-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                    <Book className="text-white" size={18} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#61210F' }}>Daily Quests</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: '#61210F' }}>Today's XP</p>
                  <p className="text-sm font-bold" style={{ color: '#3FDFD5' }}>+{totalDailyXP}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {dailyQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    title={quest.title}
                    progress={quest.progress}
                    total={quest.total}
                    xp={quest.xp}
                    completed={quest.completed}
                  />
                ))}
              </div>

              <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm border border-[#61210F]/20 rounded-2xl">
                <p className="text-xs text-center font-medium" style={{ color: '#61210F' }}>
                  {questsCompleted}/{dailyQuests.length} quests completed • {4 - questsCompleted} remaining
                </p>
              </div>
            </div>

            {/* Boss Unlock Timer */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#61210F]/30 p-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#61210F] to-[#3FDFD5] flex items-center justify-center shadow-lg">
                  <Crown className="text-white" size={18} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#61210F' }}>Boss Battle</h3>
              </div>
              
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={32} />
                </div>
                <p className="text-sm mb-2 font-semibold" style={{ color: '#61210F' }}>Interview Boss Unlocked!</p>
                <p className="text-xs font-medium" style={{ color: '#61210F' }}>Complete 5 more topics to fight</p>
              </div>

              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-full h-2">
                  <div className="h-full rounded-full" style={{ width: '60%', background: 'linear-gradient(90deg, #61210F, #3FDFD5)' }} />
                </div>
                <p className="text-xs font-semibold" style={{ color: '#61210F' }}>60%</p>
              </div>
            </div>
          </div>

          {/* Skill Tree Navigation - Center Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionCard
                icon={BookOpen}
                title="Skill Tree"
                description="Explore your learning path"
                iconColor="#3FDFD5"
                onClick={() => onNavigate('skillTree')}
              />
              <ActionCard
                icon={Target}
                title="Cozy Room"
                description="Focus in your study space"
                iconColor="#61210F"
                onClick={() => onNavigate('cozyRoom')}
              />
            </div>

            {/* Units Overview */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#61210F]/20 p-6 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#61210F' }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={18} />
                </div>
                Knowledge Dungeons
              </h3>
              
              <div className="space-y-3">
                {syllabus.units?.map((unit: any, idx: number) => {
                  const unitProgress = Math.floor(Math.random() * 100);
                  const isLocked = idx > 0 && unitProgress === 0;
                  
                  return (
                    <div
                      key={unit.id}
                      className={`p-5 rounded-2xl border backdrop-blur-sm transition-all ${
                        isLocked
                          ? 'bg-white/30 border-[#61210F]/20 opacity-60'
                          : 'bg-white/50 border-[#61210F]/20 hover:border-[#3FDFD5]/40 cursor-pointer hover:shadow-lg'
                      }`}
                      onClick={() => !isLocked && onNavigate('skillTree')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {isLocked ? (
                            <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center border border-[#61210F]/20">
                              <Lock className="text-[#61210F]" size={20} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                              <BookOpen className="text-white" size={20} />
                            </div>
                          )}
                          <div>
                            <h4 className="text-base font-semibold" style={{ color: '#61210F' }}>{unit.name || unit.title}</h4>
                            <p className="text-xs font-medium" style={{ color: '#61210F' }}>
                              {unit.topics?.length || 0} topics • {unitProgress}% complete
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: '#3FDFD5' }}>{unitProgress}%</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{ width: `${unitProgress}%`, background: 'linear-gradient(90deg, #61210F, #3FDFD5)' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-[#61210F]/20 p-6 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#61210F' }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                  <TrendingUp className="text-white" size={18} />
                </div>
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm border border-[#3FDFD5]/30 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center shadow-lg">
                    <Trophy className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#61210F' }}>Defeated Binary Trees Boss!</p>
                    <p className="text-xs font-medium" style={{ color: '#61210F' }}>2 hours ago • +150 XP</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm border border-[#61210F]/30 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#61210F] to-[#3FDFD5] flex items-center justify-center shadow-lg">
                    <Zap className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#61210F' }}>Completed Arrays Challenge</p>
                    <p className="text-xs font-medium" style={{ color: '#61210F' }}>Yesterday • +100 XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AppShell>
  );
}
