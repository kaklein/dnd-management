import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";

export interface UsableResources {
    hitPoints: {
        max: number;
        current: number;
        temporary: number;
    };
    hitDice: {
        type: 'd6' | 'd8' | 'd10' | 'd12';
        max: number;
        current: number;
    };
    deathSaves: {
        max: 3;
        successesRemaining: number;
        failuresRemaining: number;
    };
    gold: number;
    inspiration: number;
    spellSlots?: SpellSlot[],
}
