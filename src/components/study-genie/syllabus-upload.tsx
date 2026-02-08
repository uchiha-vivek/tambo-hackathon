'use client';

import { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';

interface SyllabusUploadProps {
  onUpload: (data: any) => void;
}

export default function SyllabusUpload({ onUpload }: SyllabusUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'checking' | 'ready' | 'cold'>('unknown');
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('/api/health-check');
      if (response.ok) {
        setBackendStatus('ready');
        return true;
      } else {
        setBackendStatus('cold');
        return false;
      }
    } catch (error) {
      setBackendStatus('cold');
      return false;
    }
  };

  const loadDemoData = () => {
    // Mock syllabus data for demo purposes
    const demoSyllabus = {
      title: 'Data Structures & Algorithms',
      curriculum: 'Data Structures & Algorithms (Demo)',
      course_id: 'DEMO-CS-101',
      units: [
        {
          id: 'unit-1',
          title: 'Arrays & Strings',
          topics: [
            {
              id: 'topic-1-1',
              title: 'Array Basics',
              difficulty: 'Easy' as const,
              xp: 100,
              completed: false,
              timeToComplete: '2 hours',
              skills: ['Arrays', 'Indexing', 'Iteration']
            },
            {
              id: 'topic-1-2',
              title: 'String Manipulation',
              difficulty: 'Medium' as const,
              xp: 150,
              completed: false,
              timeToComplete: '3 hours',
              skills: ['Strings', 'Pattern Matching']
            }
          ]
        },
        {
          id: 'unit-2',
          title: 'Linked Lists',
          topics: [
            {
              id: 'topic-2-1',
              title: 'Singly Linked Lists',
              difficulty: 'Medium' as const,
              xp: 150,
              completed: false,
              timeToComplete: '4 hours',
              skills: ['Pointers', 'Node Traversal']
            },
            {
              id: 'topic-2-2',
              title: 'Doubly Linked Lists',
              difficulty: 'Hard' as const,
              xp: 200,
              completed: false,
              timeToComplete: '4 hours',
              skills: ['Two-way Pointers', 'Complex Operations']
            }
          ]
        }
      ],
      totalXP: 1200,
      totalTopics: 8,
      fileName: 'demo-syllabus.pdf',
      _aiData: {
        quiz: [],
        interviewQA: [],
        metadata: { demo: true }
      }
    };

    onUpload(demoSyllabus);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setUploadProgress('Checking backend status...');

    try {
      // First, check if backend is ready
      const isReady = await checkBackendHealth();
      
      if (!isReady) {
        setUploadProgress('Backend is cold-starting... This may take 30-60 seconds on first request.');
        // Wait 5 seconds and check again
        await new Promise(resolve => setTimeout(resolve, 5000));
        const retryReady = await checkBackendHealth();
        
        if (!retryReady) {
          setIsLoading(false);
          alert('⚠️ Backend is waking up (Render cold start).\n\nPlease wait 30 seconds and try uploading again.\n\nThe AI backend needs time to start on first request.');
          return;
        }
      }

      setUploadProgress('Backend ready! Processing your PDF...');
      
      // Use real StudyGenie AI Backend to process PDF
      const response = await studyGenieBackend.uploadPDF(file, 15, 12);
      
      // Log response for debugging
      console.log('Backend response:', response);
      
      // Validate response structure
      if (!response || !response.skill_map) {
        throw new Error('Invalid response from backend: missing skill_map data');
      }
      
      // Transform backend response to match our app's format
      const transformed = studyGenieBackend.transformSkillMapToUnits(response.skill_map);
      
      const syllabus = {
        title: transformed.curriculum,
        curriculum: transformed.curriculum,
        course_id: 'GENIE-' + Date.now(),
        units: transformed.units,
        totalXP: transformed.totalTopics * 150,
        totalTopics: transformed.totalTopics,
        fileName: file.name,
        // Store additional AI-generated data for later use
        _aiData: {
          quiz: response.quiz,
          interviewQA: response.interview_qa,
          metadata: response.metadata
        }
      };

      setIsLoading(false);
      onUpload(syllabus);
    } catch (error) {
      console.error('Failed to parse syllabus:', error);
      setIsLoading(false);
      setUploadProgress('');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Enhanced error handling
      if (errorMessage.includes('Invalid response from backend') || errorMessage.includes('Invalid skill map data')) {
        alert(
          '⚠️ Backend returned invalid data\n\n' +
          'The AI backend processed the PDF but returned an unexpected format.\n\n' +
          'This could mean:\n' +
          '1. The PDF content was too complex or unclear for the AI to analyze\n' +
          '2. The PDF might not contain extractable text (it might be scanned images)\n' +
          '3. The backend service encountered an error during processing\n\n' +
          'Please try:\n' +
          '• A different PDF with clear, text-based content\n' +
          '• Or use the demo mode to explore the app with sample data'
        );
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('502') || errorMessage.includes('504')) {
        alert(
          '⚠️ Backend Processing Timeout\n\n' +
          'The AI backend (Render free tier) has a 30-second timeout limit.\n\n' +
          'Your PDF might be too large or complex for the free tier to process.\n\n' +
          'Solutions:\n' +
          '1. Try a smaller PDF (5-10 pages)\n' +
          '2. Use a simpler syllabus document\n' +
          '3. The backend may need to be upgraded to a paid Render plan for longer processing\n\n' +
          'For now, you can explore the demo with sample data!'
        );
      } else {
        alert(`Failed to parse syllabus: ${errorMessage}\n\nPlease ensure it's a valid PDF with text content.`);
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Welcome to StudyGenie
          </h2>
          <p className="text-xl text-purple-200 mb-2">
            Transform your syllabus into an epic RPG adventure
          </p>
          <p className="text-purple-300 mb-4">
            Upload your course material and let's generate your skill map!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm">⚡ Powered by</span>
            <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Gemini 2.0 Flash</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-dashed border-purple-500/40 hover:border-purple-500/60 transition-all p-12">
          <label className="flex flex-col items-center justify-center gap-6 cursor-pointer">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20">
                  <Loader className="w-20 h-20 text-purple-400 animate-spin" />
                </div>
                <p className="text-purple-300 font-semibold text-lg">
                  {uploadProgress || '🤖 AI is analyzing your syllabus...'}
                </p>
                <p className="text-sm text-purple-400">{fileName}</p>
                <div className="mt-4 space-y-1 text-xs text-purple-300">
                  <p>✓ Extracting topics from PDF</p>
                  <p>✓ Generating skill map with AI</p>
                  <p>✓ Creating quiz questions</p>
                  <p>✓ Preparing interview Q&A</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 bg-purple-500/10 rounded-xl">
                  <Upload className="w-16 h-16 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-2">
                    Drop your syllabus here
                  </p>
                  <p className="text-purple-300">
                    or click to select (PDF, TXT, MD)
                  </p>
                  
                  {/* Backend Status Indicator */}
                  {backendStatus !== 'unknown' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                         style={{
                           backgroundColor: backendStatus === 'ready' ? 'rgba(34, 197, 94, 0.1)' : 
                                          backendStatus === 'cold' ? 'rgba(251, 146, 60, 0.1)' : 
                                          'rgba(168, 85, 247, 0.1)',
                           border: `1px solid ${backendStatus === 'ready' ? 'rgba(34, 197, 94, 0.3)' : 
                                                backendStatus === 'cold' ? 'rgba(251, 146, 60, 0.3)' : 
                                                'rgba(168, 85, 247, 0.3)'}`
                         }}>
                      {backendStatus === 'ready' && <span className="text-green-400">✓ Backend Ready</span>}
                      {backendStatus === 'cold' && <span className="text-orange-400">⚠️ Backend Cold</span>}
                      {backendStatus === 'checking' && <span className="text-purple-400">🔄 Checking...</span>}
                    </div>
                  )}
                </div>
                <div className="text-sm text-purple-400 text-center">
                  <p>🎯 We'll extract units, topics, and difficulty levels</p>
                  <p>⚡ Then generate your personalized skill tree</p>
                </div>
              </>
            )}
          </label>
        </div>

        {/* Warm Up Button */}
        {!isLoading && backendStatus !== 'ready' && (
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={checkBackendHealth}
              disabled={backendStatus === 'checking'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {backendStatus === 'checking' ? (
                <>🔄 Checking Backend...</>
              ) : (
                <>🚀 Warm Up Backend (First Time?)</>
              )}
            </button>
            <div>
              <button
                onClick={loadDemoData}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🎮 Try Demo (No Backend Required)
              </button>
            </div>
            <p className="text-sm text-purple-300">
              Backend timeout? Try the demo to explore the app!
            </p>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-2xl mb-2">📚</p>
            <p className="text-sm text-purple-200">
              <strong>Skill Tree</strong> with prerequisites
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-2xl mb-2">⚔️</p>
            <p className="text-sm text-purple-200">
              <strong>Combat Mode</strong> quizzes
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-2xl mb-2">🎮</p>
            <p className="text-sm text-purple-200">
              <strong>Cozy Room</strong> aesthetics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
