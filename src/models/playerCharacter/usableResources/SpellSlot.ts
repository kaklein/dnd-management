import { SpellLevel } from "@models/playerCharacter/Spell";

export interface SpellSlot {
    id: string,
    data: {
        pcId: string;
        level: SpellLevel;
        max: number;
        current: number;
    }
}
