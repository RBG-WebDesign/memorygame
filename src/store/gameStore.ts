/**
 * Game Store
 * Zustand-based state management for the memory flip game
 * Handles all game state, actions, and persistence
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  GameState,
  GameSettings,
  ScreenType,
  LeaderboardEntry,
  CONSTANTS,
} from '@/types';
import {
  initializeGame,
  initializeLevel,
  flipCard,
  checkForMatch,
  handleMatch,
  handleMismatch,
  isLevelComplete,
  completeLevel,
  startNextPhase,
  advanceToNextLevel,
  completeGame,
  getGameStats,
  updateElapsedTime,
  applyPlayingModifiers,
  updatePreviewTimer,
  resetLevel,
  getLevelConfig,
} from '@/game';
import {
  addLeaderboardEntry,
  getTopScores,
  getSettings,
  saveSettings,
} from '@/services/storage';

// ============================================================================
// STORE STATE TYPE
// ============================================================================

interface GameStoreState extends GameState {
  // UI State
  settings: GameSettings;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  
  // Animation triggers
  lastMatchId: string | null;
  matchEffectNonce: number;
  comboDisplay: number;
  showComboAnimation: boolean;
}

// ============================================================================
// STORE ACTIONS TYPE
// ============================================================================

interface GameStoreActions {
  // Navigation
  navigateToScreen: (screen: ScreenType) => void;
  
  // Game flow
  startNewGame: () => void;
  startLevel: (level: number) => void;
  flipCard: (cardId: string) => void;
  resolveMatch: () => void;
  completeCurrentLevel: () => void;
  goToNextLevel: () => void;
  restartLevel: () => void;
  endGame: () => void;
  
  // Timer
  tick: (deltaMs: number) => void;
  
  // Leaderboard
  submitScore: (playerName: string) => Promise<boolean>;
  loadLeaderboard: () => Promise<void>;
  
  // Settings
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<GameSettings>) => Promise<void>;
  toggleSound: () => void;
  toggleAnimations: () => void;
  toggleVibration: () => void;
  
  // Reset
  resetGame: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (): GameStoreState => ({
  ...initializeGame() as GameState,
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    vibrationEnabled: true,
    darkMode: true,
  },
  leaderboard: [],
  isLoading: false,
  error: null,
  lastMatchId: null,
  matchEffectNonce: 0,
  comboDisplay: 0,
  showComboAnimation: false,
});

// ============================================================================
// STORE CREATION
// ============================================================================

export const useGameStore = create<GameStoreState & GameStoreActions>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      ...createInitialState(),

      // ============================================================================
      // NAVIGATION ACTIONS
      // ============================================================================

      navigateToScreen: (screen) => {
        set((state) => {
          state.currentScreen = screen;
        });
      },

      // ============================================================================
      // GAME FLOW ACTIONS
      // ============================================================================

      startNewGame: () => {
        set((state) => {
          const initialState = initializeGame();
          Object.assign(state, initialState);
          state.currentScreen = 'game';
        });
        
        // Start level 1 after state update
        setTimeout(() => {
          get().startLevel(1);
        }, 100);
      },

      startLevel: (level) => {
        set((state) => {
          const levelState = initializeLevel(level);
          Object.assign(state, levelState);
          state.lastMatchId = null;
          state.matchEffectNonce = 0;
          state.comboDisplay = 0;
          state.showComboAnimation = false;
        });
      },

      flipCard: (cardId) => {
        const currentState = get();
        
        // Don't allow flips during resolution
        if (currentState.isInteractionLocked) return;
        if (currentState.gameStatus !== 'playing') return;
        
        const result = flipCard(currentState, cardId);
        
        if (result) {
          set((state) => {
            Object.assign(state, result);
          });

          // Check if we have 2 cards flipped
          const newFlippedCount = currentState.flippedCards.length + 1;
          if (newFlippedCount === 2) {
            // Lock interaction and resolve after delay
            set((state) => {
              state.isInteractionLocked = true;
              state.gameStatus = 'resolving';
            });

            setTimeout(() => {
              get().resolveMatch();
            }, CONSTANTS.FLIP_DURATION + 200);
          }
        }
      },

      resolveMatch: () => {
        const currentState = get();

        if (currentState.gameStatus !== 'resolving') {
          return;
        }

        const matchResult = checkForMatch(currentState);
        if (!matchResult.isMatch || !matchResult.pairId) {
          const config = getLevelConfig(currentState.currentLevel);
          const mismatchDelay = config.mismatchRevealDuration;

          setTimeout(() => {
            const latest = get();
            if (latest.gameStatus !== 'resolving') return;

            set((state) => {
              const mismatchState = handleMismatch(latest);
              Object.assign(state, mismatchState);
              state.lastMatchId = null;

              const limit = getLevelConfig(state.currentLevel).mistakeLimit;
              if (limit != null && state.mismatchCount >= limit) {
                state.gameStatus = 'levelFailed';
                state.isInteractionLocked = true;
                state.failedReason = 'mistakes';
              }
            });
          }, mismatchDelay);
          return;
        }

        // Handle confirmed match only
        set((state) => {
          const matchState = handleMatch(currentState);
          Object.assign(state, matchState);
          state.lastMatchId = matchResult.pairId;
          state.matchEffectNonce += 1;
          state.comboDisplay = Math.floor(state.comboMultiplier * 10) / 10;
          state.showComboAnimation = state.comboMultiplier > 1;
          state.gameStatus = 'resolving';
          state.isInteractionLocked = true;
        });

        // Hide combo animation after delay
        setTimeout(() => {
          set((state) => {
            state.showComboAnimation = false;
          });
        }, 1000);

        // Unlock after match FX and check level completion
        setTimeout(() => {
          const latest = get();
          if (isLevelComplete(latest)) {
            get().completeCurrentLevel();
            return;
          }

          set((state) => {
            state.gameStatus = 'playing';
            state.isInteractionLocked = false;
          });
        }, CONSTANTS.MATCH_GLOW_DURATION);
      },

      completeCurrentLevel: () => {
        const currentState = get();
        if (currentState.currentPhase < currentState.totalPhases) {
          set((state) => {
            const phaseState = startNextPhase(currentState);
            Object.assign(state, phaseState);
            state.lastMatchId = null;
            state.matchEffectNonce = 0;
            state.comboDisplay = 0;
            state.showComboAnimation = false;
          });
          return;
        }

        set((state) => {
          const levelCompleteState = completeLevel(get());
          Object.assign(state, levelCompleteState);
        });
      },

      goToNextLevel: () => {
        const currentState = get();
        const nextLevelState = advanceToNextLevel(currentState);
        
        if (nextLevelState) {
          set((state) => {
            Object.assign(state, nextLevelState);
            state.lastMatchId = null;
            state.matchEffectNonce = 0;
            state.comboDisplay = 0;
            state.showComboAnimation = false;
          });
        }
      },

      restartLevel: () => {
        const currentState = get();
        const resetState = resetLevel(currentState);
        
        set((state) => {
          Object.assign(state, resetState);
          state.lastMatchId = null;
          state.matchEffectNonce = 0;
          state.comboDisplay = 0;
          state.showComboAnimation = false;
        });
      },

      endGame: () => {
        set((state) => {
          const gameCompleteState = completeGame(get());
          Object.assign(state, gameCompleteState);
        });
      },

      // ============================================================================
      // TIMER ACTIONS
      // ============================================================================

      tick: (deltaMs) => {
        const currentState = get();
        
        if (currentState.gameStatus === 'preview') {
          set((state) => {
            const previewState = updatePreviewTimer(currentState, deltaMs);
            Object.assign(state, previewState);
          });
        } else if (currentState.gameStatus === 'playing') {
          set((state) => {
            const timeState = updateElapsedTime(currentState);
            const modifierState = applyPlayingModifiers(currentState, deltaMs);
            Object.assign(state, timeState, modifierState);
          });
        }
      },

      // ============================================================================
      // LEADERBOARD ACTIONS
      // ============================================================================

      submitScore: async (playerName) => {
        const currentState = get();
        const stats = getGameStats(currentState);
        
        set((state) => {
          state.isLoading = true;
        });

        try {
          const entry = await addLeaderboardEntry({
            playerName: playerName.trim().slice(0, CONSTANTS.MAX_PLAYER_NAME_LENGTH),
            score: stats.score,
            levelReached: stats.levelReached,
            accuracy: stats.accuracy,
            completionTime: stats.completionTime,
            moves: stats.moves,
            bestCombo: stats.bestCombo,
          });

          if (entry) {
            // Reload leaderboard
            await get().loadLeaderboard();
            return true;
          }
          return false;
        } catch (error) {
          set((state) => {
            state.error = 'Failed to submit score';
          });
          return false;
        } finally {
          set((state) => {
            state.isLoading = false;
          });
        }
      },

      loadLeaderboard: async () => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const entries = await getTopScores(CONSTANTS.LEADERBOARD_DISPLAY_COUNT);
          set((state) => {
            state.leaderboard = entries;
          });
        } catch (error) {
          set((state) => {
            state.error = 'Failed to load leaderboard';
          });
        } finally {
          set((state) => {
            state.isLoading = false;
          });
        }
      },

      // ============================================================================
      // SETTINGS ACTIONS
      // ============================================================================

      loadSettings: async () => {
        try {
          const settings = await getSettings();
          set((state) => {
            state.settings = settings;
          });
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      },

      updateSettings: async (newSettings) => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, ...newSettings };
        
        await saveSettings(updatedSettings);
        
        set((state) => {
          state.settings = updatedSettings;
        });
      },

      toggleSound: () => {
        const currentState = get();
        get().updateSettings({ soundEnabled: !currentState.settings.soundEnabled });
      },

      toggleAnimations: () => {
        const currentState = get();
        get().updateSettings({ animationsEnabled: !currentState.settings.animationsEnabled });
      },

      toggleVibration: () => {
        const currentState = get();
        get().updateSettings({ vibrationEnabled: !currentState.settings.vibrationEnabled });
      },

      // ============================================================================
      // RESET ACTIONS
      // ============================================================================

      resetGame: () => {
        set((state) => {
          const initialState = createInitialState();
          Object.assign(state, initialState);
        });
      },
    }))
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectCurrentLevelConfig = (state: GameStoreState) => {
  return getLevelConfig(state.currentLevel);
};

export const selectGameStats = (state: GameStoreState) => {
  return getGameStats(state);
};

export const selectCanFlip = (state: GameStoreState) => {
  return state.gameStatus === 'playing' && !state.isInteractionLocked;
};

export const selectProgress = (state: GameStoreState) => {
  const config = getLevelConfig(state.currentLevel);
  return {
    matched: state.matchedCards.length / 2,
    total: config.pairCount,
    percentage: (state.matchedCards.length / 2 / config.pairCount) * 100,
  };
};

export const selectAccuracy = (state: GameStoreState) => {
  if (state.moveCount === 0) return 100;
  return Math.round((state.matchCount / state.moveCount) * 100);
};
