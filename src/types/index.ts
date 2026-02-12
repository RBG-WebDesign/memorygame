/**
 * Core Type Definitions for Samsung Memory Flip Game
 * Production-grade TypeScript interfaces for type safety
 */

// ============================================================================
// CARD TYPES
// ============================================================================

export interface Card {
  id: string;
  pairId: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  isLocked: boolean;
}

export interface CardPair {
  id: string;
  emoji: string;
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export type GameStatus = 
  | 'idle' 
  | 'preview' 
  | 'playing' 
  | 'resolving' 
  | 'levelComplete' 
  | 'levelFailed'
  | 'gameComplete' 
  | 'paused';

export type ScreenType = 
  | 'start' 
  | 'game' 
  | 'results' 
  | 'leaderboard' 
  | 'instructions';

export interface GameState {
  // Current game session
  currentLevel: number;
  cards: Card[];
  flippedCards: string[];
  matchedCards: string[];
  
  // Scoring
  score: number;
  comboMultiplier: number;
  consecutiveMatches: number;
  moveCount: number;
  matchCount: number;
  mismatchCount: number;
  remainingMistakes: number | null;
  
  // Timing
  startTime: number | null;
  elapsedTime: number;
  previewTimeRemaining: number;
  shuffleTimeRemaining: number | null;
  
  // Game status
  gameStatus: GameStatus;
  currentScreen: ScreenType;
  isInteractionLocked: boolean;
  failedReason: 'time' | 'mistakes' | null;
  
  // Level progression
  completedLevels: number[];
  currentPhase: number;
  totalPhases: number;
  
  // Session stats
  sessionStats: SessionStats;
}

export interface SessionStats {
  totalMatches: number;
  totalMismatches: number;
  totalMoves: number;
  bestCombo: number;
  totalTime: number;
}

// ============================================================================
// LEVEL TYPES
// ============================================================================

export interface LevelConfig {
  level: number;
  boardSize: 12 | 16 | 20 | 24;
  pairCount: number;
  totalCards: number;
  previewDuration: number; // milliseconds
  timeLimit: number | null; // null = no limit
  mismatchRevealDuration: number; // milliseconds
  mistakeLimit: number | null;
  shuffleIntervalMs: number | null;
  movementEnabled: boolean;
  visualSimilarity: number; // 0..1, used for art filtering
  phases: number;
  gridColumns: number;
  gridRows: number;
  hintCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  levelReached: number;
  accuracy: number;
  completionTime: number;
  date: number; // timestamp
  moves: number;
  bestCombo: number;
}

export interface LeaderboardFilters {
  sortBy: 'score' | 'date' | 'levelReached' | 'time';
  order: 'asc' | 'desc';
  limit: number;
}

// ============================================================================
// SCORING TYPES
// ============================================================================

export interface ScoreCalculation {
  baseScore: number;
  comboBonus: number;
  timeBonus: number;
  accuracyBonus: number;
  efficiencyBonus: number;
  totalScore: number;
}

export interface ComboState {
  multiplier: number;
  consecutiveMatches: number;
  maxCombo: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface UIState {
  currentScreen: ScreenType;
  modalOpen: boolean;
  modalType: 'none' | 'pause' | 'confirm' | 'error';
  toastMessage: string | null;
  isLoading: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export interface AnimationConfig {
  flipDuration: number;
  matchGlowDuration: number;
  mismatchShakeDuration: number;
  transitionDuration: number;
  easeOut: string;
  easeInOut: string;
}

export type CardAnimationState = 
  | 'idle' 
  | 'flipping' 
  | 'flipped' 
  | 'matching' 
  | 'matched' 
  | 'mismatching' 
  | 'hidden';

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface StorageKeys {
  LEADERBOARD: 'samsung_memory_leaderboard';
  GAME_SETTINGS: 'samsung_memory_settings';
  GAME_SESSION: 'samsung_memory_session';
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
}

// ============================================================================
// TOUCH EVENT TYPES
// ============================================================================

export interface TouchPosition {
  x: number;
  y: number;
}

export interface GestureState {
  startX: number;
  startY: number;
  startTime: number;
  isDragging: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONSTANTS = {
  // Scoring
  BASE_MATCH_SCORE: 100,
  COMBO_INCREMENT: 0.1,
  MAX_COMBO_MULTIPLIER: 3,
  TIME_BONUS_PER_SECOND: 10,
  ACCURACY_BONUS_THRESHOLD: 0.8,
  ACCURACY_BONUS_MULTIPLIER: 1.5,
  
  // Animation timings (ms)
  FLIP_DURATION: 300,
  MATCH_GLOW_DURATION: 500,
  MISMATCH_DELAY: 800,
  PREVIEW_DELAY: 1000,
  LEVEL_TRANSITION_DELAY: 1500,
  
  // Game limits
  MAX_LEVEL: 1000000,
  MIN_LEVEL: 1,
  LEADERBOARD_MAX_ENTRIES: 100,
  LEADERBOARD_DISPLAY_COUNT: 10,
  
  // Player name
  MAX_PLAYER_NAME_LENGTH: 15,
  MIN_PLAYER_NAME_LENGTH: 1,
  
  // Grid constraints
  MAX_GRID_COLUMNS: 6,
  MIN_GRID_COLUMNS: 2,
} as const;

// ============================================================================
// CARD FACE ID COLLECTION
// ============================================================================

export const CARD_EMOJIS: string[] = [
  'ram-module',
  'nvme-ssd',
  'sata-ssd',
  'cpu-chip',
  'gpu-card',
  'motherboard',
  'circuit-board',
  'cooling-fan',
  'usb-drive',
  'hdmi-cable',
  'ethernet-port',
  'monitor',
  'galaxy-book',
  'samsung-ssd',
  'memory-stick',
  'hard-drive',
  'floppy-disk',
  'dvd-disc',
  'cd-disc',
  'binary-core',
  'microchip',
  'keyboard',
  'mouse',
  'server-rack',
];

