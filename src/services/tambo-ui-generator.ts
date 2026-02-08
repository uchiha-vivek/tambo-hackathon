/**
 * Tambo UI Generator Service
 * Generates UI components dynamically based on learning context
 * 
 * NOTE: This is a programmatic UI generator that creates structured specs.
 * For full Tambo AI-powered UI generation, integrate with Tambo's chat/completion API.
 * Currently uses intelligent fallbacks based on syllabus structure and user data.
 */

import { tamboService } from './tambo-service';

export interface UIComponentSpec {
  type: string;
  props: Record<string, any>;
  children?: UIComponentSpec[];
}

export interface LearningContext {
  topicStructure?: any;
  difficulty?: string;
  userPerformance?: any;
  learningIntent?: string;
  userStats?: any;
}

/**
 * Generate Skill Tree UI using intelligent analysis
 * 
 * This function analyzes the syllabus structure and user progress to generate
 * an optimal UI layout. It considers:
 * - Topic dependencies and prerequisites
 * - User progress and weak areas
 * - Difficulty distribution
 * - Optimal visual hierarchy
 */
export async function generateSkillTreeUI(
  syllabus: any,
  userProgress?: any
): Promise<UIComponentSpec> {
  console.log('🎨 [TAMBO UI] Generating Skill Tree UI...', { 
    syllabus: syllabus?.curriculum || 'Unknown',
    topics: syllabus.units?.flatMap((u: any) => u.topics).length || 0 
  });
  
  const startTime = performance.now();
  
  try {
    // Analyze syllabus structure
    const topics = syllabus.units?.flatMap((unit: any) => unit.topics) || [];
    const totalTopics = topics.length;
    const completedTopics = userProgress?.topics 
      ? Object.values(userProgress.topics).filter((t: any) => t.status === 'mastered' || t.status === 'strong').length
      : 0;
    
    // Determine optimal layout based on structure
    let layout = 'hierarchical';
    if (totalTopics > 20) {
      layout = 'grid';
    } else if (totalTopics < 10) {
      layout = 'linear';
    }

    // Generate topic nodes with intelligent status assignment
    const topicNodes = topics.map((topic: any, index: number) => {
      let status = topic.status || 'locked';
      
      // Intelligent status assignment based on progress
      if (userProgress?.topics?.[topic.id]) {
        status = userProgress.topics[topic.id].status;
      } else if (index === 0) {
        status = 'learning'; // First topic is always available
      } else if (completedTopics > 0 && index <= completedTopics) {
        status = 'mastered';
      }

      return {
        id: topic.id,
        name: topic.name,
        status,
        difficulty: topic.difficulty || 'Medium',
        prerequisites: topic.prerequisites || [],
        xp: topic.xp || 100,
        position: calculateTopicPosition(index, totalTopics, layout),
      };
    });

    // Generate connections based on prerequisites
    const connections = generatePrerequisiteConnections(topicNodes);

    const result = {
      type: 'SkillTree',
      props: {
        topics: topicNodes,
        layout,
        connections,
        showConnections: true,
        showProgress: true,
        completionRate: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
        _generatedBy: 'Tambo UI Generator',
        _generationTime: performance.now() - startTime,
      },
    };

    console.log('✅ [TAMBO UI] Skill Tree generated:', {
      layout,
      topics: topicNodes.length,
      connections: connections.length,
      completionRate: `${result.props.completionRate.toFixed(1)}%`,
      time: `${(performance.now() - startTime).toFixed(2)}ms`
    });

    return result;
  } catch (error) {
    console.error('❌ [TAMBO UI] Skill Tree generation error:', error);
    // Fallback to basic generation
    return generateSkillTreeFromSyllabus(syllabus, userProgress);
  }
}

/**
 * Generate Quiz Interface UI with intelligent theming
 * 
 * Analyzes topic difficulty and user performance to generate
 * an optimal quiz interface configuration.
 */
