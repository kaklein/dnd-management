import { SummonableAttack } from "./SummonableAttack";

export interface Summonable {
  id: string;
  data: {
    pcId: string;
    type: string;
    name?: string;
    description: string;
    source: {
      type: string; // spell or feature
      name: string;
    };
    hitPoints: {
      max: number;
      current: number;
    };
    armorClass: number;
    abilityScores?: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
      proficiencyBonus?: number | '';
    } | null;
    attacks?: SummonableAttack[];
    summoned: boolean;
  };
}