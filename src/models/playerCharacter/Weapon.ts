import { DamageType } from "@models/enum/DamageType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";

export interface Weapon {
    id: string;
    name: string;
    type: string;
    damage: string;
    damageType: DamageType;
    modifierProperty: WeaponModifierProperty;
    magic: boolean;
    description?: string;
}
