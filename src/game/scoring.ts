/**
 * Scoring Engine
 * Calculates scores with combo multipliers, time bonuses, and accuracy bonuses
 */

import { ScoreCalculation, ComboState, CONSTANTS } from '@/types';

/**
 * Calculate combo multiplier based on consecutive matches
 */
export const calculateComboMultiplier = (consecutiveMatches: number): number => {
  if (consecutiveMatches <= 0) return 1;
  
  const multiplier = 1 + (consecutiveMatches * CONSTANTS.COMBO_INCREMENT);
  return Math.min(multiplier, CONSTANTS.MAX_COMBO_MULTIPLIER);
};

/**
 * Calculate time bonus
 * More points for faster completion
 */
export const calculateTimeBonus = (
  elapsedTimeMs: number,
  levelTimeLimitSeconds: number | null
): number => {
  // If no time limit, calculate bonus based on speed
  const elapsedSeconds = elapsedTimeMs / 1000;
  
  if (levelTimeLimitSeconds) {
    // Time bonus for finishing under the limit
    const timeRemaining = Math.max(0, levelTimeLimitSeconds - elapsedSeconds);
    return Math.floor(timeRemaining * CONSTANTS.TIME_BONUS_PER_SECOND);
  }
  
  // Generic time bonus for speed (diminishing returns)
  // Base: 1000 points for completing in 30 seconds or less
  const speedBonus = Math.max(0, 1000 - (elapsedSeconds * 20));
  return Math.floor(speedBonus);
};

/**
 * Calculate accuracy bonus
 * Rewards players with high match-to-mismatch ratios
 */
export const calculateAccuracyBonus = (
  matches: number,
  mismatches: number
): number => {
  const totalAttempts = matches + mismatches;
  
  if (totalAttempts === 0) return 0;
  
  const accuracy = matches / totalAttempts;
  
  if (accuracy >= CONSTANTS.ACCURACY_BONUS_THRESHOLD) {
    return Math.floor(matches * 50 * CONSTANTS.ACCURACY_BONUS_MULTIPLIER);
  }
  
  return Math.floor(matches * 10);
};

/**
 * Calculate efficiency bonus
 * Rewards players who complete levels with fewer moves
 */
export const calculateEfficiencyBonus = (
  moves: number,
  pairCount: number
): number => {
  // Perfect game: exactly pairCount moves (every flip is a match)
  const perfectMoves = pairCount;
  const efficiency = perfectMoves / Math.max(moves, perfectMoves);
  
  // Bonus scales with how close to perfect the player was
  return Math.floor(efficiency * pairCount * 25);
};

/**
 * Calculate score for a single match
 */
export const calculateMatchScore = (
  baseScore: number = CONSTANTS.BASE_MATCH_SCORE,
  comboMultiplier: number
): number => {
  return Math.floor(baseScore * comboMultiplier);
};

/**
 * Calculate complete score breakdown
 */
export const calculateScoreBreakdown = (params: {
  matches: number;
  mismatches: number;
  moves: number;
  pairCount: number;
  elapsedTimeMs: number;
  timeLimitSeconds: number | null;
  maxCombo: number;
}): ScoreCalculation => {
  const {
    matches,
    mismatches,
    moves,
    pairCount,
    elapsedTimeMs,
    timeLimitSeconds,
    maxCombo,
  } = params;
  
  // Base score from matches
  const baseScore = matches * CONSTANTS.BASE_MATCH_SCORE;
  
  // Combo bonus (based on max combo achieved)
  const comboBonus = Math.floor(
    baseScore * (maxCombo - 1) * CONSTANTS.COMBO_INCREMENT
  );
  
  // Time bonus
  const timeBonus = calculateTimeBonus(elapsedTimeMs, timeLimitSeconds);
  
  // Accuracy bonus
  const accuracyBonus = calculateAccuracyBonus(matches, mismatches);
  
  // Efficiency bonus
  const efficiencyBonus = calculateEfficiencyBonus(moves, pairCount);
  
  // Total score
  const totalScore = baseScore + comboBonus + timeBonus + accuracyBonus + efficiencyBonus;
  
  return {
    baseScore,
    comboBonus,
    timeBonus,
    accuracyBonus,
    efficiencyBonus,
    totalScore,
  };
};

/**
 * Calculate accuracy percentage
 */
export const calculateAccuracy = (matches: number, mismatches: number): number => {
  const total = matches + mismatches;
  if (total === 0) return 100;
  return Math.round((matches / total) * 100);
};

/**
 * Format score with commas
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

/**
 * Format time as MM:SS
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format time as seconds with decimals
 */
export const formatTimePrecise = (milliseconds: number): string => {
  const seconds = (milliseconds / 1000).toFixed(1);
  return `${seconds}s`;
};

/**
 * Create initial combo state
 */
export const createInitialComboState = (): ComboState => ({
  multiplier: 1,
  consecutiveMatches: 0,
  maxCombo: 1,
});

/**
 * Update combo state on match
 */
export const updateComboOnMatch = (state: ComboState): ComboState => {
  const newConsecutive = state.consecutiveMatches + 1;
  const newMultiplier = calculateComboMultiplier(newConsecutive);
  
  return {
    multiplier: newMultiplier,
    consecutiveMatches: newConsecutive,
    maxCombo: Math.max(state.maxCombo, newConsecutive),
  };
};

/**
 * Reset combo state on mismatch
 */
export const resetComboOnMismatch = (state: ComboState): ComboState => ({
  multiplier: 1,
  consecutiveMatches: 0,
  maxCombo: state.maxCombo,
});
