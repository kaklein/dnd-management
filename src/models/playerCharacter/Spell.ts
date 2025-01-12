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
    hasSaveDC?: boolean;
    hasAttack?: boolean;
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

export enum SpellLevelAbbreviation {
    'Cantrip' = 'CANTRIP',
    'Level 1' = 'L1',
    'Level 2' = 'L2',
    'Level 3' = 'L3',
    'Level 4' = 'L4',
    'Level 5' = 'L5',
    'Level 6' = 'L6',
    'Level 7' = 'L7',
    'Level 8' = 'L8',
    'Level 9' = 'L9'
}
