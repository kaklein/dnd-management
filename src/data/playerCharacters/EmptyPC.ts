import { AbilityScores } from "@models/playerCharacter/AbilityScores"
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter"
import { UsableResources } from "@models/playerCharacter/usableResources/UsableResources"

const emptyAbilityScores: AbilityScores = {
  pcId: 'empty',
  strength: {
    score: 0,
    modifier: 0,
    savingThrows: 0,
    athletics: 0
  },
  dexterity: {
    score: 0,
    modifier: 0,
    savingThrows: 0,
    acrobatics: 0,
    sleightOfHand: 0,
    stealth: 0
  },
  constitution: {
    score: 0,
    modifier: 0, 
    savingThrows: 0
  },
  intelligence: {
    score: 0,
    modifier: 0,
    savingThrows: 0,
    arcana: 0,
    history: 0,
    investigation: 0,
    nature: 0,
    religion: 0
  },
  wisdom: {
    score: 0,
    modifier: 0,
    savingThrows: 0,
    animalHandling: 0,
    insight: 0,
    medicine: 0,
    perception: 0,
    survival: 0
  },
  charisma: {
    score: 0,
    modifier: 0,
    savingThrows: 0,
    deception: 0,
    intimidation: 0,
    performance: 0,
    persuasion: 0
  }
}

const emptyUsableResources: UsableResources = {
  hitPoints: {
    max: 0,
    current: 0,
    temporary: 0
  },
  hitDice: {
    type: 'd6',
    max: 0,
    current: 0
  },
  deathSaves: {
    max: 3,
    successes: 0,
    failures: 0
  },
  gold: 0,
  inspiration: 0
}

export const EmptyPC: PlayerCharacter = {
  baseDetails: {
    pcId: 'empty',
    name: { firstName: 'Loading...', lastName: 'Loading...' },
    description: 'Loading...',
    playerName: 'Loading...',
    class: 'Loading...',
    subclass: 'Loading...',
    race: 'Loading...',
    alignment: 'Loading...',
    background: 'Loading...',
    level: 0,
    xp: undefined,
    proficiencyBonus: 0,
    passiveWisdom: 0,
    armorClass: 0,
    initiative: 0,
    speed: 0,
    equipment: [],
    usableResources: emptyUsableResources,
    weapons: [],
    spells: [],
    features: [],
    imagePaths: {
      avatar: 'Loading...'
    },
    extras: [],
    languages: [],
    proficiencies: []
  },
  abilityScores: emptyAbilityScores
}