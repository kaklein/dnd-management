import { RestType } from "@models/enum/RestType";
import { DamageType } from "@models/enum/DamageType";

export interface Feature {
    name: string;
    description: string;
    source: string; // 'race', 'class', etc.
    maxUses?: number;
    currentUses?: number;
    refresh?: RestType;
    damage?: string;
    damageType?: DamageType;
    saveDC?: number;
}