export async function generateQuizUI(
  topic: any,
  difficulty: string,
  userPerformance?: any
): Promise<UIComponentSpec> {
  console.log('🎨 [TAMBO UI] Generating Quiz UI...', { 
    topic: topic?.name || topic,
    difficulty 
  });
  
  const startTime = performance.now();
  
  try {
    // Analyze user performance to determine UI adjustments
    const avgScore = userPerformance?.averageScore || 0;
    const totalAttempts = userPerformance?.totalAttempts || 0;
    
    // Determine if user needs encouragement or challenge
    const needsEncouragement = avgScore < 60 && totalAttempts > 0;
    const isAdvanced = avgScore > 85 && totalAttempts > 5;

    // Generate difficulty-appropriate theme
    const theme = getDifficultyTheme(difficulty);
    
    // Determine UI features based on performance
    const showHints = needsEncouragement || difficulty === 'hard';
    const showTimer = !needsEncouragement; // Don't pressure struggling users
    const showExplanations = true; // Always helpful

    const result = {
      type: 'QuizInterface',
      props: {
        topic: topic.name || topic,
        difficulty,
        theme,
        showProgress: true,
        showTimer,
        showHints,
        showExplanations,
        userPerformance,
        encouragementMode: needsEncouragement,
        challengeMode: isAdvanced,
        _generatedBy: 'Tambo UI Generator',
        _generationTime: performance.now() - startTime,
      },
    };

    console.log('✅ [TAMBO UI] Quiz UI generated:', {
      theme,
      encouragementMode: needsEncouragement,
      challengeMode: isAdvanced,
      time: `${(performance.now() - startTime).toFixed(2)}ms`
    });

    return result;
  } catch (error) {
    console.error('❌ [TAMBO UI] Quiz UI generation error:', error);
    return generateDefaultQuizUI(topic, difficulty);
  }
}

/**
 * Generate Dashboard Layout with intelligent widget prioritization
 * 
 * Analyzes user statistics and syllabus to create a personalized
 * dashboard layout that adapts to user needs.
 */
export async function generateDashboardUI(
  userStats: any,
  syllabus?: any
): Promise<UIComponentSpec> {
  console.log('🎨 [TAMBO UI] Generating Dashboard UI...', { 
    level: userStats?.level || 1,
    xp: userStats?.xp || 0 
  });
  
  const startTime = performance.now();
  
  try {
    // Analyze user state
    const level = userStats?.level || 1;
    const xp = userStats?.xp || 0;
    const focus = userStats?.focus || 0;
    const streak = userStats?.streak || 0;
    const weakAreas = userStats?.weakAreas || [];

    // Determine layout based on user level and progress
    const layout = determineDashboardLayout(userStats);
    
    // Generate prioritized widgets
    const widgets = generateDashboardWidgets(userStats, syllabus);
    
    // Generate personalized recommendations
    const recommendations = generateRecommendations(userStats, syllabus);

    // Determine visual theme based on user progress
    const theme = level < 3 ? 'beginner' : level < 7 ? 'intermediate' : 'advanced';

    const result = {
      type: 'Dashboard',
      props: {
        layout,
        theme,
        widgets,
        recommendations,
        userLevel: level,
        showMotivation: streak < 3 || focus < 50,
        highlightWeakAreas: weakAreas.length > 0,
        _generatedBy: 'Tambo UI Generator',
        _generationTime: performance.now() - startTime,
      },
    };

    console.log('✅ [TAMBO UI] Dashboard generated:', {
      layout,
      theme,
      widgets: widgets.length,
      recommendations: recommendations.length,
      time: `${(performance.now() - startTime).toFixed(2)}ms`
    });

    return result;
  } catch (error) {
    console.error('❌ [TAMBO UI] Dashboard generation error:', error);
    return generateDefaultDashboardUI(userStats);
  }
}

// Helper functions

