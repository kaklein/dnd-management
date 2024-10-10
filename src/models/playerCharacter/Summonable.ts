import { RestType } from "@models/enum/RestType";

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
    maxUses?: number;
    currentUses?: number;
    refresh?: RestType;
    armorClass: number;
    summoned: boolean;
  };  
}