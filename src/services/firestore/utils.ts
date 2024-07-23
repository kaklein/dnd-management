import { UpdateType } from "@models/enum/service/UpdateType"
import { CollectionName } from "./enum/CollectionName"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { Weapon } from "@models/playerCharacter/Weapon";
import { DamageType } from "@models/enum/DamageType";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { Ability } from "@models/enum/Ability";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Feature } from "@models/playerCharacter/Feature";
import { RestType } from "@models/enum/RestType";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { AbilityScores } from "@models/playerCharacter/AbilityScores";
import { v4 as uuidv4 } from "uuid";


export const transformFormDataForUpdate = (pcData: PlayerCharacter, data: {updateType: UpdateType, [key: string]: string | number | object}) => { 
  const { updateType, ...updates } = data;
  
  switch (updateType) {
    case UpdateType.BASE_DETAILS: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: {
            level: Number(updates.level),
            armorClass: Number(updates.armorClass),
            'usableResources.hitPoints.max': Number(updates.hitPointMaximum),
            'usableResources.hitDice.max': Number(updates.hitDice),
            proficiencyBonus: Number(updates.proficiencyBonus)
          }
        }
      }
    }
    case UpdateType.WEAPONS: {
      const isMagic = updates.magic === "true" ? true: false;
      const newWeapon: Weapon = {
        id: uuidv4(),
        name: String(updates.name),
        type: String(updates.type),
        damage: String(updates.damage),
        damageType: String(updates.damageType) as DamageType,
        magic: isMagic,
        modifierProperty: String(updates.modifierProperty) as WeaponModifierProperty,
        ...(updates.description && {description: String(updates.description)})
      };
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('weapons', newWeapon)
        }
      }
    }
    case UpdateType.SPELLS: {
      const newSpell: Spell = {
        id: uuidv4(),
        name: String(updates.name),
        description: String(updates.description),
        level: String(updates.level) as SpellLevel,
        spellCastingAbility: String(updates.spellCastingAbility) as Ability,
        ...(updates.damageType && {damageType: String(updates.damageType) as DamageType}),
        ...(updates.damage && {damage: String(updates.damage)}),
        ...(updates.saveDC && {saveDC: Number(updates.saveDC)}),
        ...(updates.attackBonus && {attackBonus: Number(updates.attackBonus)}),
        ...(updates.sourceUrl && {sourceUrl: String(updates.sourceUrl)})
      }
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('spells', newSpell)
        }
      }
    }
    case UpdateType.PROFICIENCIES: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('proficiencies', updates.proficiency)
        }
      }
    }
    case UpdateType.LANGUAGES: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('languages', updates.language)
        }
      }
    }
    case UpdateType.NOTES: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('notes', updates.note)
        }
      }
    }
    case UpdateType.EQUIPMENT: {
      return {
        collectionName: CollectionName.PC_BASE_DETAILS,
        update: {
          pcId: pcData.baseDetails.pcId,
          updateObject: buildAddToArrayUpdate('equipment', {id: uuidv4(), ...updates})
        }
      }
    }
    case UpdateType.SPELL_SLOTS: {
      const newSpellSlot: SpellSlot = {
        id: '',
        data: {
          pcId: pcData.baseDetails.pcId,
          level: String(updates.level) as SpellLevel,
          max: Number(updates.max),
          current: Number(updates.max)
        }
      }
      const existingSpellSlot = pcData.spellSlots?.filter(spellSlot => spellSlot.data.level == newSpellSlot.data.level)[0];
      if (existingSpellSlot) {
        // TODO: Update existing spell slot - check how this update object is used; we need to do an update by doc id (spellSlot.id) instead of by pcId
        const getCurrentSpellSlots = () => {
          // if new max is 4, current max is 3, current current is 3: new current should be 4
          const existingCurrent = existingSpellSlot.data.current;
          const existingUsed = existingSpellSlot.data.max - existingCurrent;
          return Math.max(newSpellSlot.data.max - existingUsed, 0);
        }
        
        return {
          collectionName: CollectionName.SPELL_SLOTS,
          updateByDocId: {
            docId: existingSpellSlot.id,
            updateObject: { 
              max: newSpellSlot.data.max, 
              current: getCurrentSpellSlots()
            }
          }
        }
      } else {
        return {
          collectionName: CollectionName.SPELL_SLOTS,
          create: {
            dataObject: newSpellSlot.data
          }
        }
      }
    }
    case UpdateType.FEATURES: {
      const newFeature: Feature = {
        id: '',
        data: {
          pcId: pcData.baseDetails.pcId,
          name: String(updates.name),
          description: String(updates.description),
          source: String(updates.source),
          ...(updates.maxUses && {maxUses: Number(updates.maxUses)}),
          ...(updates.maxUses && {currentUses: Number(updates.maxUses)}),
          ...(updates.refresh && {refresh: String(updates.refresh) as RestType}),
          ...(updates.damage && {damage: String(updates.damage)}),
          ...(updates.damageType && {damageType: String(updates.damageType) as DamageType}),
          ...(updates.saveDC && {saveDC: Number(updates.saveDC)}),
          ...(updates.sourceUrl && {sourceUrl: String(updates.sourceUrl)})
        }
      }
      return {
        collectionName: CollectionName.FEATURES,
        create: {
          dataObject: newFeature.data
        }
      }
    }
  }
};

