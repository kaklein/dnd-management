export interface AbilityScores {
    pcId?: string;
    strength: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
        athletics: { proficient: boolean };
    };
    dexterity: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
        acrobatics: { proficient: boolean };
        sleightOfHand: { proficient: boolean };
        stealth: { proficient: boolean };
    };
    constitution: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
    };
    intelligence: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
        arcana: { proficient: boolean };
        history: { proficient: boolean };
        investigation: { proficient: boolean };
        nature: { proficient: boolean };
        religion: { proficient: boolean };
    };
    wisdom: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
        animalHandling: { proficient: boolean };
        insight: { proficient: boolean };
        medicine: { proficient: boolean };
        perception: { proficient: boolean };
        survival: { proficient: boolean };
    };
    charisma: {
        score: number;
        modifier: number;
        savingThrows: { proficient: boolean };
        deception: { proficient: boolean };
        intimidation: { proficient: boolean };
        performance: { proficient: boolean };
        persuasion: { proficient: boolean };
    };
}
