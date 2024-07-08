export interface AbilityScores {
    pcId?: string;
    strength: {
        score: number;
        modifier: number;
        savingThrows: number;
        athletics: number;
    };
    dexterity: {
        score: number;
        modifier: number;
        savingThrows: number;
        acrobatics: number;
        sleightOfHand: number;
        stealth: number;
    };
    constitution: {
        score: number;
        modifier: number;
        savingThrows: number;
    };
    intelligence: {
        score: number;
        modifier: number;
        savingThrows: number;
        arcana: number;
        history: number;
        investigation: number;
        nature: number;
        religion: number;
    };
    wisdom: {
        score: number;
        modifier: number;
        savingThrows: number;
        animalHandling: number;
        insight: number;
        medicine: number;
        perception: number;
        survival: number;
    };
    charisma: {
        score: number;
        modifier: number;
        savingThrows: number
        deception: number;
        intimidation: number;
        performance: number;
        persuasion: number;
    };
}
