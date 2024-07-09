import { SpellLevel } from "@models/playerCharacter/Spell";

export interface SpellSlot {
    level: SpellLevel;
    max: number;
    current: number;
}
