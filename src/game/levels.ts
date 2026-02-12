/**
 * Infinite Level Configuration System
 * Keeps board sizes readable (12/16/20/24 cards) and scales difficulty via mechanics.
 */

import { LevelConfig } from '@/types';

const BOARD_SEQUENCE: Array<12 | 16 | 20 | 24> = [12, 16, 20, 24];

const BOARD_LAYOUTS: Record<12 | 16 | 20 | 24, { columns: number; rows: number }> = {
  12: { columns: 4, rows: 3 },
  16: { columns: 4, rows: 4 },
  20: { columns: 5, rows: 4 },
  24: { columns: 6, rows: 4 },
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const createSeededRandom = (seed: number): (() => number) => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const pickBoardSize = (level: number): 12 | 16 | 20 | 24 => {
  // Every block shifts difficulty upward while still procedurally varying board size.
  const block = Math.floor((level - 1) / 8);
  const baseIndex = clamp(block, 0, BOARD_SEQUENCE.length - 1);
  const random = createSeededRandom(level * 97);
  const jitter = random() > 0.7 ? -1 : random() < 0.2 ? 1 : 0;
  const index = clamp(baseIndex + jitter, 0, BOARD_SEQUENCE.length - 1);
  return BOARD_SEQUENCE[index];
};

const getDifficultyTier = (level: number): LevelConfig['difficulty'] => {
  if (level <= 8) return 'easy';
  if (level <= 20) return 'medium';
  if (level <= 45) return 'hard';
  return 'expert';
};

export const getLevelConfig = (level: number): LevelConfig => {
  const safeLevel = Math.max(1, level);
  const boardSize = pickBoardSize(safeLevel);
  const pairCount = boardSize / 2;
  const layout = BOARD_LAYOUTS[boardSize];
  const random = createSeededRandom(safeLevel * 193);

  const previewBase = 6200 - safeLevel * 120;
  const previewDuration = Math.round(clamp(previewBase + (random() - 0.5) * 400, 1400, 6200));

  const mismatchRevealDuration = Math.round(clamp(900 - safeLevel * 12, 280, 900));

  const hasTimeLimit = safeLevel >= 6;
  const timeLimit = hasTimeLimit
    ? Math.round(clamp(70 + pairCount * 7 - safeLevel * 0.8 + (random() - 0.5) * 8, 20, 210))
    : null;

  const mistakeLimit = safeLevel >= 10 ? Math.max(2, Math.round(8 - safeLevel * 0.06)) : null;

  const shuffleIntervalMs = safeLevel >= 18
    ? Math.round(clamp(17000 - safeLevel * 150, 5000, 17000))
    : null;

  const movementEnabled = safeLevel >= 24;
  const visualSimilarity = clamp((safeLevel - 8) / 160, 0, 0.28);
  const phases = safeLevel >= 30 && safeLevel % 7 === 0 ? 2 : 1;

  return {
    level: safeLevel,
    boardSize,
    pairCount,
    totalCards: boardSize,
    previewDuration,
    timeLimit,
    mismatchRevealDuration,
    mistakeLimit,
    shuffleIntervalMs,
    movementEnabled,
    visualSimilarity,
    phases,
    gridColumns: layout.columns,
    gridRows: layout.rows,
    hintCount: safeLevel <= 5 ? 2 : 0,
    difficulty: getDifficultyTier(safeLevel),
  };
};

export const getMaxLevel = (): number => Number.MAX_SAFE_INTEGER;

export const isValidLevel = (level: number): boolean => level >= 1;

export const getNextLevel = (currentLevel: number): number => currentLevel + 1;

export const calculateGridDimensions = (
  cardCount: number
): { columns: number; rows: number } => {
  const boardSize = BOARD_SEQUENCE.find((size) => size === cardCount) ?? 24;
  return BOARD_LAYOUTS[boardSize];
};

export const getDifficultyColor = (difficulty: LevelConfig['difficulty']): string => {
  const colors = {
    easy: '#53d769',
    medium: '#ffb340',
    hard: '#ff6b5b',
    expert: '#ff4de1',
  };
  return colors[difficulty];
};

export const getDifficultyLabel = (difficulty: LevelConfig['difficulty']): string => {
  const labels = {
    easy: 'EASY',
    medium: 'MEDIUM',
    hard: 'HARD',
    expert: 'EXPERT',
  };
  return labels[difficulty];
};

