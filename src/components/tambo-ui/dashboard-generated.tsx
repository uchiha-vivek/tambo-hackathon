/**
 * Tambo-Generated Dashboard Component
 * Renders dashboard layout based on Tambo-generated specification
 */

'use client';

import { useEffect, useState } from 'react';
import { generateDashboardUI } from '@/services/tambo-ui-generator';
import type { UIComponentSpec } from '@/services/tambo-ui-generator';
import DashboardEnhanced from '../study-genie/dashboard-enhanced';

interface DashboardGeneratedProps {
  userStats: any;
  syllabus?: any;
  onNavigate?: (view: string) => void;
}

export default function DashboardGenerated({
  userStats,
  syllabus,
  onNavigate,
}: DashboardGeneratedProps) {
  const [uiSpec, setUiSpec] = useState<UIComponentSpec | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateUI() {
      try {
        const spec = await generateDashboardUI(userStats, syllabus);
        setUiSpec(spec);
      } catch (error) {
        console.error('Failed to generate dashboard UI:', error);
        setUiSpec({
          type: 'Dashboard',
          props: { layout: 'default', widgets: [], recommendations: [] },
        });
      } finally {
        setLoading(false);
      }
    }

    if (userStats) {
      generateUI();
    }
  }, [userStats, syllabus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-purple-400">Generating dashboard...</div>
      </div>
    );
  }

  if (!uiSpec) {
    return null;
  }

  // Render dashboard with Tambo-generated layout and widgets
  const layout = uiSpec.props.layout || 'default';
  const widgets = uiSpec.props.widgets || [];
  const recommendations = uiSpec.props.recommendations || [];

  return (
    <div className={`dashboard-container layout-${layout}`}>
      {/* Tambo UI Indicator */}
      <div className="fixed top-20 right-4 z-50 bg-purple-600/90 backdrop-blur border border-purple-400/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-white text-xs">
          <span>🎨</span>
          <span className="font-semibold">Tambo UI</span>
          <span className="text-purple-200">• {layout}</span>
        </div>
      </div>

      <DashboardEnhanced syllabus={syllabus} onNavigate={onNavigate} />
      
      {/* Render Tambo-generated recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-4 space-y-2 max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400 text-sm font-semibold">🎯 Tambo Recommendations</span>
          </div>
          {recommendations.map((rec: any, idx: number) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                rec.priority === 'high'
                  ? 'bg-red-500/10 border-red-500/50 text-red-400'
                  : 'bg-blue-500/10 border-blue-500/50 text-blue-400'
              }`}
            >
              {rec.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

