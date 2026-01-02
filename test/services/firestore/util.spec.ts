import { getProficiencyBonusByLevel } from '../../../src/services/firestore/utils';
import { expect, test } from 'vitest';

test('getProficiencyBonusByLevel returns correct bonus for given level', () => {
    expect(getProficiencyBonusByLevel(1)).toBe(2);
    expect(getProficiencyBonusByLevel(4)).toBe(2);
    expect(getProficiencyBonusByLevel(5)).toBe(3);
    expect(getProficiencyBonusByLevel(8)).toBe(3);
    expect(getProficiencyBonusByLevel(9)).toBe(4);
    expect(getProficiencyBonusByLevel(12)).toBe(4);
    expect(getProficiencyBonusByLevel(13)).toBe(5);
    expect(getProficiencyBonusByLevel(16)).toBe(5);
    expect(getProficiencyBonusByLevel(17)).toBe(6);
    expect(getProficiencyBonusByLevel(20)).toBe(6);
    expect(() => getProficiencyBonusByLevel(0)).toThrow("Level must be between 1 and 20 inclusive. Level: 0");
});

test('expectSuccessfulTest', () => {
    expect(true).toBe(true);
});