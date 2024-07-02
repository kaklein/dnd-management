import {DamageType} from "../enum/DamageType";

export interface Weapon {
    name: string;
    type: string;
    damage: string; // e.g. '1d6 + 5'
    damageType: DamageType;
    magic: boolean;
    description?: string;
}
