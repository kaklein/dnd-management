import { Ability } from "@models/enum/Ability";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { Summonable } from "@models/playerCharacter/Summonable";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Weapon } from "@models/playerCharacter/Weapon";
import { determineAttackBonus, emptyRichTextContent, formatBonus } from "@pages/utils";

export const replaceBooleans = (data: object) => {
    const entries = Object.entries(data);
    for (const entry of entries) {
        if(typeof entry[1] === "boolean") {
            entry[1] = entry[1] ? "true" : "false"
        }
    }
    return Object.fromEntries(entries);
}

export const formatDataAsTable = (data: object, highlightNonZeroes=false, plusNonZeroes=false) => {
    const entries = Object.entries(replaceBooleans(data));

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
        armorClass: Number(formData.armorClass)
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

export const buildSummonableSummonedKey = (summonable: Summonable) => {
    return `summonable_${summonable.id}_summoned`;
};

export const getSummonablesSummoned = (summonables: Summonable[]) => {
    const array = summonables.map(s => (
        [buildSummonableSummonedKey(s), s.data.summoned]
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

export const isSpellSlotKey = (k: string) => {
    return k.substring(0,9) === 'spellSlot'; // full keys e.g. spellSlot_1234567_current
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

export const formatSummonablesUpdates = (formData: any): {docId: string, updates: {currentUses: number}}[] => {
    const keys = Object.keys(formData);
    const currentUsesKeys = keys.filter(k => (k.substring(0, 10) === 'summonable' && k.substring(k.length - 11) === 'currentUses'));
    let updates = [];
    for (const key of currentUsesKeys) {
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
    const spellSlotKeys = keys.filter(k => isSpellSlotKey(k));
    let updates = [];
    for (const key of spellSlotKeys) {
        updates.push({
            docId: key.split('_')[1],
            updates: {
                current: Math.max(Number(formData[key]), 0)
            }
        })
    }
    return updates;
}

export const orderAndFormatWeaponElements = (weapon: Weapon, pcData: PlayerCharacter) => {
    return {
        type: weapon.type,
        damage: `${weapon.damage} ${formatBonus(determineAttackBonus(weapon, pcData), false)}`,
        ['damage type']: weapon.damageType,
        ...(weapon.bonus && { bonus: `+${weapon.bonus}` }),
        ['modifier property']: weapon.modifierProperty.toLowerCase(),
        magic: weapon.magic,
        ...((weapon.description && weapon.description != emptyRichTextContent) && {description: <div className="long-text-display no-overflow left-justify" dangerouslySetInnerHTML={{__html: weapon.description}}/>
        })
    }
}

export const getPassiveWisdom = (wisdomModifier: number, perceptionProficiency: boolean, proficiencyBonus: number) => {
    const mod = perceptionProficiency ? wisdomModifier + proficiencyBonus : wisdomModifier;
    return 10 + mod;
}

export const orderAbilityCardElements = (abilityScores: AbilityScores, ability: Ability) => {
    const { data } = abilityScores;
    let a;
    switch (ability) {
        case Ability.STR: {
            a = data.strength;           
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'strengthST',
                    proficient: a.savingThrows.proficient
                },
                {
                    displayName: 'Athletics',
                    formFieldName: 'athletics',
                    proficient: a.athletics.proficient
                }
            ]
        }
        case Ability.DEX: {
            a = data.dexterity;
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'dexterityST',
                    proficient: a.savingThrows.proficient
                },
                {
                    displayName: 'Acrobatics',
                    formFieldName: 'acrobatics',
                    proficient: a.acrobatics.proficient
                },
                {
                    displayName: 'Sleight of Hand',
                    formFieldName: 'sleightOfHand',
                    proficient: a.sleightOfHand.proficient
                },
                {
                    displayName: 'Stealth',
                    formFieldName: 'stealth',
                    proficient: a.stealth.proficient
                }
            ]
        }
        case Ability.CON: {
            a = data.constitution;
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'constitutionST',
                    proficient: a .savingThrows.proficient
                }
            ]
        }
        case Ability.INT: {
            a = data.intelligence;
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'intelligenceST',
                    proficient: a.savingThrows.proficient
                },
                {
                    displayName: 'Arcana',
                    formFieldName: 'arcana',
                    proficient: a.arcana.proficient
                },
                {
                    displayName: 'History',
                    formFieldName: 'history',
                    proficient: a.history.proficient
                },
                {
                    displayName: 'Investigation',
                    formFieldName: 'investigation',
                    proficient: a.investigation.proficient
                },
                {
                    displayName: 'Nature',
                    formFieldName: 'nature',
                    proficient: a.nature.proficient
                },
                {
                    displayName: 'Religion',
                    formFieldName: 'religion',
                    proficient: a.religion.proficient
                }
            ]
        }
        case Ability.WIS: {
            a = data.wisdom;
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'wisdomST',
                    proficient: a.savingThrows.proficient
                },
                {
                    displayName: 'Animal Handling',
                    formFieldName: 'animalHandling',
                    proficient: a.animalHandling.proficient
                },
                {
                    displayName: 'Insight',
                    formFieldName: 'insight',
                    proficient: a.insight.proficient
                },
                {
                    displayName: 'Medicine',
                    formFieldName: 'medicine',
                    proficient: a.medicine.proficient
                },
                {
                    displayName: 'Perception',
                    formFieldName: 'perception',
                    proficient: a.perception.proficient
                },
                {
                    displayName: 'Survival',
                    formFieldName: 'survival',
                    proficient: a.survival.proficient
                }
            ]
        }
        case Ability.CHA: {
            a = data.charisma;
            return [
                {
                    displayName: 'Saving Throws',
                    formFieldName: 'charismaST',
                    proficient: a.savingThrows.proficient
                },
                {
                    displayName: 'Deception',
                    formFieldName: 'deception',
                    proficient: a.deception.proficient
                },
                {
                    displayName: 'Intimidation',
                    formFieldName: 'intimidation',
                    proficient: a.intimidation.proficient
                },
                {
                    displayName: 'Performance',
                    formFieldName: 'performance',
                    proficient: a.performance.proficient
                },
                {
                    displayName: 'Persuasion',
                    formFieldName: 'persuasion',
                    proficient: a.persuasion.proficient
                }
            ]
        }
    }
}