export const buildAddToArrayUpdate = (arrayFieldName: string, objectToAdd: any) => {
  return {
    [arrayFieldName]: arrayUnion(objectToAdd)
  };
};

export const buildRemoveFromArrayUpdate = (arrayFieldName: string, stringToRemove: string) => {
  return {
    [arrayFieldName]: arrayRemove(stringToRemove)
  };
};

const getProficiencyBonusByLevel = (level: number): number => {
  if ([1, 2, 3, 4].includes(level)) return 2;
  if ([5, 6, 7, 8].includes(level)) return 3;
  if ([9, 10, 11, 12].includes(level)) return 4;
  if ([13, 14, 15, 16].includes(level)) return 5;
  if([17, 18, 19, 20].includes(level)) return 6;
  throw Error(`Level must be between 1 and 20 inclusive. Level: ${level}`);
}

export const transformBaseDetailsForCharacterCreation = (uid: string, pcId: string, formData: any): BaseDetails => {
  return {
    pcId: pcId,
    uid: uid,
    name: {
      firstName: formData.firstName,
      lastName: formData.lastName
    },
    playerName: formData.playerName,
    class: formData.class,
    race: formData.race,
    alignment: formData.alignment,
    background: formData.background,
    level: Number(formData.level),
    proficiencyBonus: getProficiencyBonusByLevel(Number(formData.level)),
    armorClass: Number(formData.armorClass),
    speed: Number(formData.speed),
    usableResources: {
      hitPoints: {
        max: Number(formData.hitPointMaximum),
        current: Number(formData.hitPointMaximum),
        temporary: 0
      },
      hitDice: {
        type: formData.hitDiceType,
        max: Number(formData.level),
        current: Number(formData.level)
      },
      deathSaves: {
        max: 3,
        successesRemaining: 3,
        failuresRemaining: 3
      },
      gold: Number(formData.gold),
      inspiration: 0
    },
    equipment: [],
    weapons: [],
    spells: [],
    notes: [],
    languages: [],
    proficiencies: [],
    ...(formData.description && {description: formData.description}),
    ...(formData.subclass && {subclass: formData.subclass}),
    ...(formData.xp && {xp: Number(formData.xp)}),
    ...(formData.avatarUrl && {imagePaths: {avatar: formData.avatarUrl}})
  };
}

const getModifier = (baseScore: number): number => {
  return Math.floor((baseScore - 10) / 2);
}

const getBool = (asString: "true" | "false") => {
  return asString === "true" ? true : false;
}

export const transformAbilityScoresForCharacterCreation = (pcId: string, formData: any): AbilityScores => {
  return {
    pcId: pcId,
    strength: {
      score: Number(formData.strengthScore),
      modifier: getModifier(Number(formData.strengthScore)),
      savingThrows: {proficient: getBool(formData.strengthST)},
      athletics: {proficient: getBool(formData.athletics)}
    },
    dexterity: {
      score: Number(formData.dexterityScore),
      modifier: getModifier(Number(formData.dexterityScore)),
      savingThrows: {proficient: getBool(formData.dexterityST)},
      acrobatics: {proficient: getBool(formData.acrobatics)},
      sleightOfHand: {proficient: getBool(formData.sleightOfHand)},
      stealth: {proficient: getBool(formData.stealth)}
    },
    constitution: {
      score: Number(formData.constitutionScore),
      modifier: getModifier(Number(formData.constitutionScore)),
      savingThrows: {proficient: getBool(formData.constitutionST)}
    },
    intelligence: {
      score: Number(formData.intelligenceScore),
      modifier: getModifier(Number(formData.intelligenceScore)),
      savingThrows: {proficient: getBool(formData.intelligenceST)},
      arcana: {proficient: getBool(formData.arcana)},
      history: {proficient: getBool(formData.history)},
      investigation: {proficient: getBool(formData.investigation)},
      nature: {proficient: getBool(formData.nature)},
      religion: {proficient: getBool(formData.religion)}
    },
    wisdom: {
      score: Number(formData.wisdomScore),
      modifier: getModifier(Number(formData.wisdomScore)),
      savingThrows: {proficient: getBool(formData.wisdomST)},
      animalHandling: {proficient: getBool(formData.animalHandling)},
      insight: {proficient: getBool(formData.insight)},
      medicine: {proficient: getBool(formData.medicine)},
      perception: {proficient: getBool(formData.perception)},
      survival: {proficient: getBool(formData.survival)}
    },
    charisma: {
      score: Number(formData.charismaScore),
      modifier: getModifier(Number(formData.charismaScore)),
      savingThrows: {proficient: getBool(formData.charismaST)},
      deception: {proficient: getBool(formData.deception)},
      intimidation: {proficient: getBool(formData.intimidation)},
      performance: {proficient: getBool(formData.performance)},
      persuasion: {proficient: getBool(formData.persuasion)}
    }
  }
}