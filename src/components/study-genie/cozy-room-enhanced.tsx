'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Music, Edit3, Sprout, Home, 
  Lightbulb, Settings, Maximize2, Pause, RotateCw, Play
} from 'lucide-react';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

interface CozyRoomEnhancedProps {
  syllabus: any;
  onNavigate: (view: string) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export default function CozyRoomEnhanced({ syllabus, onNavigate }: CozyRoomEnhancedProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [task, setTask] = useState('Finalize presentation');
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeRemaining(TIMER_DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  const handleTimerComplete = () => {
    if (mode === 'focus') {
      if (currentSession % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
      setCurrentSession((prev) => prev + 1);
    } else {
      setMode('focus');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(TIMER_DURATIONS[mode]);
  };

  const totalSessions = 4;
  const sessions = Array.from({ length: totalSessions }, (_, i) => i + 1);

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('dashboard'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#61210F' }}>
              Focus Timer
            </h1>
            <p className="text-base" style={{ color: '#6B7280' }}>
              Stay focused and track your study sessions
            </p>
          </div>

          {/* Main Timer Card */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100 mb-6">
            {/* Task Input */}
            <div className="mb-8 text-center">
              {isEditingTask ? (
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onBlur={() => setIsEditingTask(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingTask(false);
                  }}
                  className="text-xl font-medium text-center border-b-2 border-[#3FDFD5] focus:outline-none pb-2"
                  style={{ color: '#61210F' }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => setIsEditingTask(true)}
                  className="text-xl font-medium cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                  style={{ color: '#61210F' }}
                >
                  {task}
                  <Edit3 size={18} style={{ color: '#6B7280' }} />
                </div>
              )}
            </div>

            {/* Mode Buttons */}
            <div className="flex justify-center gap-3 mb-8">
              <button
                onClick={() => setMode('focus')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-[#3FDFD5] to-[#61210F] text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-[#61210F] hover:border-[#3FDFD5]'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => setMode('shortBreak')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  mode === 'shortBreak'
                    ? 'bg-gradient-to-r from-[#3FDFD5] to-[#61210F] text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-[#61210F] hover:border-[#3FDFD5]'
                }`}
              >
                Short Break
              </button>
              <button
                onClick={() => setMode('longBreak')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  mode === 'longBreak'
                    ? 'bg-gradient-to-r from-[#3FDFD5] to-[#61210F] text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-[#61210F] hover:border-[#3FDFD5]'
                }`}
              >
                Long Break
              </button>
            </div>

            {/* Session Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {sessions.map((session) => (
                <div
                  key={session}
                  className={`w-3 h-3 rounded-full ${
                    session <= currentSession
                      ? 'bg-[#3FDFD5]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-8xl font-bold font-mono mb-4" style={{ color: '#61210F' }}>
                {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-4">
              <PrimaryButton onClick={handlePause} className="flex items-center gap-2">
                {isRunning ? (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start
                  </>
                )}
              </PrimaryButton>
              <SecondaryButton onClick={handleReset} className="flex items-center gap-2">
                <RotateCw size={20} />
                Reset
              </SecondaryButton>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#61210F' }}>
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3FDFD520' }}>
                    <Music size={20} style={{ color: '#3FDFD5' }} />
                  </div>
                  <span className="font-medium" style={{ color: '#1F2937' }}>Background Music</span>
                </div>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    musicEnabled
                      ? 'bg-gradient-to-r from-[#3FDFD5] to-[#61210F]'
                      : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      musicEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
