/**
 * StartScreen Component
 * Game entry point with title, branding, and navigation
 */

import React, { memo, useEffect } from 'react';
import { useGameStore } from '@/store';
import './StartScreen.css';

// ============================================================================
// START SCREEN COMPONENT
// ============================================================================

export const StartScreen = memo(() => {
  const { 
    navigateToScreen, 
    startNewGame, 
    loadLeaderboard, 
    loadSettings 
  } = useGameStore();

  // Load data on mount
  useEffect(() => {
    loadSettings();
    loadLeaderboard();
  }, [loadSettings, loadLeaderboard]);

  // Handle start game
  const handleStartGame = () => {
    startNewGame();
  };

  // Handle view leaderboard
  const handleViewLeaderboard = () => {
    navigateToScreen('leaderboard');
  };

  return (
    <div className="start-screen">
      {/* Background Effects */}
      <div className="start-screen__bg">
        <div className="start-screen__gradient" />
        <div className="start-screen__particles" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="start-screen__particle"
              style={{
                '--particle-index': i,
                '--particle-x': `${Math.random() * 100}%`,
                '--particle-y': `${Math.random() * 100}%`,
                '--particle-size': `${Math.random() * 4 + 2}px`,
                '--particle-duration': `${Math.random() * 10 + 10}s`,
                '--particle-delay': `${Math.random() * 5}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="start-screen__content">
        {/* Logo/Title */}
        <div className="start-screen__title-section">
          <div className="start-screen__logo">
            <svg viewBox="0 0 100 100" className="start-screen__logo-svg">
              <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(-30 50 50)"/>
              <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(30 50 50)"/>
              <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          
          <h1 className="start-screen__title">
            <span className="start-screen__title-brand">SAMSUNG</span>
            <span className="start-screen__title-game">MEMORY FLIP</span>
          </h1>
          
          <p className="start-screen__subtitle">
            Test your memory. Match the pairs. Beat the clock.
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="start-screen__menu">
          <button
            className="start-screen__btn start-screen__btn--primary"
            onClick={handleStartGame}
          >
            <span className="start-screen__btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <span className="start-screen__btn-text">Start Game</span>
          </button>

          <button
            className="start-screen__btn start-screen__btn--secondary"
            onClick={handleViewLeaderboard}
          >
            <span className="start-screen__btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </span>
            <span className="start-screen__btn-text">Leaderboard</span>
          </button>
        </div>

        {/* Footer */}
        <div className="start-screen__footer">
          <p className="start-screen__hint">
            Tap to flip cards • Find matching pairs • Build your combo
          </p>
          <div className="start-screen__badges">
            <span className="start-screen__badge">8 Levels</span>
            <span className="start-screen__badge">48 Cards Max</span>
            <span className="start-screen__badge">Offline Play</span>
          </div>
        </div>
      </div>
    </div>
  );
});

StartScreen.displayName = 'StartScreen';

export default StartScreen;
