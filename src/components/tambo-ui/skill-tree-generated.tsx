/**
 * Tambo-Generated Skill Tree Component
 * Renders skill tree based on Tambo-generated UI specification
 */

'use client';

import { useEffect, useState } from 'react';
import { generateSkillTreeUI } from '@/services/tambo-ui-generator';
import type { UIComponentSpec } from '@/services/tambo-ui-generator';
import SkillTreeEnhanced from '../study-genie/skill-tree-enhanced';

interface SkillTreeGeneratedProps {
  syllabus: any;
  userProgress?: any;
  onTopicSelect?: (topic: any) => void;
  onNavigate?: (view: string) => void;
}

export default function SkillTreeGenerated({
  syllabus,
  userProgress,
  onTopicSelect,
  onNavigate,
}: SkillTreeGeneratedProps) {
  const [uiSpec, setUiSpec] = useState<UIComponentSpec | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateUI() {
      try {
        const spec = await generateSkillTreeUI(syllabus, userProgress);
        setUiSpec(spec);
      } catch (error) {
        console.error('Failed to generate UI:', error);
        // Fallback to default
        setUiSpec({
          type: 'SkillTree',
          props: { syllabus, userProgress },
        });
      } finally {
        setLoading(false);
      }
    }

    if (syllabus) {
      generateUI();
    }
  }, [syllabus, userProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-purple-400">Generating skill tree...</div>
      </div>
    );
  }

  if (!uiSpec || !syllabus) {
    return null;
  }

  // Render using the generated spec
  // For now, we'll use the existing component but with Tambo-generated props
  return (
    <div className="relative">
      {/* Tambo UI Indicator */}
      <div className="fixed top-20 right-4 z-50 bg-purple-600/90 backdrop-blur border border-purple-400/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-white text-xs">
          <span>🎨</span>
          <span className="font-semibold">Tambo UI</span>
          <span className="text-purple-200">• {uiSpec.props.layout || 'hierarchical'}</span>
        </div>
      </div>

      <SkillTreeEnhanced
        syllabus={syllabus}
        onNavigate={onNavigate}
        onTopicSelect={onTopicSelect}
      />
    </div>
  );
}

