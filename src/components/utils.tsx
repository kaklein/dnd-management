import { Ability } from "@models/enum/Ability";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Weapon } from "@models/playerCharacter/Weapon";
import { determineAttackBonus, formatBonus } from "@pages/utils";

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
        damage: `${weapon.damage} ${formatBonus(determineAttackBonus(weapon, pcData), false)}`,
        ['damage type']: weapon.damageType,
        ['modifier property']: weapon.modifierProperty.toLowerCase(),
        magic: weapon.magic,
        ...(weapon.description  && {description: weapon.description})
    }
}

export const getPassiveWisdom = (wisdomModifier: number, perceptionProficiency: boolean, proficiencyBonus: number) => {
    const mod = perceptionProficiency ? wisdomModifier + proficiencyBonus : wisdomModifier;
    return 10 + mod;
}

export const orderAbilityCardElements = (abilityScores: AbilityScores, ability: Ability) => {
    let a;
    switch (ability) {
        case Ability.STR: {
            a = abilityScores.strength;           
            return [
                {
                    name: 'Saving Throws',
                    proficient: a.savingThrows.proficient
                },
                {
                    name: 'Athletics',
                    proficient: a.athletics.proficient
                }
            ]
        }
        case Ability.DEX: {
            a = abilityScores.dexterity;
            return [
                {
                    name: 'Saving Throws',
                    proficient: a.savingThrows.proficient
                },
                {
                    name: 'Acrobatics',
                    proficient: a.acrobatics.proficient
                },
                {
                    name: 'Sleight of Hand',
                    proficient: a.sleightOfHand.proficient
                },
                {
                    name: 'Stealth',
                    proficient: a.stealth.proficient
                }
            ]
        }
        case Ability.CON: {
            a = abilityScores.constitution;
            return [
                {
                    name: 'Saving Throws',
                    proficient: a .savingThrows.proficient
                }
            ]
        }
        case Ability.INT: {
            a = abilityScores.intelligence;
            return [
                {
                    name: 'Saving Throws',
                    proficient: a.savingThrows.proficient
                },
                {
                    name: 'Arcana',
                    proficient: a.arcana.proficient
                },
                {
                    name: 'History',
                    proficient: a.history.proficient
                },
                {
                    name: 'Investigation',
                    proficient: a.investigation.proficient
                },
                {
                    name: 'Nature',
                    proficient: a.nature.proficient
                },
                {
                    name: 'Religion',
                    proficient: a.religion.proficient
                }
            ]
        }
        case Ability.WIS: {
            a = abilityScores.wisdom;
            return [
                {
                    name: 'Saving Throws',
                    proficient: a.savingThrows.proficient
                },
                {
                    name: 'Animal Handling',
                    proficient: a.animalHandling.proficient
                },
                {
                    name: 'Insight',
                    proficient: a.insight.proficient
                },
                {
                    name: 'Medicine',
                    proficient: a.medicine.proficient
                },
                {
                    name: 'Perception',
                    proficient: a.perception.proficient
                },
                {
                    name: 'Survival',
                    proficient: a.survival.proficient
                }
            ]
        }
        case Ability.CHA: {
            a = abilityScores.charisma;
            return [
                {
                    name: 'Saving Throws',
                    proficient: a.savingThrows.proficient
                },
                {
                    name: 'Deception',
                    proficient: a.deception.proficient
                },
                {
                    name: 'Intimidation',
                    proficient: a.intimidation.proficient
                },
                {
                    name: 'Performance',
                    proficient: a.performance.proficient
                },
                {
                    name: 'Persuasion',
                    proficient: a.persuasion.proficient
                }
            ]
        }
    }
}

export const capitalize = (s: string) => {
    return (`${s.substring(0,1).toUpperCase()}${s.substring(1)}`)
}

export const buildProficiencyForms = (formData: any, abilityName: string, skills: string[], handleChange: (event: any, setFormData: any) => void, setFormData: any) => {
    skills.unshift(`${abilityName}ST`);
    return (
        <>
        <p><b>Proficiencies:</b></p>
        {
            skills.map((skill, i) => (
                <div key={i}>
                    <label htmlFor={skill}>
                        {skill == `${abilityName}ST` ? 'Saving Throws' : capitalize(skill)}
                    </label>
                    <input
                        id={skill}
                        name={skill}
                        type="checkbox"
                        checked={formData[skill] === "true"}
                        onChange={(event) => {
                            event.target.value = event.target.value === "on" ? "true" : "false";
                            handleChange(event, setFormData)
                        }}
                    />
                </div>
            ))
        }
        </>
        
    )
}