export const capitalize = (s: string) => {
    if (!s) return;
    return (`${s.substring(0,1).toUpperCase()}${s.substring(1)}`);
}

export const toCamelCase = (s: string): string => {
    const splitOnSpace = s.split(' ');
    let newString = splitOnSpace.shift()!.toLowerCase();
    for (const i of splitOnSpace) {
      newString = newString + capitalize(i);
    }
    return newString;
}

export const buildProficiencyForms = (formData: any, abilityName: string, skills: string[], handleChange: (event: any, setFormData: any) => void, setFormData: any) => {
    skills.unshift(`${abilityName}ST`);
    return (
        <div className="skill-prof">
        <p><b>Proficiencies:</b></p>
        {
            skills.map((skill, i) => (
                <div className="skill-prof-item" key={i}>
                    <input
                        className="form-check-input"
                        id={toCamelCase(skill)}
                        name={toCamelCase(skill)}
                        type="checkbox"
                        checked={formData[toCamelCase(skill)] === "true"}
                        onChange={(event) => {
                            event.target.value = event.target.checked ? "true" : "false";
                            handleChange(event, setFormData);
                        }}
                    />
                    <label className="form-check-label" htmlFor={toCamelCase(skill)}>
                        {skill == `${abilityName}ST` ? 'Saving Throws' : capitalize(skill)}
                    </label>
                </div>
            ))
        }
        </div>
        
    )
}

export const getSpellSaveDC = (pcData: PlayerCharacter, spell: Spell): number => {
    const mod = pcData.abilityScores.data[spell.spellCastingAbility].modifier;
    return 8 + mod + pcData.baseDetails.proficiencyBonus;
}

export const getDefaultSpellSaveDC = (proficiencyBonus: number, defaultSpellCastingAbility: Ability, abilityScores: AbilityScores) => {
    return 8 + proficiencyBonus + abilityScores.data[defaultSpellCastingAbility].modifier;
}

export const canCastSpell = (spell: Spell, spellSlots: SpellSlot[], selectedLevel?: SpellLevel) => {
    // Can always cast a cantrip
    if (spell.level == SpellLevel.CANTRIP) return true;

    // If no slots exist and spell is not a cantrip, can never cast
    if (spellSlots.length < 1) return false;

    // Check available slots against spell level
    const availableSlots = getAvailableSpellSlots(spell, spellSlots);
    if (availableSlots.length < 1) return false;
    if (selectedLevel && availableSlots.filter(s => s.data.level == selectedLevel).length == 0) return false;
    return true;
}

export const getAvailableSpellSlots = (spell: Spell, spellSlots: SpellSlot[]) => {
    const availableSlots = spellSlots.filter(slot =>
        slot.data.level !== SpellLevel.CANTRIP && 
        slot.data.level >= spell.level &&
        slot.data.current > 0
    );
    return availableSlots;
};