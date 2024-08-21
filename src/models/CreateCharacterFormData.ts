export interface CreateCharacterFormData {
  firstName: string;
  lastName: string;
  playerName: string;
  class: string;
  race: string;
  alignment: string;
  background: string;
  level: number;
  armorClass: number;
  speed: number;
  hitPointMaximum: number;
  hitDiceType: string; // TODO - stricter typing? options or regex
  gold: number;
  strengthScore: number;
  strengthST: "true" | "false";
  athletics: "true" | "false";
  dexterityScore: number;
  dexterityST: "true" | "false";
  acrobatics: "true" | "false";
  sleightOfHand: "true" | "false";
  stealth: "true" | "false";
  constitutionScore: number;
  constitutionST: "true" | "false";
  intelligenceScore: number;
  intelligenceST: "true" | "false";
  arcana: "true" | "false";
  history: "true" | "false";
  investigation: "true" | "false";
  nature: "true" | "false";
  religion: "true" | "false";
  wisdomScore: number;
  wisdomST: "true" | "false";
  animalHandling: "true" | "false";
  insight: "true" | "false";
  medicine: "true" | "false";
  perception: "true" | "false";
  survival: "true" | "false";
  charismaScore: number;
  charismaST: "true" | "false";
  deception: "true" | "false";
  intimidation: "true" | "false";
  performance: "true" | "false";
  persuasion: "true" | "false";
  // optional fields
  description?: string // optional
  subclass?: string;
  xp?: number;
}