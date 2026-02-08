'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting and performance
const CozyRoomEnhanced = dynamic(() => import('@/components/study-genie/cozy-room-enhanced'), { ssr: false });
const SkillTreeEnhanced = dynamic(() => import('@/components/study-genie/skill-tree-enhanced'), { ssr: false });
const DashboardEnhanced = dynamic(() => import('@/components/study-genie/dashboard-enhanced'), { ssr: false });
const SyllabusUpload = dynamic(() => import('@/components/study-genie/syllabus-upload'), { ssr: false });
const CombatMode = dynamic(() => import('@/components/study-genie/combat-mode'), { ssr: false });
const ScoreCard = dynamic(() => import('@/components/study-genie/scorecard'), { ssr: false });
const PracticeEditorEnhanced = dynamic(() => import('@/components/study-genie/practice-editor-enhanced'), { ssr: false });
const LandingPage = dynamic(() => import('@/components/study-genie/landing-page'), { ssr: false });
const FlashcardView = dynamic(() => import('@/components/study-genie/flashcard-view'), { ssr: false });

type ViewType = 'landing' | 'dashboard' | 'cozyRoom' | 'skillTree' | 'upload' | 'combat' | 'editor' | 'flashcards';

interface Syllabus {
  curriculum?: string;
  units?: Array<{
    id: string;
    name: string;
    topics: Array<{
      id: string;
      name: string;
      difficulty?: string;
      status?: string;
    }>;
  }>;
}

interface Topic {
  id: string;
  name: string;
  difficulty?: string;
  status?: string;
}

export default function StudyGeniePage() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [combatResults, setCombatResults] = useState<{
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
    timeSpent: number;
    weakAreas: string[];
  }>({ 
    score: 0, 
    questionsAnswered: 0, 
    correctAnswers: 0, 
    timeSpent: 0,
    weakAreas: []
  });

  const handleSyllabusUpload = (data: Syllabus) => {
    setSyllabus(data);
    setIsDemoMode(false);
    setCurrentView('dashboard');
  };

  const handleStartDemo = () => {
    // Demo syllabus with sample data
    const demoSyllabus = {
      curriculum: 'Demo: Data Structures & Algorithms',
      units: [
        {
          id: '1',
          name: 'Arrays & Strings',
          topics: [
            { id: '1-1', name: 'Array Basics', difficulty: 'Easy', status: 'weak' },
            { id: '1-2', name: 'Two Pointer Technique', difficulty: 'Medium', status: 'learning' },
            { id: '1-3', name: 'Sliding Window', difficulty: 'Hard', status: 'boss' }
          ]
        },
        {
          id: '2',
          name: 'Trees & Graphs',
          topics: [
            { id: '2-1', name: 'Binary Trees', difficulty: 'Medium', status: 'mastered' },
            { id: '2-2', name: 'Graph Traversal', difficulty: 'Medium', status: 'learning' },
            { id: '2-3', name: 'Dynamic Programming', difficulty: 'Hard', status: 'locked' }
          ]
        }
      ]
    };
    
    setSyllabus(demoSyllabus);
    setIsDemoMode(true);
    setCurrentView('dashboard');
  };

  const handleCombatComplete = (results: {
    score?: number;
    questionsAnswered?: number;
    correctAnswers?: number;
    timeSpent?: number;
    weakAreas?: string[];
  }) => {
    setCombatResults({
      score: results.score || 0,
      questionsAnswered: results.questionsAnswered || 0,
      correctAnswers: results.correctAnswers || 0,
      timeSpent: results.timeSpent || 0,
      weakAreas: results.weakAreas || []
    });
    setShowScoreCard(true);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewType);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="w-full h-screen bg-[#3FDFD5]/5 overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Navigation - Hide on landing page */}
      {currentView !== 'landing' && (
        <nav className="bg-[#61210F] backdrop-blur-lg border-b border-[#61210F]/20 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl font-bold text-white">
              StudyGenie
            </h1>
            {isDemoMode && (
              <span className="px-3 py-1 bg-[#3FDFD5]/20 border border-[#3FDFD5]/40 rounded-full text-[#3FDFD5] text-xs font-semibold">
                Demo Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-white/80 text-sm">Turn your syllabus into a learning adventure</p>
            {isDemoMode && (
              <button
                onClick={() => {
                  setIsDemoMode(false);
                  setSyllabus(null);
                  setCurrentView('landing');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all"
              >
                Exit Demo
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className={`w-full ${currentView === 'landing' ? 'h-screen' : 'h-[calc(100vh-80px)]'} overflow-hidden`}>
        {currentView === 'landing' && (
          <LandingPage 
            onStart={() => setCurrentView('upload')}
            onDemo={handleStartDemo}
          />
        )}

        {currentView === 'upload' && (
          <SyllabusUpload 
            onUpload={handleSyllabusUpload}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'dashboard' && syllabus && (
          <DashboardEnhanced 
            syllabus={syllabus} 
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cozyRoom' && syllabus && (
          <CozyRoomEnhanced 
            syllabus={syllabus} 
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'skillTree' && syllabus && (
          <SkillTreeEnhanced 
            syllabus={syllabus} 
            onNavigate={handleNavigate}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {currentView === 'combat' && selectedTopic && (
          <CombatMode
            topic={selectedTopic}
            onComplete={handleCombatComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'editor' && selectedTopic && (
          <PracticeEditorEnhanced 
            topic={selectedTopic.name} 
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'flashcards' && selectedTopic && (
          <FlashcardView
            topic={selectedTopic}
            onComplete={() => handleNavigate('skillTree')}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Score Card Modal */}
      {showScoreCard && (
        <ScoreCard
          xpEarned={combatResults.score}
          focusTime={combatResults.timeSpent}
          weakAreas={combatResults.weakAreas}
          interviewReadiness={Math.round((combatResults.correctAnswers / Math.max(combatResults.questionsAnswered, 1)) * 100)}
          sessionDate={new Date()}
          onClose={() => setShowScoreCard(false)}
        />
      )}
    </div>
  );
}
