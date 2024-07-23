import { DamageType } from "@models/enum/DamageType";
import { Ability } from "@models/enum/Ability";

export interface Spell {
    id: string;
    name: string;
    description: string;
    level: SpellLevel;
    spellCastingAbility: Ability;
    damageType?: DamageType;
    damage?: string;
    saveDC?: number;
    attackBonus?: number;
    sourceUrl?: string;
}

export enum SpellLevel {
    'CANTRIP' = 'Cantrip',
    'L1' = 'Level 1',
    'L2' = 'Level 2',
    'L3' = 'Level 3',
    'L4' = 'Level 4',
    'L5' = 'Level 5',
    'L6' = 'Level 6',
    'L7' = 'Level 7',
    'L8' = 'Level 8',
    'L9' = 'Level 9'
}
