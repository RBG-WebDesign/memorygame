/**
 * HUD Component
 * Heads-up display showing score, level, timer, and game stats
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { GameStatus } from '@/types';
import { formatTime, formatScore } from '@/game';
import { getLevelConfig, getDifficultyColor, getDifficultyLabel } from '@/game';
import './HUD.css';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface HUDProps {
  score: number;
  currentLevel: number;
  gameStatus: GameStatus;
  elapsedTime: number;
  previewTimeRemaining: number;
  comboMultiplier: number;
  matchCount: number;
  moveCount: number;
  remainingMistakes: number | null;
  currentPhase: number;
  totalPhases: number;
  matchedCards: number;
  totalCards: number;
  showComboAnimation: boolean;
  timeLimitSeconds?: number | null;
}

// ============================================================================
// HUD COMPONENT
// ============================================================================

export const HUD = memo<HUDProps>(({
  score,
  currentLevel,
  gameStatus,
  elapsedTime,
  previewTimeRemaining,
  comboMultiplier,
  matchCount,
  moveCount,
  remainingMistakes,
  currentPhase,
  totalPhases,
  matchedCards,
  totalCards,
  showComboAnimation,
  timeLimitSeconds = null,
}) => {
  // Get level configuration
  const levelConfig = useMemo(() => {
    try {
      return getLevelConfig(currentLevel);
    } catch {
      return null;
    }
  }, [currentLevel]);

  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    return totalCards > 0 ? (matchedCards / totalCards) * 100 : 0;
  }, [matchedCards, totalCards]);

  // Calculate accuracy
  const accuracy = useMemo(() => {
    return moveCount > 0 ? Math.round((matchCount / moveCount) * 100) : 100;
  }, [matchCount, moveCount]);

  // Determine if combo is active
  const isComboActive = comboMultiplier > 1;
  const [displayScore, setDisplayScore] = useState(score);
  const scoreAnimRef = useRef<number | null>(null);

  const remainingTimeMs = useMemo(() => {
    if (timeLimitSeconds == null) return null;
    return Math.max(0, timeLimitSeconds * 1000 - elapsedTime);
  }, [elapsedTime, timeLimitSeconds]);

  const isTimerDanger = gameStatus === 'playing'
    && remainingTimeMs !== null
    && remainingTimeMs <= 10000;

  useEffect(() => {
    if (score === displayScore) return;

    const start = displayScore;
    const diff = score - start;
    const startTs = performance.now();
    const duration = 320;

    const animate = (ts: number) => {
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + diff * eased));

      if (progress < 1) {
        scoreAnimRef.current = requestAnimationFrame(animate);
      }
    };

    if (scoreAnimRef.current) {
      cancelAnimationFrame(scoreAnimRef.current);
    }
    scoreAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (scoreAnimRef.current) {
        cancelAnimationFrame(scoreAnimRef.current);
      }
    };
  }, [score, displayScore]);

  return (
    <div className="hud" role="banner" aria-label="Game status">
      <div className="hud__top">
        <div className="hud__score-section">
          <div className="hud__label">SCORE</div>
          <div className="hud__score" aria-live="polite">
            {formatScore(displayScore)}
          </div>
          {isComboActive && (
            <div 
              className={`hud__combo ${showComboAnimation ? 'hud__combo--animate' : ''}`}
              aria-label={`Combo multiplier: ${comboMultiplier.toFixed(1)}x`}
            >
              <span className="hud__combo-multiplier">{comboMultiplier.toFixed(1)}x</span>
              <span className="hud__combo-label">COMBO</span>
            </div>
          )}
        </div>

        <div className="hud__center-pill">
          <div className="hud__timer-section">
            {gameStatus === 'preview' ? (
              <div className="hud__preview-timer">
                <span className="hud__timer-label">MEMORIZE</span>
                <span className="hud__timer-value hud__timer-value--preview">
                  {Math.ceil(previewTimeRemaining / 1000)}s
                </span>
              </div>
            ) : (
              <div className={`hud__game-timer ${isTimerDanger ? 'hud__game-timer--danger' : ''}`}>
                <span className="hud__timer-label">
                  {remainingTimeMs !== null ? 'TIME LEFT' : 'TIME'}
                </span>
                <span className="hud__timer-value">
                  {formatTime(remainingTimeMs ?? elapsedTime)}
                </span>
              </div>
            )}
          </div>
          <div className="hud__progress-section">
            <div className="hud__progress-header">
              <span className="hud__progress-label">LEVEL PROGRESS</span>
              <span className="hud__progress-count">
                {matchedCards / 2} / {totalCards / 2} pairs
              </span>
            </div>
            <div 
              className="hud__progress-bar"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div 
                className="hud__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hud__level-section">
          <div className="hud__level-badge">
            <span className="hud__level-label">LVL</span>
            <span className="hud__level-number">{currentLevel}</span>
          </div>
          {levelConfig && (
            <div
              className="hud__difficulty"
              style={{ color: getDifficultyColor(levelConfig.difficulty) }}
            >
              {getDifficultyLabel(levelConfig.difficulty)}
            </div>
          )}
        </div>
      </div>

      <div className="hud__bottom">
        <div className="hud__stat">
          <span className="hud__stat-value">{matchCount}</span>
          <span className="hud__stat-label">Matches</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-value">{moveCount}</span>
          <span className="hud__stat-label">Moves</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-value">{accuracy}%</span>
          <span className="hud__stat-label">Accuracy</span>
        </div>
        <div className="hud__stat">
          <span className="hud__stat-value">{currentPhase}/{totalPhases}</span>
          <span className="hud__stat-label">Phase</span>
        </div>
        {remainingMistakes != null && (
          <div className="hud__stat">
            <span className="hud__stat-value">{remainingMistakes}</span>
            <span className="hud__stat-label">Mistakes Left</span>
          </div>
        )}
      </div>
    </div>
  );
});

HUD.displayName = 'HUD';

export default HUD;
