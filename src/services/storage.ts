/**
 * Storage Service
 * IndexedDB persistence layer using localForage
 * Handles leaderboard and game settings storage
 */

import localforage from 'localforage';
import { LeaderboardEntry, GameSettings, CONSTANTS } from '@/types';

// ============================================================================
// STORAGE CONFIGURATION
// ============================================================================

const LEADERBOARD_KEY = 'samsung_memory_leaderboard';
const SETTINGS_KEY = 'samsung_memory_settings';

// Configure localForage instances
const leaderboardStore = localforage.createInstance({
  name: 'SamsungMemoryFlip',
  storeName: 'leaderboard',
  description: 'Leaderboard data for Samsung Memory Flip Game',
});

const settingsStore = localforage.createInstance({
  name: 'SamsungMemoryFlip',
  storeName: 'settings',
  description: 'Game settings for Samsung Memory Flip Game',
});

// ============================================================================
// LEADERBOARD OPERATIONS
// ============================================================================

/**
 * Get all leaderboard entries
 */
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const entries = await leaderboardStore.getItem<LeaderboardEntry[]>(LEADERBOARD_KEY);
    return entries || [];
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
};

/**
 * Save leaderboard entries
 */
export const saveLeaderboard = async (entries: LeaderboardEntry[]): Promise<boolean> => {
  try {
    await leaderboardStore.setItem(LEADERBOARD_KEY, entries);
    return true;
  } catch (error) {
    console.error('Error saving leaderboard:', error);
    return false;
  }
};

/**
 * Add a new leaderboard entry
 * Automatically sorts and limits entries
 */
export const addLeaderboardEntry = async (
  entry: Omit<LeaderboardEntry, 'id' | 'date'>
): Promise<LeaderboardEntry | null> => {
  try {
    const entries = await getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: generateEntryId(),
      date: Date.now(),
    };
    
    // Add new entry
    const updatedEntries = [...entries, newEntry];
    
    // Sort by score (descending)
    updatedEntries.sort((a, b) => b.score - a.score);
    
    // Limit to max entries
    const limitedEntries = updatedEntries.slice(0, CONSTANTS.LEADERBOARD_MAX_ENTRIES);
    
    // Save
    await saveLeaderboard(limitedEntries);
    
    return newEntry;
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    return null;
  }
};

/**
 * Get top N leaderboard entries
 */
export const getTopScores = async (count: number = 10): Promise<LeaderboardEntry[]> => {
  const entries = await getLeaderboard();
  return entries.slice(0, count);
};

/**
 * Get player's rank in leaderboard
 */
export const getPlayerRank = async (entryId: string): Promise<number | null> => {
  const entries = await getLeaderboard();
  const index = entries.findIndex(e => e.id === entryId);
  return index !== -1 ? index + 1 : null;
};

/**
 * Check if score qualifies for top 10
 */
export const isHighScore = async (score: number): Promise<boolean> => {
  const entries = await getTopScores(CONSTANTS.LEADERBOARD_DISPLAY_COUNT);
  
  if (entries.length < CONSTANTS.LEADERBOARD_DISPLAY_COUNT) {
    return true;
  }
  
  const lowestTopScore = entries[entries.length - 1]?.score || 0;
  return score > lowestTopScore;
};

/**
 * Clear all leaderboard entries
 */
export const clearLeaderboard = async (): Promise<boolean> => {
  try {
    await leaderboardStore.removeItem(LEADERBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return false;
  }
};

/**
 * Get leaderboard statistics
 */
export const getLeaderboardStats = async () => {
  const entries = await getLeaderboard();
  
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      highestScore: 0,
      averageScore: 0,
      averageAccuracy: 0,
    };
  }
  
  const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
  const totalAccuracy = entries.reduce((sum, e) => sum + e.accuracy, 0);
  
  return {
    totalEntries: entries.length,
    highestScore: entries[0]?.score || 0,
    averageScore: Math.round(totalScore / entries.length),
    averageAccuracy: Math.round(totalAccuracy / entries.length),
  };
};

// ============================================================================
// SETTINGS OPERATIONS
// ============================================================================

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  vibrationEnabled: true,
  darkMode: true,
};

/**
 * Get game settings
 */
export const getSettings = async (): Promise<GameSettings> => {
  try {
    const settings = await settingsStore.getItem<GameSettings>(SETTINGS_KEY);
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save game settings
 */
export const saveSettings = async (settings: GameSettings): Promise<boolean> => {
  try {
    await settingsStore.setItem(SETTINGS_KEY, settings);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Update specific setting
 */
export const updateSetting = async <K extends keyof GameSettings>(
  key: K,
  value: GameSettings[K]
): Promise<boolean> => {
  try {
    const settings = await getSettings();
    const updatedSettings = { ...settings, [key]: value };
    return saveSettings(updatedSettings);
  } catch (error) {
    console.error('Error updating setting:', error);
    return false;
  }
};

/**
 * Reset settings to defaults
 */
export const resetSettings = async (): Promise<boolean> => {
  return saveSettings(DEFAULT_SETTINGS);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique entry ID
 */
const generateEntryId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export leaderboard data (for backup/sync)
 */
export const exportLeaderboard = async (): Promise<string> => {
  const entries = await getLeaderboard();
  return JSON.stringify(entries, null, 2);
};

/**
 * Import leaderboard data (from backup/sync)
 */
export const importLeaderboard = async (jsonData: string): Promise<boolean> => {
  try {
    const entries = JSON.parse(jsonData) as LeaderboardEntry[];
    
    // Validate entries
    if (!Array.isArray(entries)) {
      throw new Error('Invalid leaderboard data format');
    }
    
    // Merge with existing entries
    const existingEntries = await getLeaderboard();
    const mergedEntries = [...existingEntries, ...entries];
    
    // Remove duplicates (by id)
    const uniqueEntries = mergedEntries.filter(
      (entry, index, self) => 
        index === self.findIndex(e => e.id === entry.id)
    );
    
    // Sort and limit
    uniqueEntries.sort((a, b) => b.score - a.score);
    const limitedEntries = uniqueEntries.slice(0, CONSTANTS.LEADERBOARD_MAX_ENTRIES);
    
    await saveLeaderboard(limitedEntries);
    return true;
  } catch (error) {
    console.error('Error importing leaderboard:', error);
    return false;
  }
};

/**
 * Clear all storage (nuclear option)
 */
export const clearAllStorage = async (): Promise<boolean> => {
  try {
    await leaderboardStore.clear();
    await settingsStore.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = async (): Promise<boolean> => {
  try {
    await leaderboardStore.setItem('__test__', 'test');
    await leaderboardStore.removeItem('__test__');
    return true;
  } catch {
    return false;
  }
};
