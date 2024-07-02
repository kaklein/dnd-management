export interface Feature {
    name: string;
    description: string;
    source: string; // 'race', 'class', etc.
    maxUses?: number;
    currentUses?: number;
    refresh?: 'shortRest' | 'longRest';
}
