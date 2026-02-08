/**
 * Tambo-Generated Quiz Interface Component
 * Renders quiz UI based on Tambo-generated specification
 */

'use client';

import { useEffect, useState } from 'react';
import { generateQuizUI } from '@/services/tambo-ui-generator';
import type { UIComponentSpec } from '@/services/tambo-ui-generator';
import CombatMode from '../study-genie/combat-mode';

interface QuizGeneratedProps {
  topic: any;
  difficulty: string;
  userPerformance?: any;
  onComplete?: (results: any) => void;
  onNavigate?: (view: string) => void;
}

export default function QuizGenerated({
  topic,
  difficulty,
  userPerformance,
  onComplete,
  onNavigate,
}: QuizGeneratedProps) {
  const [uiSpec, setUiSpec] = useState<UIComponentSpec | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateUI() {
      try {
        const spec = await generateQuizUI(topic, difficulty, userPerformance);
        setUiSpec(spec);
      } catch (error) {
        console.error('Failed to generate quiz UI:', error);
        setUiSpec({
          type: 'QuizInterface',
          props: { topic, difficulty },
        });
      } finally {
        setLoading(false);
      }
    }

    if (topic) {
      generateUI();
    }
  }, [topic, difficulty, userPerformance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-purple-400">Generating quiz interface...</div>
      </div>
    );
  }

  if (!uiSpec || !topic) {
    return null;
  }

  // Apply Tambo-generated theme and props
  const theme = uiSpec.props.theme || 'blue';
  const showProgress = uiSpec.props.showProgress !== false;
  const showTimer = uiSpec.props.showTimer !== false;

  return (
    <div className={`quiz-container theme-${theme} relative`}>
      {/* Tambo UI Indicator */}
      <div className="fixed top-20 right-4 z-50 bg-purple-600/90 backdrop-blur border border-purple-400/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-white text-xs">
          <span>🎨</span>
          <span className="font-semibold">Tambo UI</span>
          <span className="text-purple-200">• {theme} theme</span>
        </div>
      </div>

      <CombatMode
        topic={topic}
        onComplete={onComplete}
        onNavigate={onNavigate}
      />
    </div>
  );
}

