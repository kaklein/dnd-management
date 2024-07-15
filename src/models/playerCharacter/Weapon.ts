import { DamageType } from "@models/enum/DamageType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";

export interface Weapon {
    name: string;
    type: string;
    damage: string; // e.g. '1d6 + 5'
    damageType: DamageType;
    modifierProperty: WeaponModifierProperty;
    magic: boolean;
    description?: string;
}
