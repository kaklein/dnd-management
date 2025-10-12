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
        tags?: FeatureTag[];
    }
}

export interface FeatureTag {
    fieldName: string;
    displayName: string;
    value: boolean;
}

export const AllowedFeatureTags: {fieldName: string, displayName: string}[] = [
    {
        fieldName: 'action',
        displayName: 'Action',
    },
    {
        fieldName: 'bonusAction',
        displayName: 'Bonus Action',
    },    
    {
        fieldName: 'reaction',
        displayName: 'Reaction'
    },
    {
        fieldName: 'concentration',
        displayName: 'Concentration',
    },
]
