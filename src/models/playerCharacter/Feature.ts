import { RestType } from "@models/enum/RestType";
import { DamageType } from "@models/enum/DamageType";

export interface Feature {
    id: string,
    data: {
        pcId: string;
        name: string;
        description: string;
        source: string; // 'race', 'class', etc.
        maxUses?: number;
        currentUses?: number;
        displayAsPool?: boolean; // whether uses should be displayed as numbered pool
        refresh?: RestType;
        damage?: string;
        damageType?: DamageType;
        saveDC?: number;
        sourceUrl?: string;
    }
   
}
