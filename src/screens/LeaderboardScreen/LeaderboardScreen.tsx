/**
 * LeaderboardScreen Component
 * Display top scores with filtering and navigation
 */

import React, { memo, useEffect } from 'react';
import { useGameStore } from '@/store';
import { formatScore, formatTime } from '@/game';
import './LeaderboardScreen.css';

// ============================================================================
// LEADERBOARD SCREEN COMPONENT
// ============================================================================

export const LeaderboardScreen = memo(() => {
  const {
    leaderboard,
    isLoading,
    loadLeaderboard,
    navigateToScreen,
    resetGame,
  } = useGameStore();

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Handle back
  const handleBack = () => {
    navigateToScreen('start');
  };

  // Handle play again
  const handlePlayAgain = () => {
    resetGame();
    navigateToScreen('game');
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get rank style
  const getRankStyle = (index: number): string => {
    if (index === 0) return 'leaderboard-screen__rank--gold';
    if (index === 1) return 'leaderboard-screen__rank--silver';
    if (index === 2) return 'leaderboard-screen__rank--bronze';
    return '';
  };

  return (
    <div className="leaderboard-screen">
      {/* Background */}
      <div className="leaderboard-screen__bg" aria-hidden="true">
        <div className="leaderboard-screen__gradient" />
      </div>

      {/* Content */}
      <div className="leaderboard-screen__content">
        {/* Header */}
        <div className="leaderboard-screen__header">
          <button
            className="leaderboard-screen__back-btn"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="leaderboard-screen__title-section">
            <div className="leaderboard-screen__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <h1 className="leaderboard-screen__title">Leaderboard</h1>
            <p className="leaderboard-screen__subtitle">Top 10 High Scores</p>
          </div>
          
          <div className="leaderboard-screen__spacer" />
        </div>

        {/* Leaderboard List */}
        <div className="leaderboard-screen__list">
          {isLoading ? (
            <div className="leaderboard-screen__loading">
              <div className="leaderboard-screen__spinner" />
              <span>Loading...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="leaderboard-screen__empty">
              <div className="leaderboard-screen__empty-icon">🏆</div>
              <p className="leaderboard-screen__empty-title">No scores yet</p>
              <p className="leaderboard-screen__empty-text">
                Be the first to set a high score!
              </p>
            </div>
          ) : (
            <div className="leaderboard-screen__entries">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`leaderboard-screen__entry ${index < 3 ? 'leaderboard-screen__entry--top' : ''}`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  {/* Rank */}
                  <div className={`leaderboard-screen__rank ${getRankStyle(index)}`}>
                    {index === 0 && <span>🥇</span>}
                    {index === 1 && <span>🥈</span>}
                    {index === 2 && <span>🥉</span>}
                    {index > 2 && <span>#{index + 1}</span>}
                  </div>

                  {/* Player Info */}
                  <div className="leaderboard-screen__player">
                    <span className="leaderboard-screen__name">{entry.playerName}</span>
                    <span className="leaderboard-screen__meta">
                      Level {entry.levelReached} • {entry.accuracy}% accuracy
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="leaderboard-screen__stats">
                    <span className="leaderboard-screen__score">
                      {formatScore(entry.score)}
                    </span>
                    <span className="leaderboard-screen__time">
                      {formatTime(entry.completionTime)}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="leaderboard-screen__date">
                    {formatDate(entry.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="leaderboard-screen__footer">
          <button
            className="leaderboard-screen__btn leaderboard-screen__btn--primary"
            onClick={handlePlayAgain}
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
});

LeaderboardScreen.displayName = 'LeaderboardScreen';

export default LeaderboardScreen;
