/**
 * Shuffle Engine
 * Implements Fisher-Yates shuffle algorithm for fair card randomization
 */

import { Card, CardPair } from '@/types';
import { CARD_ART_IDS } from '@/assets/cardCatalog';

/**
 * Fisher-Yates shuffle algorithm
 * O(n) time complexity, unbiased shuffle
 */
export const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Generate unique card pairs for a level
 */
export const generateCardPairs = (pairCount: number): CardPair[] => {
  // Shuffle themed card pool and take required amount
  const shuffledArtIds = fisherYatesShuffle(CARD_ART_IDS);
  const selectedArtIds = shuffledArtIds.slice(0, pairCount);
  
  return selectedArtIds.map((assetId, index) => ({
    id: `pair-${index}`,
    emoji: assetId,
  }));
};

/**
 * Generate a complete deck of cards for a level
 * Creates pairs and shuffles them
 */
export const generateCardDeck = (pairCount: number): Card[] => {
  const pairs = generateCardPairs(pairCount);
  const cards: Card[] = [];
  
  // Create two cards for each pair
  pairs.forEach((pair) => {
    // First card of pair
    cards.push({
      id: `${pair.id}-a`,
      pairId: pair.id,
      emoji: pair.emoji,
      isFlipped: false,
      isMatched: false,
      isLocked: false,
    });
    
    // Second card of pair
    cards.push({
      id: `${pair.id}-b`,
      pairId: pair.id,
      emoji: pair.emoji,
      isFlipped: false,
      isMatched: false,
      isLocked: false,
    });
  });
  
  // Shuffle the complete deck
  return fisherYatesShuffle(cards);
};

/**
 * Create a seeded shuffle (for potential future use - deterministic games)
 * Uses a simple LCG (Linear Congruential Generator) for reproducibility
 */
export const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentSeed = seed;
  
  // LCG parameters
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  
  const random = (): number => {
    currentSeed = (a * currentSeed + c) % m;
    return currentSeed / m;
  };
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Verify deck integrity (debug helper)
 * Ensures all pairs are present and counts match
 */
export const verifyDeckIntegrity = (cards: Card[], expectedPairs: number): boolean => {
  const pairCounts = new Map<string, number>();
  
  cards.forEach(card => {
    const count = pairCounts.get(card.pairId) || 0;
    pairCounts.set(card.pairId, count + 1);
  });
  
  // Check each pair has exactly 2 cards
  for (const [pairId, count] of pairCounts) {
    if (count !== 2) {
      console.error(`Pair ${pairId} has ${count} cards instead of 2`);
      return false;
    }
  }
  
  // Check total pair count
  if (pairCounts.size !== expectedPairs) {
    console.error(`Expected ${expectedPairs} pairs, found ${pairCounts.size}`);
    return false;
  }
  
  return true;
};

/**
 * Pre-shuffle multiple decks for performance
 * Useful for preloading levels
 */
export const preShuffleDecks = (
  pairCount: number,
  deckCount: number
): Card[][] => {
  return Array.from({ length: deckCount }, () => generateCardDeck(pairCount));
};
