/**
 * Level Configuration System
 * Defines 8 progressive difficulty levels for the memory flip game
 */

import { LevelConfig } from '@/types';

/**
 * Level configurations from 1-8
 * Progressive difficulty through card count, preview time, and grid complexity
 */
export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    pairCount: 4,
    totalCards: 8,
    previewDuration: 3000,
    timeLimit: null,
    gridColumns: 4,
    gridRows: 2,
    hintCount: 3,
    difficulty: 'easy',
  },
  {
    level: 2,
    pairCount: 6,
    totalCards: 12,
    previewDuration: 3500,
    timeLimit: null,
    gridColumns: 4,
    gridRows: 3,
    hintCount: 3,
    difficulty: 'easy',
  },
  {
    level: 3,
    pairCount: 8,
    totalCards: 16,
    previewDuration: 4000,
    timeLimit: null,
    gridColumns: 4,
    gridRows: 4,
    hintCount: 2,
    difficulty: 'medium',
  },
  {
    level: 4,
    pairCount: 10,
    totalCards: 20,
    previewDuration: 4500,
    timeLimit: 120,
    gridColumns: 5,
    gridRows: 4,
    hintCount: 2,
    difficulty: 'medium',
  },
  {
    level: 5,
    pairCount: 12,
    totalCards: 24,
    previewDuration: 5000,
    timeLimit: 150,
    gridColumns: 6,
    gridRows: 4,
    hintCount: 2,
    difficulty: 'medium',
  },
  {
    level: 6,
    pairCount: 15,
    totalCards: 30,
    previewDuration: 5500,
    timeLimit: 180,
    gridColumns: 6,
    gridRows: 5,
    hintCount: 1,
    difficulty: 'hard',
  },
  {
    level: 7,
    pairCount: 18,
    totalCards: 36,
    previewDuration: 6000,
    timeLimit: 210,
    gridColumns: 6,
    gridRows: 6,
    hintCount: 1,
    difficulty: 'hard',
  },
  {
    level: 8,
    pairCount: 24,
    totalCards: 48,
    previewDuration: 7000,
    timeLimit: 240,
    gridColumns: 6,
    gridRows: 8,
    hintCount: 0,
    difficulty: 'expert',
  },
];

/**
 * Get level configuration by level number
 */
export const getLevelConfig = (level: number): LevelConfig => {
  const config = LEVELS.find(l => l.level === level);
  if (!config) {
    throw new Error(`Invalid level: ${level}`);
  }
  return config;
};

/**
 * Get the maximum level available
 */
export const getMaxLevel = (): number => LEVELS.length;

/**
 * Check if a level exists
 */
export const isValidLevel = (level: number): boolean => {
  return level >= 1 && level <= LEVELS.length;
};

/**
 * Get next level number (returns null if at max level)
 */
export const getNextLevel = (currentLevel: number): number | null => {
  const next = currentLevel + 1;
  return isValidLevel(next) ? next : null;
};

/**
 * Calculate grid dimensions based on card count
 * Optimizes for tablet aspect ratio (4:3 or 16:9)
 */
export const calculateGridDimensions = (
  cardCount: number,
  maxColumns: number = 6
): { columns: number; rows: number } => {
  // Find optimal column/row ratio close to 4:3 for tablets
  let bestColumns = 4;
  let bestRows = Math.ceil(cardCount / 4);
  let bestRatio = Infinity;

  for (let cols = 2; cols <= maxColumns; cols++) {
    const rows = Math.ceil(cardCount / cols);
    const ratio = Math.abs(cols / rows - 4 / 3);
    
    // Prefer layouts where all cells are filled
    const isComplete = cols * rows === cardCount;
    const score = ratio + (isComplete ? 0 : 0.5);
    
    if (score < bestRatio) {
      bestRatio = score;
      bestColumns = cols;
      bestRows = rows;
    }
  }

  return { columns: bestColumns, rows: bestRows };
};

/**
 * Get difficulty color for UI theming
 */
export const getDifficultyColor = (difficulty: LevelConfig['difficulty']): string => {
  const colors = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
    expert: '#9C27B0',
  };
  return colors[difficulty];
};

/**
 * Get difficulty label
 */
export const getDifficultyLabel = (difficulty: LevelConfig['difficulty']): string => {
  const labels = {
    easy: 'EASY',
    medium: 'MEDIUM',
    hard: 'HARD',
    expert: 'EXPERT',
  };
  return labels[difficulty];
};
