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
    summoned: boolean;
  };  
}