import { describe, it, expect } from 'vitest';
import {
    calculateComboMultiplier,
    calculateTimeBonus,
    calculateAccuracyBonus,
    calculateMatchScore,
    updateComboOnMatch,
    resetComboOnMismatch
} from '../scoring';
import { CONSTANTS } from '@/types';

describe('Scoring Logic', () => {
    describe('calculateComboMultiplier', () => {
        it('should return 1 for 0 or negative consecutive matches', () => {
            expect(calculateComboMultiplier(0)).toBe(1);
            expect(calculateComboMultiplier(-1)).toBe(1);
        });

        it('should increment multiplier based on consecutive matches', () => {
            // 1 + (1 * 0.1) = 1.1
            expect(calculateComboMultiplier(1)).toBe(1.1);
            // 1 + (5 * 0.1) = 1.5
            expect(calculateComboMultiplier(5)).toBe(1.5);
        });

        it('should cap at MAX_COMBO_MULTIPLIER', () => {
            // 1 + (50 * 0.1) = 6.0, but capped at 3.0
            expect(calculateComboMultiplier(50)).toBe(CONSTANTS.MAX_COMBO_MULTIPLIER);
        });
    });

    describe('calculateTimeBonus', () => {
        it('should calculate bonus based on time remaining', () => {
            // 10s remaining * 10 pts/s = 100
            const bonus = calculateTimeBonus(20000, 30);
            expect(bonus).toBe(100);
        });

        it('should return 0 if time limit exceeded', () => {
            const bonus = calculateTimeBonus(40000, 30);
            expect(bonus).toBe(0);
        });

        it('should provide dynamic bonus when no time limit exists', () => {
            const bonusFast = calculateTimeBonus(10000, null); // 10s
            const bonusSlow = calculateTimeBonus(20000, null); // 20s
            expect(bonusFast).toBeGreaterThan(bonusSlow);
        });
    });

    describe('updateComboOnMatch', () => {
        it('should increment consecutive matches and update multiplier', () => {
            const initialState = { multiplier: 1, consecutiveMatches: 0, maxCombo: 1 };
            const nextState = updateComboOnMatch(initialState);

            expect(nextState.consecutiveMatches).toBe(1);
            expect(nextState.multiplier).toBe(1.1);
            expect(nextState.maxCombo).toBe(1);
        });

        it('should update maxCombo if new sequence is longer', () => {
            const state = { multiplier: 1.5, consecutiveMatches: 5, maxCombo: 5 };
            const nextState = updateComboOnMatch(state);

            expect(nextState.consecutiveMatches).toBe(6);
            expect(nextState.maxCombo).toBe(6);
        });
    });

    describe('resetComboOnMismatch', () => {
        it('should reset multiplier and consecutive matches but keep maxCombo', () => {
            const state = { multiplier: 2.0, consecutiveMatches: 10, maxCombo: 10 };
            const nextState = resetComboOnMismatch(state);

            expect(nextState.multiplier).toBe(1);
            expect(nextState.consecutiveMatches).toBe(0);
            expect(nextState.maxCombo).toBe(10);
        });
    });
});
