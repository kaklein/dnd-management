import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { Weapon } from "@models/playerCharacter/Weapon";
import { Spell } from "@models/playerCharacter/Spell";
import { Equipment } from "@models/playerCharacter/Equipment";
import { Feature } from "@models/playerCharacter/Feature";
import { UsableResources } from "@models/playerCharacter/usableResources/UsableResources";
import { SpellSlot } from "./usableResources/SpellSlot";

export interface PlayerCharacter {
    baseDetails: BaseDetails;
    abilityScores: AbilityScores;
    features: Feature[];
    spellSlots?: SpellSlot[];
}

export interface BaseDetails {
    pcId: string;
    uid: string;
    name: { firstName: string, lastName: string };
    description?: string;
    class: string;
    subclass?: string;
    race: string;
    alignment: string;
    background: string;
    level: number;
    xp: number | undefined;
    proficiencyBonus: number,
    armorClass: number;
    speed: number;
    equipment: Equipment[];
    usableResources: UsableResources;
    weapons: Weapon[];
    spells?: Spell[];
    imagePaths?: {
        avatar?: string;
        other?: string;
    };
    notes?: string[];
    languages: string[];
    proficiencies: string[];
}
