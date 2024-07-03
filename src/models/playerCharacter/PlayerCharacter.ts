import {AbilityScores} from "./AbilityScores";
import {Resources} from "./Resources";
import {Weapon} from "./Weapon";
import {Spell} from "./Spell";
import {Ability} from "../enum/Ability";
import {Equipment} from "./Equipment";
import {Feature} from "./Feature";

export interface PlayerCharacter {
    name: { firstName: string, lastName: string };
    playerName: string;
    class: string;
    subclass: string;
    race: string;
    alignment: string;
    background: string;
    level: number;
    xp: number | undefined;
    abilityScores: AbilityScores;
    proficiencyBonus: number,
    passiveWisdom: number,
    armorClass: number;
    initiative: number;
    speed: number;
    equipment: Equipment[];
    resources: Resources;
    weapons: Weapon[];
    spellCasting?: {
        ability: Ability;
        saveDC?: number;
        attackBonus?: number;
        spells: Spell[];
    };
    features: Feature[];
    imagePaths: {
        avatar: string;
        other?: string;
    }
}