function generateSkillTreeFromSyllabus(syllabus: any, progress?: any): UIComponentSpec {
  const topics = syllabus.units?.flatMap((unit: any) => unit.topics) || [];
  
  return {
    type: 'SkillTree',
    props: {
      topics: topics.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
        status: progress?.topics?.[topic.id]?.status || topic.status || 'locked',
        difficulty: topic.difficulty,
        prerequisites: topic.prerequisites || [],
      })),
      layout: 'hierarchical',
      showConnections: true,
      showProgress: true,
    },
  };
}

function calculateTopicPosition(index: number, total: number, layout: string): { x: number; y: number } {
  if (layout === 'grid') {
    const cols = Math.ceil(Math.sqrt(total));
    return {
      x: (index % cols) * 200,
      y: Math.floor(index / cols) * 150,
    };
  } else if (layout === 'linear') {
    return {
      x: 0,
      y: index * 100,
    };
  } else {
    // Hierarchical - tree structure
    const depth = Math.floor(Math.log2(index + 1));
    const width = Math.pow(2, depth);
    const positionInLevel = index - (Math.pow(2, depth) - 1);
    return {
      x: (positionInLevel - width / 2) * 180,
      y: depth * 120,
    };
  }
}

function generatePrerequisiteConnections(topics: any[]): any[] {
  const connections: any[] = [];
  
  topics.forEach((topic, index) => {
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      topic.prerequisites.forEach((prereqId: string) => {
        const prereqTopic = topics.find(t => t.id === prereqId);
        if (prereqTopic) {
          connections.push({
            from: prereqId,
            to: topic.id,
            type: 'prerequisite',
          });
        }
      });
    } else if (index > 0) {
      // Auto-connect to previous topic if no explicit prerequisites
      connections.push({
        from: topics[index - 1].id,
        to: topic.id,
        type: 'sequential',
      });
    }
  });
  
  return connections;
}

function getDifficultyTheme(difficulty: string): string {
  const themes: Record<string, string> = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red',
  };
  return themes[difficulty.toLowerCase()] || 'blue';
}

function generateDefaultQuizUI(topic: any, difficulty: string): UIComponentSpec {
  return {
    type: 'QuizInterface',
    props: {
      topic: topic.name,
      difficulty,
      theme: getDifficultyTheme(difficulty),
      showProgress: true,
      showTimer: true,
    },
  };
}

function determineDashboardLayout(userStats: any): string {
  if (userStats.level < 3) return 'beginner';
  if (userStats.level < 7) return 'intermediate';
  return 'advanced';
}

function generateDashboardWidgets(userStats: any, syllabus?: any): any[] {
  const widgets = [
    { type: 'XPProgress', priority: 1 },
    { type: 'DailyQuests', priority: 2 },
    { type: 'FocusMeter', priority: 3 },
  ];

  if (userStats.weakAreas && userStats.weakAreas.length > 0) {
    widgets.push({ type: 'WeakAreas', priority: 4 });
  }

  if (syllabus) {
    widgets.push({ type: 'SkillProgress', priority: 5 });
  }

  return widgets.sort((a, b) => a.priority - b.priority);
}

function generateRecommendations(userStats: any, syllabus?: any): any[] {
  const recommendations = [];

  if (userStats.streak < 3) {
    recommendations.push({
      type: 'maintain_streak',
      message: 'Keep your streak going!',
      priority: 'high',
    });
  }

  if (userStats.focus < 50) {
    recommendations.push({
      type: 'improve_focus',
      message: 'Try the Cozy Room to improve focus',
      priority: 'medium',
    });
  }

  if (userStats.weakAreas && userStats.weakAreas.length > 0) {
    recommendations.push({
      type: 'review_weak_areas',
      message: `Review: ${userStats.weakAreas.slice(0, 2).join(', ')}`,
      priority: 'high',
    });
  }

  return recommendations;
}

function generateDefaultDashboardUI(userStats: any): UIComponentSpec {
  return {
    type: 'Dashboard',
    props: {
      layout: 'default',
      widgets: generateDashboardWidgets(userStats),
      recommendations: [],
    },
  };
}

