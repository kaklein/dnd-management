import {AbilityScores} from "./AbilityScores";
import {UsableResources} from "./usableResources";
import {Weapon} from "./Weapon";
import {Spell} from "./Spell";
import {Ability} from "../enum/Ability";
import {Equipment} from "./Equipment";
import {Feature} from "./Feature";
import {UsableResources} from "./usableResources/UsableResources";

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
    usableResources: UsableResources;
    weapons: Weapon[];
    spells?: Spell[];
    features: Feature[];
    imagePaths: {
        avatar: string;
        other?: string;
    };
    extras?: string[];
    languages: string[];
    proficiencies: string[];
}
