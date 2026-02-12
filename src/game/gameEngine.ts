/**
 * Game Engine
 * Core game logic for card matching, state transitions, and game flow
 */

import { GameState, CONSTANTS } from '@/types';
import { generateCardDeck } from './shuffle';
import { getLevelConfig } from './levels';
import { calculateMatchScore, updateComboOnMatch, resetComboOnMismatch } from './scoring';

/**
 * Preview duration formula:
 * previewSeconds = clamp(3 + (pairs * 0.5), 4, 8)
 */
export const calculatePreviewDuration = (pairCount: number): number => {
  const previewSeconds = Math.max(4, Math.min(8, 3 + (pairCount * 0.5)));
  return Math.round(previewSeconds * 1000);
};

/**
 * Initialize a new game state
 */
export const initializeGame = (): Partial<GameState> => ({
  currentLevel: 1,
  cards: [],
  flippedCards: [],
  matchedCards: [],
  score: 0,
  comboMultiplier: 1,
  consecutiveMatches: 0,
  moveCount: 0,
  matchCount: 0,
  mismatchCount: 0,
  startTime: null,
  elapsedTime: 0,
  previewTimeRemaining: 0,
  gameStatus: 'idle',
  currentScreen: 'start',
  isInteractionLocked: false,
  completedLevels: [],
  sessionStats: {
    totalMatches: 0,
    totalMismatches: 0,
    totalMoves: 0,
    bestCombo: 0,
    totalTime: 0,
  },
});

/**
 * Initialize a new level
 */
export const initializeLevel = (level: number): Partial<GameState> => {
  const config = getLevelConfig(level);
  const cards = generateCardDeck(config.pairCount).map((card) => ({
    ...card,
    isFlipped: true,
  }));
  const previewDuration = calculatePreviewDuration(config.pairCount);

  return {
    currentLevel: level,
    cards,
    flippedCards: [],
    matchedCards: [],
    previewTimeRemaining: previewDuration,
    elapsedTime: 0,
    startTime: null,
    moveCount: 0,
    matchCount: 0,
    mismatchCount: 0,
    comboMultiplier: 1,
    consecutiveMatches: 0,
    gameStatus: 'preview',
    isInteractionLocked: true,
  };
};

/**
 * Start the preview phase - show all cards briefly
 */
export const startPreview = (state: GameState): Partial<GameState> => {
  const config = getLevelConfig(state.currentLevel);
  const previewDuration = calculatePreviewDuration(config.pairCount);

  return {
    cards: state.cards.map(card => ({
      ...card,
      isFlipped: true,
    })),
    flippedCards: [],
    previewTimeRemaining: previewDuration,
    startTime: null,
    elapsedTime: 0,
    gameStatus: 'preview',
    isInteractionLocked: true,
  };
};

/**
 * End preview phase - hide all cards and start gameplay
 */
export const endPreview = (state: GameState): Partial<GameState> => ({
  cards: state.cards.map(card => ({
    ...card,
    isFlipped: false,
  })),
  gameStatus: 'playing',
  isInteractionLocked: false,
  startTime: Date.now(),
});

/**
 * Check if a card can be flipped
 */
export const canFlipCard = (state: GameState, cardId: string): boolean => {
  // Can't flip if interaction is locked
  if (state.isInteractionLocked) return false;

  // Can't flip if not playing
  if (state.gameStatus !== 'playing') return false;

  // Can't flip if already have 2 cards flipped
  if (state.flippedCards.length >= 2) return false;

  const card = state.cards.find(c => c.id === cardId);
  if (!card) return false;

  // Can't flip if already flipped
  if (card.isFlipped) return false;

  // Can't flip if already matched
  if (card.isMatched) return false;

  // Can't flip if card is locked
  if (card.isLocked) return false;

  return true;
};

/**
 * Flip a card
 */
export const flipCard = (state: GameState, cardId: string): Partial<GameState> | null => {
  if (!canFlipCard(state, cardId)) return null;

  const newFlippedCards = [...state.flippedCards, cardId];

  return {
    cards: state.cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ),
    flippedCards: newFlippedCards,
    moveCount: state.moveCount + 1,
  };
};

/**
 * Check if two flipped cards match
 */
export const checkForMatch = (state: GameState): {
  isMatch: boolean;
  pairId: string | null;
} => {
  if (state.gameStatus !== 'resolving') {
    return { isMatch: false, pairId: null };
  }

  if (state.flippedCards.length !== 2) {
    return { isMatch: false, pairId: null };
  }

  const [card1Id, card2Id] = state.flippedCards;
  const card1 = state.cards.find(c => c.id === card1Id);
  const card2 = state.cards.find(c => c.id === card2Id);

  if (!card1 || !card2) {
    return { isMatch: false, pairId: null };
  }

  if (card1.id === card2.id) {
    return { isMatch: false, pairId: null };
  }

  if (!card1.isFlipped || !card2.isFlipped) {
    return { isMatch: false, pairId: null };
  }

  const isMatch = card1.pairId === card2.pairId;

  return {
    isMatch,
    pairId: isMatch ? card1.pairId : null,
  };
};

/**
 * Handle a successful match
 */
