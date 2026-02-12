import { describe, it, expect, vi } from 'vitest';
import {
    initializeGame,
    initializeLevel,
    canFlipCard,
    flipCard,
    checkForMatch,
    handleMatch,
    handleMismatch,
    isLevelComplete
} from '../gameEngine';
import { GameState, Card } from '@/types';

describe('Game Engine', () => {
    describe('initializeGame', () => {
        it('should return a fresh game state', () => {
            const state = initializeGame() as GameState;
            expect(state.currentLevel).toBe(1);
            expect(state.score).toBe(0);
            expect(state.gameStatus).toBe('idle');
            expect(state.cards).toEqual([]);
        });
    });

    describe('card flipping logic', () => {
        const mockCard: Card = {
            id: 'card1',
            pairId: 'pairA',
            content: 'A',
            isFlipped: false,
            isMatched: false,
            isLocked: false
        };

        const mockState: GameState = {
            ...initializeGame(),
            cards: [mockCard],
            gameStatus: 'playing',
            isInteractionLocked: false,
            flippedCards: []
        } as GameState;

        it('should allow flipping a valid card', () => {
            expect(canFlipCard(mockState, 'card1')).toBe(true);
        });

        it('should not allow flipping if interaction is locked', () => {
            const lockedState = { ...mockState, isInteractionLocked: true };
            expect(canFlipCard(lockedState, 'card1')).toBe(false);
        });

        it('should not allow flipping if already 2 cards flipped', () => {
            const busyState = { ...mockState, flippedCards: ['c2', 'c3'] };
            expect(canFlipCard(busyState, 'card1')).toBe(false);
        });

        it('should update state when flipping a card', () => {
            const result = flipCard(mockState, 'card1') as Partial<GameState>;
            expect(result.flippedCards).toContain('card1');
            expect(result.moveCount).toBe(0);

            const flippedCard = result.cards?.find(c => c.id === 'card1');
            expect(flippedCard?.isFlipped).toBe(true);
        });
    });

    describe('matching logic', () => {
        it('should identify a match', () => {
            const state: GameState = {
                cards: [
                    { id: '1', pairId: 'A', content: 'A', isFlipped: true, isMatched: false, isLocked: false },
                    { id: '2', pairId: 'A', content: 'A', isFlipped: true, isMatched: false, isLocked: false }
                ],
                flippedCards: ['1', '2']
            } as any;

            const { isMatch } = checkForMatch(state);
            expect(isMatch).toBe(true);
        });

        it('should handle a successful match', () => {
            const state: GameState = {
                cards: [
                    { id: '1', pairId: 'A', content: 'A', isFlipped: true, isMatched: false, isLocked: false },
                    { id: '2', pairId: 'A', content: 'A', isFlipped: true, isMatched: false, isLocked: false }
                ],
                flippedCards: ['1', '2'],
                score: 0,
                comboMultiplier: 1,
                consecutiveMatches: 0,
                matchCount: 0,
                matchedCards: [],
                sessionStats: { totalMatches: 0, bestCombo: 0 }
            } as any;

            const result = handleMatch(state);
            expect(result.score).toBeGreaterThan(0);
            expect(result.matchCount).toBe(1);
            expect(result.matchedCards).toHaveLength(2);

            const matchedCard = result.cards?.find(c => c.id === '1');
            expect(matchedCard?.isMatched).toBe(true);
            expect(matchedCard?.isLocked).toBe(true);

            // Regression check: Ensure game is unlocked after match
            expect(result.isInteractionLocked).toBe(false);
            expect(result.gameStatus).toBe('playing');
        });

        it('should handle a mismatch and unlock interaction', () => {
            const state: GameState = {
                cards: [
                    { id: '1', pairId: 'A', content: 'A', isFlipped: true, isMatched: false, isLocked: false },
                    { id: '2', pairId: 'B', content: 'B', isFlipped: true, isMatched: false, isLocked: false }
                ],
                flippedCards: ['1', '2'],
                score: 0,
                comboMultiplier: 1,
                consecutiveMatches: 0,
                mismatchCount: 0,
                sessionStats: { totalMismatches: 0 }
            } as any;

            const result = handleMismatch(state);
            expect(result.isInteractionLocked).toBe(false);
            expect(result.gameStatus).toBe('playing');
            expect(result.cards?.find(c => c.id === '1')?.isFlipped).toBe(false);
        });
    });
});
