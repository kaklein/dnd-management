import {SpellLevel} from "../Spell";

export interface SpellSlot {
    level: SpellLevel;
    max: number;
    current: number;
}