export const handleMatch = (state: GameState): Partial<GameState> => {
  const [card1Id, card2Id] = state.flippedCards;
  const matchScore = calculateMatchScore(CONSTANTS.BASE_MATCH_SCORE, state.comboMultiplier);
  const newCombo = updateComboOnMatch({
    multiplier: state.comboMultiplier,
    consecutiveMatches: state.consecutiveMatches,
    maxCombo: state.sessionStats.bestCombo,
  });

  return {
    cards: state.cards.map(card =>
      card.id === card1Id || card.id === card2Id
        ? { ...card, isMatched: true, isLocked: true }
        : card
    ),
    flippedCards: [],
    matchedCards: [...state.matchedCards, card1Id, card2Id],
    score: state.score + matchScore,
    comboMultiplier: newCombo.multiplier,
    consecutiveMatches: newCombo.consecutiveMatches,
    matchCount: state.matchCount + 1,
    isInteractionLocked: false,
    gameStatus: 'playing',
    sessionStats: {
      ...state.sessionStats,
      totalMatches: state.sessionStats.totalMatches + 1,
      bestCombo: newCombo.maxCombo,
    },
  };
};

/**
 * Handle a mismatch - flip cards back
 */
export const handleMismatch = (state: GameState): Partial<GameState> => {
  const [card1Id, card2Id] = state.flippedCards;
  const resetCombo = resetComboOnMismatch({
    multiplier: state.comboMultiplier,
    consecutiveMatches: state.consecutiveMatches,
    maxCombo: state.sessionStats.bestCombo,
  });

  return {
    cards: state.cards.map(card =>
      card.id === card1Id || card.id === card2Id
        ? { ...card, isFlipped: false }
        : card
    ),
    flippedCards: [],
    comboMultiplier: resetCombo.multiplier,
    consecutiveMatches: resetCombo.consecutiveMatches,
    mismatchCount: state.mismatchCount + 1,
    sessionStats: {
      ...state.sessionStats,
      totalMismatches: state.sessionStats.totalMismatches + 1,
    },
    isInteractionLocked: false,
    gameStatus: 'playing',
  };
};

/**
 * Check if level is complete
 */
export const isLevelComplete = (state: GameState): boolean => {
  const config = getLevelConfig(state.currentLevel);
  return state.matchedCards.length === config.totalCards;
};

/**
 * Complete the current level
 */
export const completeLevel = (state: GameState): Partial<GameState> => {
  const elapsedTime = state.startTime ? Date.now() - state.startTime : 0;

  return {
    gameStatus: 'levelComplete',
    elapsedTime,
    completedLevels: [...state.completedLevels, state.currentLevel],
    sessionStats: {
      ...state.sessionStats,
      totalTime: state.sessionStats.totalTime + elapsedTime,
      totalMoves: state.sessionStats.totalMoves + state.moveCount,
    },
  };
};

/**
 * Check if game is complete (all levels finished)
 */
export const isGameComplete = (state: GameState): boolean => {
  return state.currentLevel >= CONSTANTS.MAX_LEVEL;
};

/**
 * Complete the entire game
 */
export const completeGame = (_state: GameState): Partial<GameState> => {
  return {
    gameStatus: 'gameComplete',
    currentScreen: 'results',
  };
};

/**
 * Advance to next level
 */
export const advanceToNextLevel = (state: GameState): Partial<GameState> | null => {
  const nextLevel = state.currentLevel + 1;

  if (nextLevel > CONSTANTS.MAX_LEVEL) {
    return completeGame(state);
  }

  return initializeLevel(nextLevel);
};

/**
 * Reset current level
 */
export const resetLevel = (state: GameState): Partial<GameState> => {
  return {
    ...initializeLevel(state.currentLevel),
    score: state.score,
    sessionStats: state.sessionStats,
  };
};

/**
 * Update elapsed time
 */
export const updateElapsedTime = (state: GameState): Partial<GameState> => {
  if (!state.startTime || state.gameStatus !== 'playing') return {};

  return {
    elapsedTime: Date.now() - state.startTime,
  };
};

/**
 * Update preview timer
 */
export const updatePreviewTimer = (state: GameState, deltaMs: number): Partial<GameState> => {
  const newTime = Math.max(0, state.previewTimeRemaining - deltaMs);

  if (newTime === 0 && state.gameStatus === 'preview') {
    // Preview time is up, end preview
    return {
      ...endPreview(state),
      previewTimeRemaining: 0,
    };
  }

  return {
    previewTimeRemaining: newTime,
  };
};

/**
 * Check if time limit exceeded
 */
export const isTimeLimitExceeded = (state: GameState): boolean => {
  const config = getLevelConfig(state.currentLevel);

  if (!config.timeLimit) return false;

  const elapsedSeconds = state.elapsedTime / 1000;
  return elapsedSeconds > config.timeLimit;
};

/**
 * Pause game
 */
export const pauseGame = (_state: GameState): Partial<GameState> => ({
  gameStatus: 'paused',
});

/**
 * Resume game
 */
export const resumeGame = (_state: GameState): Partial<GameState> => ({
  gameStatus: 'playing',
});

/**
 * Get game statistics for results screen
 */
export const getGameStats = (state: GameState) => {
  const accuracy = state.moveCount > 0
    ? Math.round((state.matchCount / state.moveCount) * 100)
    : 100;

  return {
    score: state.score,
    levelReached: state.currentLevel,
    moves: state.moveCount,
    matches: state.matchCount,
    mismatches: state.mismatchCount,
    accuracy,
    completionTime: state.elapsedTime,
    bestCombo: state.sessionStats.bestCombo,
  };
};
