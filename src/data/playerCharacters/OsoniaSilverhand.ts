import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { DamageType } from "@models/enum/DamageType";
import { Ability } from "@models/enum/Ability";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { Equipment } from "@models/playerCharacter/Equipment";
import { Weapon } from "@models/playerCharacter/Weapon";
import { Feature } from "@models/playerCharacter/Feature";
import { UsableResources } from "@models/playerCharacter/usableResources/UsableResources";
import { RestType } from "@models/enum/RestType";

const abilityScores: AbilityScores = {
    pcId: '6d40e673-3a6e-428c-913d-800c9ec21631',
    strength: {
        score: 14,
        modifier: 2,
        savingThrows: 4,
        athletics: 4
    },
    dexterity: {
        score: 18,
        modifier: 3,
        savingThrows: 0,
        acrobatics: 5,
        sleightOfHand: 0,
        stealth: 0
    },
    constitution: {
        score: 14,
        modifier: 2,
        savingThrows: 4
    },
    intelligence: {
        score: 14,
        modifier: 1,
        savingThrows: 0,
        arcana: 3,
        history: 0,
        investigation: 3,
        nature: 0,
        religion: 0
    },
    wisdom: {
        score: 11,
        modifier: 0,
        savingThrows: 0,
        animalHandling: 0,
        insight: 0,
        medicine: 0,
        perception: 2,
        survival: 0
    },
    charisma: {
        score: 11,
        modifier: 0,
        savingThrows: 0,
        deception: 0,
        intimidation: 0,
        performance: 0,
        persuasion: 0
    }
};

const equipment: Equipment[] = [
    {
        type: 'Breastplate',
        description: 'AC 14 + DEX modifier (max 2). No stealth disadvantage.'
    },
    {
        type: "Dungeoneer's pack",
        description: 'Backpack, crowbar, hammer, piton (10), torch (10), tinderbox, rations (10), waterskin, hempen rope'
    },
    {
        type: "Smith's tools"
    },
    {
        type: "Traveler's clothes"
    }
];

const resources: UsableResources = {
    hitPoints: {
        max: 29,
        current: 29,
        temporary: 0
    },
    hitDice: {
        type: 'd10',
        max: 3,
        current: 3
    },
    deathSaves: {
        max: 3,
        successes: 0,
        failures: 0
    },
    gold: 135,
    inspiration: 0
};

const weapons: Weapon[] = [
    {
        name: 'Sword of the Forge',
        type: 'shortsword',
        damage: '1d6 + 5',
        damageType: DamageType.PIERCING,
        magic: true,
        description: 'A beautifully crafted sword with an orange-red gem at the center of the cross-guard. Grants the spell Heat Metal once per long rest.'
    },
    {
        name: 'Silver Scimitar',
        type: 'scimitar',
        damage: '1d6 + 5',
        damageType: DamageType.SLASHING,
        magic: false
    },
    {
        name: 'Basic crossbow',
        type: 'Light crossbow',
        damage: '1d8 + 5',
        damageType: DamageType.PIERCING,
        magic: false
    }
];

const spells: Spell[] = [
    {
        name: 'Mending',
        description: `
            Casting Time: 1 minute.
            Range: Touch.
            Target: A single break or tear in an object you touch.
            Components: V S M (Two lodestones).
            Duration: Instantaneous.
            Classes: Artificer, Bard, Cleric, Druid, Sorcerer, Wizard.
            This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.
            This spell can physically repair a magic item or construct, but the spell can’t restore magic to such an object.`,
        level: SpellLevel.CANTRIP,
        spellCastingAbility: Ability.INT
    }
]

