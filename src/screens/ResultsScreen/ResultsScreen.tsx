/**
 * ResultsScreen Component
 * Score summary and name entry for leaderboard
 */

import React, { memo, useState, useCallback } from 'react';
import { useGameStore, selectGameStats } from '@/store';
import { Modal, VirtualKeyboard } from '@/components';
import { formatScore, formatTime, calculateScoreBreakdown, getLevelConfig } from '@/game';
import './ResultsScreen.css';

// ============================================================================
// RESULTS SCREEN COMPONENT
// ============================================================================

export const ResultsScreen = memo(() => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const {
    score,
    currentLevel,
    matchCount,
    moveCount,
    mismatchCount,
    elapsedTime,
    sessionStats,
    submitScore,
    navigateToScreen,
    startNewGame,
    resetGame,
  } = useGameStore();

  // Get game stats
  const stats = selectGameStats(useGameStore.getState());

  // Get level config
  const levelConfig = getLevelConfig(currentLevel);

  // Calculate score breakdown
  const scoreBreakdown = calculateScoreBreakdown({
    matches: matchCount,
    mismatches: mismatchCount,
    moves: moveCount,
    pairCount: levelConfig.pairCount,
    elapsedTimeMs: elapsedTime,
    timeLimitSeconds: levelConfig.timeLimit,
    maxCombo: sessionStats.bestCombo,
  });

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (playerName.trim()) {
      const success = await submitScore(playerName.trim());
      if (success) {
        setIsSubmitted(true);
        setShowNameModal(false);
      }
    }
  }, [playerName, submitScore]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    resetGame();
    startNewGame();
  }, [resetGame, startNewGame]);

  // Handle view leaderboard
  const handleViewLeaderboard = useCallback(() => {
    navigateToScreen('leaderboard');
  }, [navigateToScreen]);

  // Handle main menu
  const handleMainMenu = useCallback(() => {
    resetGame();
    navigateToScreen('start');
  }, [resetGame, navigateToScreen]);

  return (
    <div className="results-screen">
      {/* Background */}
      <div className="results-screen__bg" aria-hidden="true">
        <div className="results-screen__gradient" />
        <div className="results-screen__confetti">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="results-screen__confetti-piece"
              style={{
                '--confetti-index': i,
                '--confetti-color': ['#00d4ff', '#7b2cbf', '#ff006e', '#fb5607', '#ffbe0b'][i % 5],
                '--confetti-x': `${Math.random() * 100}%`,
                '--confetti-delay': `${Math.random() * 2}s`,
                '--confetti-duration': `${Math.random() * 3 + 2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="results-screen__content">
        {/* Header */}
        <div className="results-screen__header">
          <div className="results-screen__trophy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <h1 className="results-screen__title">
            {isSubmitted ? 'Score Submitted!' : 'Level Complete!'}
          </h1>
          <p className="results-screen__subtitle">
            Level {currentLevel} • {levelConfig.difficulty.toUpperCase()}
          </p>
        </div>

        {/* Score Display */}
        <div className="results-screen__score-section">
          <div className="results-screen__score-label">FINAL SCORE</div>
          <div className="results-screen__score">{formatScore(score)}</div>
        </div>

        {/* Stats Grid */}
        <div className="results-screen__stats">
          <div className="results-screen__stat">
            <span className="results-screen__stat-value">{stats.accuracy}%</span>
            <span className="results-screen__stat-label">Accuracy</span>
          </div>
          <div className="results-screen__stat">
            <span className="results-screen__stat-value">{formatTime(elapsedTime)}</span>
            <span className="results-screen__stat-label">Time</span>
          </div>
          <div className="results-screen__stat">
            <span className="results-screen__stat-value">{moveCount}</span>
            <span className="results-screen__stat-label">Moves</span>
          </div>
          <div className="results-screen__stat">
            <span className="results-screen__stat-value">{sessionStats.bestCombo}x</span>
            <span className="results-screen__stat-label">Best Combo</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="results-screen__breakdown">
          <h3 className="results-screen__breakdown-title">Score Breakdown</h3>
          <div className="results-screen__breakdown-list">
            <div className="results-screen__breakdown-item">
              <span>Base Score</span>
              <span>+{formatScore(scoreBreakdown.baseScore)}</span>
            </div>
            <div className="results-screen__breakdown-item">
              <span>Combo Bonus</span>
              <span>+{formatScore(scoreBreakdown.comboBonus)}</span>
            </div>
            <div className="results-screen__breakdown-item">
              <span>Time Bonus</span>
              <span>+{formatScore(scoreBreakdown.timeBonus)}</span>
            </div>
            <div className="results-screen__breakdown-item">
              <span>Accuracy Bonus</span>
              <span>+{formatScore(scoreBreakdown.accuracyBonus)}</span>
            </div>
            <div className="results-screen__breakdown-item">
              <span>Efficiency Bonus</span>
              <span>+{formatScore(scoreBreakdown.efficiencyBonus)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="results-screen__actions">
          {!isSubmitted ? (
            <>
              <button
                className="results-screen__btn results-screen__btn--primary"
                onClick={() => setShowNameModal(true)}
              >
                Submit Score
              </button>
              <button
                className="results-screen__btn results-screen__btn--secondary"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
            </>
          ) : (
            <>
              <button
                className="results-screen__btn results-screen__btn--primary"
                onClick={handleViewLeaderboard}
              >
                View Leaderboard
              </button>
              <button
                className="results-screen__btn results-screen__btn--secondary"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
            </>
          )}
          <button
            className="results-screen__btn results-screen__btn--tertiary"
            onClick={handleMainMenu}
          >
            Main Menu
          </button>
        </div>
      </div>

      {/* Name Entry Modal */}
      <Modal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        title="Enter Your Name"
        size="medium"
      >
        <VirtualKeyboard
          value={playerName}
          onChange={setPlayerName}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
});

ResultsScreen.displayName = 'ResultsScreen';

export default ResultsScreen;
