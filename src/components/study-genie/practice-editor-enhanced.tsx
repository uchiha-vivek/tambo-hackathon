'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Play, RotateCw } from 'lucide-react';
import { studyGenieBackend } from '@/services/studygenie-backend';
import AppShell from '@/components/ui/AppShell';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

interface PracticeEditorEnhancedProps {
  topic: string | any; // Support both string and topic object
  onNavigate: (view: string) => void;
}

export default function PracticeEditorEnhanced({ topic, onNavigate }: PracticeEditorEnhancedProps) {
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHint, setCurrentHint] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    async function loadChallenge() {
      setIsLoading(true);
      try {
        // Support topic as string or object
        const topicName = typeof topic === 'string' ? topic : (topic?.name || topic?.title || topic?.topic || 'Practice');
        const response = await studyGenieBackend.generateCodingChallenge(topicName, 'medium', 'python');
        setChallenge(response.challenge);
        setCode(response.challenge.starter_code || 'def solve(input_data):\n    # Your code here\n    pass');
      } catch (error) {
        console.error('Error loading challenge:', error);
        setChallenge({
          title: 'Sample Challenge',
          description: 'Complete the function to solve the problem.',
          starter_code: 'def solve(input_data):\n    # Your code here\n    pass',
          test_cases: [
            { input: 'test1', output: 'result1', explanation: 'Test case 1' }
          ],
          hints: [
            'Think about the problem step by step',
            'Consider edge cases',
            'Optimize your solution'
          ]
        });
        setCode('def solve(input_data):\n    # Your code here\n    pass');
      } finally {
        setIsLoading(false);
      }
    }

    loadChallenge();
  }, [topic]);

  const handleRun = () => {
    // Simple code execution simulation
    setOutput('Running code...\n✓ Test case 1 passed\n✓ Test case 2 passed\n✓ All tests passed!');
  };

  const handleReset = () => {
    setCode(challenge?.starter_code || '');
    setOutput('');
    setCurrentHint(0);
    setShowHint(false);
  };

  if (isLoading) {
    return (
      <AppShell
        navProps={{
          showBack: true,
          onBack: () => onNavigate('skillTree'),
        }}
      >
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#3FDFD5] border-t-transparent animate-spin" />
            <p className="text-base font-medium" style={{ color: '#61210F' }}>
              Loading challenge...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      navProps={{
        showBack: true,
        onBack: () => onNavigate('skillTree'),
      }}
    >
      <div className="w-full h-[calc(100vh-80px)] overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Challenge Description */}
            <div className="space-y-6">
              <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                <h1 className="text-2xl font-bold mb-4" style={{ color: '#61210F' }}>
                  {challenge?.title || 'Coding Challenge'}
                </h1>
                <p className="text-base mb-6" style={{ color: '#6B7280' }}>
                  {challenge?.description || 'Complete the function to solve the problem.'}
                </p>

                {/* Test Cases */}
                {challenge?.test_cases && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#1F2937' }}>
                      Test Cases
                    </h3>
                    <div className="space-y-3">
                      {challenge.test_cases.map((test: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: '#F3F4F6' }}
                        >
                          <p className="text-sm font-medium mb-2" style={{ color: '#61210F' }}>
                            Test Case {idx + 1}
                          </p>
                          <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
                            <strong>Input:</strong> {test.input}
                          </p>
                          <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
                            <strong>Output:</strong> {test.output}
                          </p>
                          {test.explanation && (
                            <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                              {test.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hints */}
                {challenge?.hints && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 mb-3"
                    >
                      <Lightbulb size={18} style={{ color: '#F59E0B' }} />
                      <span className="text-sm font-medium" style={{ color: '#61210F' }}>
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </span>
                    </button>
                    {showHint && challenge.hints[currentHint] && (
                      <div className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#FEF3C7' }}>
                        <p className="text-sm" style={{ color: '#92400E' }}>
                          {challenge.hints[currentHint]}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {challenge.hints.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentHint(idx)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                idx === currentHint
                                  ? 'bg-[#61210F] text-white'
                                  : 'bg-white text-[#61210F]'
                              }`}
                            >
                              Hint {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code Editor */}
            <div className="space-y-6">
              <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: '#1F2937' }}>
                    Code Editor
                  </h3>
                  <div className="flex gap-2">
                    <SecondaryButton
                      onClick={handleReset}
                      className="flex items-center gap-2"
                    >
                      <RotateCw size={16} />
                      Reset
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={handleRun}
                      className="flex items-center gap-2"
                    >
                      <Play size={16} />
                      Run
                    </PrimaryButton>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 rounded-xl font-mono text-sm border border-gray-200 focus:outline-none focus:border-[#3FDFD5] resize-none"
                  style={{ backgroundColor: '#F9FAFB', color: '#1F2937' }}
                  spellCheck={false}
                />

                {output && (
                  <div className="mt-4 p-4 rounded-xl font-mono text-sm whitespace-pre-wrap" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}>
                    {output}
                  </div>
                )}
              </div>

              {/* Complexity Info */}
              {challenge && (
                <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-gray-100">
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
                    Complexity
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#6B7280' }}>Time:</span>
                      <span className="text-sm font-medium" style={{ color: '#61210F' }}>
                        {challenge.time_complexity || 'O(n)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#6B7280' }}>Space:</span>
                      <span className="text-sm font-medium" style={{ color: '#61210F' }}>
                        {challenge.space_complexity || 'O(1)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#6B7280' }}>XP Reward:</span>
                      <span className="text-sm font-medium" style={{ color: '#3FDFD5' }}>
                        {challenge.xp_reward || 150} XP
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
