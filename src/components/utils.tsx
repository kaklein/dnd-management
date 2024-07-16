import { Ability } from "@models/enum/Ability";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Weapon } from "@models/playerCharacter/Weapon";
import { determineAttackBonus } from "@pages/utils";

const replaceBooleans = (data: object) => {
    const entries = Object.entries(data);
    for (const entry of entries) {
        if(typeof entry[1] === "boolean") {
            entry[1] = entry[1] ? "true" : "false"
        }
    }
    return entries;
}

export const formatDataAsTable = (data: object, highlightNonZeroes=false, plusNonZeroes=false) => {
    const entries = replaceBooleans(data);

    return (
        <table className="table">
            <tbody>
                {
                    entries.map((entry, i) => (
                        <tr className={highlightNonZeroes && entry[1] > 0 ? 'table-success' : 'table'} key={i}>
                            <td>{ entry[0].toUpperCase() + ':' }</td>
                            <td>{ (entry [1] > 0 && plusNonZeroes) && '+'}{entry[1]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
};

export const removeWhiteSpaceAndConvertToLowerCase = (s: string) => {
    return s.replace(/\s/g, '').toLowerCase();
};

export const formatBaseDetailsUpdates = (formData: any) => {
    return { 
        'usableResources.hitPoints.current': Number(formData.hitPointsCurrent),
        'usableResources.hitPoints.temporary': Number(formData.hitPointsTemporary),
        'usableResources.hitDice.current': Number(formData.hitDiceCurrent),
        'usableResources.deathSaves.successesRemaining': Number(formData.deathSavesSuccesses),
        'usableResources.deathSaves.failuresRemaining': Number(formData.deathSavesFailures),
        'usableResources.gold': Number(formData.gold),
        'usableResources.inspiration': Number(formData.inspiration),
    };
};

export const buildFeatureCurrentUsesKey = (feature: Feature) => {
    return `feature_${feature.id}_currentUses`;
}

export const getFeatureFormData = (features: Feature[]) => {
    const array = features.map(f => (
        [buildFeatureCurrentUsesKey(f), f.data.currentUses]
    ));
    return Object.fromEntries(array);
};

export const buildSpellSlotsCurrentKey = (spellSlot: SpellSlot) => {
    return `spellSlot_${spellSlot.id}_current`;
};

export const getSpellSlotFormData = (spellSlots: SpellSlot[]) => {
    const array = spellSlots.map(s => (
        [buildSpellSlotsCurrentKey(s), s.data.current]
    ));
    return Object.fromEntries(array);
};

export const formatFeaturesUpdates = (formData: any): {docId: string, updates: { currentUses: number }}[] => {
    const keys = Object.keys(formData);
    const featureKeys = keys.filter(k => k.substring(0,7) === 'feature'); // full keys e.g. feature_1234567_currentUses
    let updates = [];
    for (const key of featureKeys) {
        updates.push({
            docId: key.split('_')[1],
            updates: {
                currentUses: Number(formData[key])
            }
        })
    }
    return updates;
}

export const formatSpellSlotsUpdates = (formData: any): {docId: string, updates: { current: number }}[] => {
    const keys = Object.keys(formData);
    const spellSlotKeys = keys.filter(k => k.substring(0,9) === 'spellSlot'); // full keys e.g. spellSlot_1234567_current
    let updates = [];
    for (const key of spellSlotKeys) {
        updates.push({
            docId: key.split('_')[1],
            updates: {
                current: Number(formData[key])
            }
        })
    }
    return updates;
}


export const orderAndFormatWeaponElements = (weapon: Weapon, pcData: PlayerCharacter) => {
    return {
        name: weapon.name,
        type: weapon.type,
        damage: `${weapon.damage} + ${determineAttackBonus(weapon, pcData)}`,
        ['damage type']: weapon.damageType,
        ['modifier property']: weapon.modifierProperty.toLowerCase(),
        magic: weapon.magic,
        ...(weapon.description  && {description: weapon.description})
    }
}

export const orderAbilityCardElements = (abilityScores: AbilityScores, ability: Ability) => {
    switch (ability) {
        case Ability.STR: {
            return {
                ['Saving Throws']: abilityScores.strength.savingThrows,
                athletics: abilityScores.strength.athletics
            }
        }
        case Ability.DEX: {
            return {
                ['Saving Throws']: abilityScores.dexterity.savingThrows,
                acrobatics: abilityScores.dexterity.acrobatics,
                ['Sleight of Hand']: abilityScores.dexterity.sleightOfHand,
                stealth: abilityScores.dexterity.stealth
            }
        }
        case Ability.CON: {
            return {
                ['Saving Throws']: abilityScores.constitution.savingThrows,
            }
        }
        case Ability.INT: {
            return {
                ['Saving Throws']: abilityScores.intelligence.savingThrows,
                arcana: abilityScores.intelligence.arcana,
                history: abilityScores.intelligence.history,
                investigation: abilityScores.intelligence.investigation,
                nature: abilityScores.intelligence.nature,
                religion: abilityScores.intelligence.religion
            }
        }
        case Ability.WIS: {
            return {
                ['Saving Throws']: abilityScores.wisdom.savingThrows,
                ['Animal Handling']: abilityScores.wisdom.animalHandling,
                insight: abilityScores.wisdom.insight,
                medicine: abilityScores.wisdom.medicine,
                perception: abilityScores.wisdom.perception,
                survival: abilityScores.wisdom.survival
            }
        }
        case Ability.CHA: {
            return {
                ['Saving Throws']: abilityScores.charisma.savingThrows,
                deception: abilityScores.charisma.deception,
                intimidation: abilityScores.charisma.intimidation,
                performance: abilityScores.charisma.performance,
                persuasion: abilityScores.charisma.persuasion
            }
        }
    }
}

export const capitalize = (s: string) => {
    return (`${s.substring(0,1).toUpperCase()}${s.substring(1)}`)
}