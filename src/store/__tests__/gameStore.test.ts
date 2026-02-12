import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';

describe('Game Store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Reset store before each test
        const { resetGame } = useGameStore.getState();
        resetGame();
    });

    it('should initialize with default state', () => {
        const state = useGameStore.getState();
        expect(state.currentLevel).toBe(1);
        expect(state.score).toBe(0);
        expect(state.gameStatus).toBe('idle');
    });

    it('should start a level correctly', () => {
        const { startLevel } = useGameStore.getState();
        startLevel(1);

        // Run timeouts for startLevel's internal startPreview
        vi.runAllTimers();

        const state = useGameStore.getState();
        expect(state.gameStatus).toBe('preview');
        expect(state.cards.length).toBeGreaterThan(0);
        expect(state.isInteractionLocked).toBe(true);
    });

    it('should allow flipping cards after preview ends', () => {
        const { startLevel, flipCard, tick } = useGameStore.getState();
        startLevel(1);

        // Fast forward through preview setup
        vi.runAllTimers();

        // Level 1 preview is usually a few seconds.
        // End preview by ticking
        tick(10000);

        const stateAfterPreview = useGameStore.getState();
        expect(stateAfterPreview.gameStatus).toBe('playing');

        const firstCardId = stateAfterPreview.cards[0].id;
        flipCard(firstCardId);

        const stateAfterFlip = useGameStore.getState();
        expect(stateAfterFlip.flippedCards).toContain(firstCardId);
        expect(stateAfterFlip.cards.find(c => c.id === firstCardId)?.isFlipped).toBe(true);
    });
});
