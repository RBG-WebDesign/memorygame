/**
 * App Component
 * Main application with screen routing
 */

import React, { memo, useEffect } from 'react';
import { useGameStore } from '@/store';
import { StartScreen, GameScreen, ResultsScreen, LeaderboardScreen } from '@/screens';
import './styles/global.css';

// ============================================================================
// APP COMPONENT
// ============================================================================

const App = memo(() => {
  const { currentScreen, loadSettings } = useGameStore();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'game':
        return <GameScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="app" data-screen={currentScreen}>
      {renderScreen()}
    </div>
  );
});

App.displayName = 'App';

export default App;
