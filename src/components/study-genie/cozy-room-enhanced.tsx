'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Coffee, Music, Cloud, Flame, ArrowLeft } from 'lucide-react';

interface CozyRoomEnhancedProps {
  syllabus: any;
  onNavigate: (view: string) => void;
}

export default function CozyRoomEnhanced({ syllabus, onNavigate }: CozyRoomEnhancedProps) {
  const [focusLevel, setFocusLevel] = useState(60);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [ambiance, setAmbiance] = useState('rain');
  const [sessionTime, setSessionTime] = useState(0);
  const [lampBrightness, setLampBrightness] = useState(50);
  const [musicTrack, setMusicTrack] = useState('lo-fi-hip-hop');
  const [rainIntensity, setRainIntensity] = useState(50);
  const [petMood, setPetMood] = useState('happy');

  // Simulate session timer and focus level
  useEffect(() => {
    let counter = 0;
    const timer = setInterval(() => {
      counter++;
      setSessionTime(counter);
      setFocusLevel(prev => Math.min(100, prev + 0.5));
      setLampBrightness(prev => Math.min(100, prev + 0.3));
      setRainIntensity(Math.sin(counter / 30) * 25 + 50); // Oscillate rain
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const musicTracks = [
    { id: 'lo-fi-hip-hop', name: 'Lo-Fi Hip Hop', emoji: '🎵' },
    { id: 'ambient', name: 'Ambient', emoji: '🌌' },
    { id: 'jazz', name: 'Jazz Cafe', emoji: '🎷' },
    { id: 'nature', name: 'Nature Sounds', emoji: '🌿' },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950" />

        {/* Animated rain particles */}
        {ambiance === 'rain' && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {Array.from({ length: Math.round(rainIntensity / 5) }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-3 bg-blue-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `fall ${1.5 + Math.random() * 1}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: rainIntensity / 100,
                }}
              />
            ))}
            <style>{`
              @keyframes fall {
                to { transform: translateY(100vh); }
              }
            `}</style>
          </div>
        )}

        {/* Window - Moon and night sky */}
        <div className="absolute top-12 left-8 w-80 h-96 border-8 border-slate-700 rounded-xl bg-gradient-to-b from-blue-900 to-slate-900/50 shadow-2xl">
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* Stars */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                }}
              />
            ))}

            {/* Moon */}
            <div
              className="absolute w-32 h-32 rounded-full bg-yellow-200 shadow-2xl shadow-yellow-300/50"
              style={{
                opacity: lampBrightness / 100,
                filter: `blur(${5 - lampBrightness / 20}px)`,
              }}
            />
            
            <style>{`
              @keyframes twinkle {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        </div>

        {/* Desk with lamp - center-bottom */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full">
          {/* Lamp glow */}
          <div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-64 rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, rgba(253, 224, 71, ${lampBrightness / 200}) 0%, transparent 70%)`,
            }}
          />
          
          {/* Desk silhouette */}
          <div className="relative h-40 flex items-center justify-center">
            <div className="text-6xl">🖥️</div>
          </div>
        </div>

        {/* Bookshelf - Right side */}
        <div className="absolute top-1/2 right-8 w-40 transform -translate-y-1/2">
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">📚 Knowledge</h3>
            <div className="space-y-2">
              {syllabus.units?.slice(0, 4).map((unit: any, idx: number) => (
                <button
                  key={unit.id}
                  onClick={() => onNavigate('skillTree')}
                  className="w-full text-left text-xs text-purple-200 hover:text-purple-100 py-2 px-3 rounded-lg hover:bg-purple-500/30 transition-all border border-purple-500/20 hover:border-purple-500/40"
                >
                  <span className="font-semibold">📖</span> {unit.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coffee Cup - Bottom Right */}
        <div className="absolute bottom-8 right-12">
          <div className="text-6xl animate-bounce">☕</div>
          <p className="text-xs text-purple-300 mt-2 text-center">Keep hydrated!</p>
        </div>

        {/* Pet Companion - Bottom Left */}
        <div className="absolute bottom-8 left-12 text-center">
          <div className="text-7xl mb-2 transition-transform" style={{
            transform: petMood === 'happy' ? 'scaleX(1)' : 'scaleX(-1)',
          }}>
            🐱
          </div>
          <p className="text-xs text-purple-300">
            {petMood === 'happy' ? 'Keep studying! 💪' : 'Meow...'}
          </p>
        </div>
      </div>

      {/* Back Button - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-purple-200 hover:text-white transition-all group backdrop-blur"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Control Panel - Top Right */}
      <div className="absolute top-8 right-8 z-20 space-y-4">
        {/* Session Stats Card */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl w-80">
          <div className="space-y-4">
            {/* Timer */}
            <div className="text-center">
              <p className="text-purple-300 text-xs uppercase tracking-wider mb-2">Session Time</p>
              <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono">
                {formatTime(sessionTime)}
              </p>
            </div>

            {/* Focus Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="text-yellow-400" size={16} />
                  Focus Level
                </p>
                <p className="text-sm font-bold text-yellow-400">{Math.round(focusLevel)}%</p>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-3 overflow-hidden border border-yellow-500/30">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-1000"
                  style={{ width: `${focusLevel}%` }}
                />
              </div>
            </div>

            {/* Lamp Brightness */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">💡 Lamp Brightness</p>
                <p className="text-sm font-bold text-yellow-300">{Math.round(lampBrightness)}%</p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(lampBrightness)}
                onChange={(e) => setLampBrightness(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Music Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  musicEnabled
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-700/50 text-slate-300'
                }`}
              >
                {musicEnabled ? <Music size={16} /> : <VolumeX size={16} />}
                {musicEnabled ? 'Music ON' : 'Music OFF'}
              </button>
            </div>

            {/* Ambiance Selector */}
            <div>
              <p className="text-xs font-semibold text-purple-300 mb-2">🎵 Ambiance</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rain', emoji: '🌧️', label: 'Rain' },
                  { id: 'night', emoji: '🌙', label: 'Night' },
                  { id: 'cafe', emoji: '☕', label: 'Cafe' },
                  { id: 'forest', emoji: '🌲', label: 'Forest' },
                ].map(({ id, emoji, label }) => (
                  <button
                    key={id}
                    onClick={() => setAmbiance(id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      ambiance === id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rain Intensity Slider - Only if rain ambiance */}
            {ambiance === 'rain' && (
              <div>
                <p className="text-xs font-semibold text-purple-300 mb-2">🌧️ Rain Intensity</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(rainIntensity)}
                  onChange={(e) => setRainIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Study Button */}
        <button
          onClick={() => onNavigate('skillTree')}
          className="w-80 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 shadow-2xl border border-green-500/50"
        >
          ✨ Start Learning Quest
        </button>
      </div>
    </div>
  );
}