const features: Feature[] = [
    {
        name: "Giant's Might",
        description: `
            At 3rd level, you have learned how to imbue yourself with the might of giants. As a bonus action, you magically gain the following benefits, which last for 1 minute:
            If you are smaller than Large, you become Large, along with anything you are wearing. If you lack the room to become Large, your size doesn't change.
            You have advantage on Strength checks and Strength saving throws.
            Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d6 damage to a target on a hit.
            You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.`,
        source: 'Rune Knight',
        maxUses: 2,
        currentUses: 2,
        refresh: RestType.LONG
    },
    {
        name: 'Fire Rune',
        description: `
            This rune's magic channels the masterful craftsmanship of great smiths. While wearing or carrying an object inscribed with this rune, your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool.
            In addition, when you hit a creature with an attack using a weapon, you can invoke the rune to summon fiery shackles: the target takes an extra 2d6 fire damage, and it must succeed on a Strength saving throw or be restrained for 1 minute.
            While restrained by the shackles, the target takes 2d6 fire damage at the start of each of its turns. The target can repeat the saving throw at the end of each of its turns, banishing the shackles on a success. Once you invoke this rune, you can't do so again until you finish a short or long rest.`,
        source: 'Rune Knight',
        maxUses: 1,
        currentUses: 1,
        refresh: RestType.SHORT,
        saveDC: 8 + 2 + abilityScores.constitution.modifier
    },
    {
        name: 'Cloud Rune',
        description: `
            This rune emulates the deceptive magic used by some cloud giants. While wearing or carrying an object inscribed with this rune, you have advantage on Dexterity (Sleight of Hand) checks and Charisma (Deception) checks.
            In addition, when you or a creature you can see within 30 feet of you is hit by an attack roll, you can use your reaction to invoke the rune and choose a different creature within 30 feet of you, other than the attacker.
            The chosen creature becomes the target of the attack, using the same roll. This magic can transfer the attack's effects regardless of the attack's range. Once you invoke this rune, you can't do so again until you finish a short or long rest.`,
        source: 'Rune Knight',
        maxUses: 1,
        currentUses: 1,
        refresh: RestType.SHORT
    },
    {
        name: 'Heat Metal',
        description: `
            Casting Time: 1 action.
            Range: 60 feet.
            Components: V, S, M (a piece of iron and a flame).
            Duration: Concentration, up to 1 minute.
            Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot.
            Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again.
            If a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn't drop the object, it has disadvantage on attack rolls and ability checks until the start of your next turn.`,
        source: weapons[0].name,
        maxUses: 1,
        currentUses: 1,
        refresh: RestType.LONG,
        saveDC: 8 + 2 + abilityScores.intelligence.modifier
    },
    {
        name: 'Action Surge',
        description: `
            Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.
            Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.`,
        source: 'Fighter',
        maxUses: 1,
        currentUses: 1,
        refresh: RestType.SHORT
    },
    {
        name: 'Second Wind',
        description: `
            You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.
            Once you use this feature, you must finish a short or long rest before you can use it again.`,
        source: 'Fighter',
        maxUses: 1,
        currentUses: 1,
        refresh: RestType.SHORT
    },
    {
        name: 'Two-Weapon Fighting',
        description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
        source: 'Fighter'
    },
    {
        name: 'Darkvision',
        description: `
            Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.
            You can't discern color in darkness, only shades of gray.`,
        source: 'Elf'
    },
    {
        name: 'Fey Ancestry',
        description: "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
        source: 'Elf'
    }
];

export const OsoniaSilverhand: PlayerCharacter = {
    baseDetails: {
        pcId: '6d40e673-3a6e-428c-913d-800c9ec21631',
        name: { firstName: 'Osonia', lastName: 'Silverhand'},
        playerName: 'Katie',
        class: 'Fighter',
        subclass: 'Rune Knight',
        race: 'High Elf',
        alignment: 'Neutral Good',
        background: 'Blacksmith',
        level: 3,
        xp: undefined,
        proficiencyBonus: 2,
        passiveWisdom: 12,
        armorClass: 16,
        initiative: 3,
        speed: 30,
        equipment: equipment, // from sep. col
        usableResources: resources, // from sep. col
        weapons: weapons, // from sep. col
        spells: spells, // from sep. col
        features: features, // from sep. col
        imagePaths: {
            avatar: 'osonia_silverhand.png'
        }, // from sep. col
        extras: [
            'RUNE KNIGHT: If a rune requires a saving throw, your Rune Magic save DC equals 8 + your proficiency bonus + your Constitution modifier.',
            'RUNE KNIGHT: Whenever you finish a long rest, you can touch a number of objects equal to the number of runes you know, and you inscribe a different rune onto each of the objects. To be eligible, an object must be a weapon, a suit of armor, a shield, a piece of jewelry, or something else you can wear or hold in a hand. Your rune remains on an object until you finish a long rest, and an object can bear only one of your runes at a time.'
        ],
        languages: [
            'Common',
            'Elvish',
            'Dwarvish',
            'Gnomish',
            'Divine Script'
        ],
        proficiencies: [
            "Smith's tools",
            "Jeweler's tools"
        ]
    },
    abilityScores: abilityScores, // from sep. col
    
}
