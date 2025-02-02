import { getFeatureFormData, getSpellSlotFormData, getSummonablesSummoned } from "@components/utils";
import { Ability } from "@models/enum/Ability";
import { WeaponModifierProperty } from "@models/enum/WeaponModifierProperty";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { Summonable } from "@models/playerCharacter/Summonable";
import { SummonableAttack } from "@models/playerCharacter/SummonableAttack";
import { Weapon } from "@models/playerCharacter/Weapon";
import { updateArrayObjectItem, updateById, updateDataByPcId, updateStringArrayItem } from "@services/firestore/crud/update";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { getBool, getProficiencyBonusByLevel } from "@services/firestore/utils";

export const SAVE_CHANGES_ERROR = 'We encountered an error saving your changes. Please refresh the page and try again.';

export const determineAttackBonus = (weapon: Weapon, pcData: PlayerCharacter) => {
  // weapon modifier + proficiency bonus
  let weaponModifier;
  switch (weapon.modifierProperty) {
    case WeaponModifierProperty.MELEE: {
      weaponModifier = pcData.abilityScores.data.strength.modifier
      break;
    }    
    case WeaponModifierProperty.RANGED: {
      weaponModifier = pcData.abilityScores.data.dexterity.modifier
      break;
    }
    case WeaponModifierProperty.FINESSE: {
      weaponModifier = Math.max(pcData.abilityScores.data.strength.modifier, pcData.abilityScores.data.dexterity.modifier)
      break;
    }
  }
  return weaponModifier;
}

export const formatBonus = (num: number, displayZero=true): string => {
  if (num > 0) return `+${num}`;
  if (num == 0 && !displayZero) return '';
  return `${num}`;
}

export const triggerSuccessAlert = (setFunction: (value: boolean) => void) => {
  setFunction(true);
  setTimeout(() => {
      setFunction(false);
  }, 2000);
};

// For use on Details and Overview pages
export const handleSubmitEdit = async (
  event: React.ChangeEvent<HTMLInputElement>,
  formData: any,
  pcData: PlayerCharacter
) => {
  event.preventDefault();
  if (formData.formType === 'feature') {
    let currentUses = 0;

    if (formData.maxUses) {
      const existingFeature = pcData.features.filter(x => x.id === formData.featureId)[0];
      if (existingFeature.data.currentUses !== undefined && existingFeature.data.maxUses !== undefined) {
        const currentUsed = existingFeature.data.maxUses - existingFeature.data.currentUses;
        currentUses = Math.max(Number(formData.maxUses) - currentUsed, 0);
      } else {
        currentUses = Number(formData.maxUses);
      }
    }
    
    const updatedFeature: Feature = {
        id: '',
        data: {
            pcId: pcData.baseDetails.pcId,
            name: formData.name,
            description: formData.description,
            source: formData.source,
            maxUses: formData.maxUses ? Number(formData.maxUses) : 0,
            currentUses: currentUses,
            refresh: formData.refresh,
            damage: formData.damage,
            damageType: formData.damageType,
            saveDC: formData.saveDC,
            sourceUrl: formData.sourceUrl,
        }
    }
    await updateById(CollectionName.FEATURES, formData.featureId, updatedFeature.data);
  } else if (formData.formType === 'summonable') {
    if (!pcData.summonables || pcData.summonables.length < 1) return;
    const existingSummonable = pcData.summonables?.filter(x => x.id === formData.summonableId)[0];

    // calculate new HP
    const lostHP = existingSummonable.data.hitPoints.max - existingSummonable.data.hitPoints.current;
    const hitPointsCurrent = Math.max(Number(formData.hitPointMaximum) - lostHP, 0);
    
    // update attacks array
    const attacks: SummonableAttack[] = formData.attacks as SummonableAttack[];

    // update abilityScores
    let abilityScores;
    if (getBool(formData.useAbilityScores)) {
      abilityScores = {
        strength: Number(formData.strengthScore),
        dexterity: Number(formData.dexterityScore),
        constitution: Number(formData.constitutionScore),
        intelligence: Number(formData.intelligenceScore),
        wisdom: Number(formData.wisdomScore),
        charisma: Number(formData.charismaScore),
        proficiencyBonus: formData.proficiencyBonus ? Number(formData.proficiencyBonus) : 0      
      };
    }

    const updatedSummonable: Summonable = {
        id: '',
        data: {
            pcId: pcData.baseDetails.pcId,
            type: formData.type,
            name: formData.name,
            description: formData.description,
            source: {
              type: formData.sourceType,
              name: formData.sourceName
            },
            hitPoints: {
              max: formData.hitPointMaximum,
              current: hitPointsCurrent
            },
            armorClass: Number(formData.armorClass),
            summoned: existingSummonable.data.summoned,
            attacks: attacks && attacks.length > 0 ? attacks.map(a => ({
              id: a.id,
              name: a.name,
              description: a.description,
              ...(a.damage && { damage: a.damage }),
              ...(a.damageType && { damageType: a.damageType }),
            })) : [],
            abilityScores
        }
    }
    await updateById(CollectionName.SUMMONABLES, formData.summonableId, updatedSummonable.data);
  } else if (['spell', 'weapon', 'equipment'].includes(formData.formType)) {     
    let updatedItem;
    let fieldName;
    let existingArray;

    switch(formData.formType) {
        case 'spell': {
            fieldName = 'spells';
            if(!pcData.baseDetails.spells || pcData.baseDetails.spells.length < 1) throw Error ('Spells array is empty');
            existingArray = pcData.baseDetails.spells;
            updatedItem = {
                id: formData.spellId,
                name: formData.name,
                description: formData.description,
                level: formData.level,
                spellCastingAbility: formData.spellCastingAbility,
                hasAttack: formData.hasAttack,
                hasSaveDC: formData.hasSaveDC,
                damage: formData.damage,
                damageType: formData.damageType,
                saveDC: formData.saveDC,
                sourceUrl: formData.sourceUrl,
                prepared: existingArray.find(s => s.id == formData.spellId)?.prepared ?? true
            };
            break;
        }
        case 'weapon': {
            fieldName = 'weapons';
            existingArray = pcData.baseDetails.weapons;
            updatedItem = {
                id: formData.weaponId,
                name: formData.name,
                type: formData.type,
                damage: formData.damage,
                damageType: formData.damageType,
                modifierProperty: formData.modifierProperty,
                magic: getBool(formData.magic),
                description: formData.description,
                equipped: existingArray.find(w => w.id == formData.weaponId)?.equipped ?? false
            };
            break;
        }
        case 'equipment': {
            fieldName = 'equipment';
            existingArray = pcData.baseDetails.equipment;
            updatedItem = {
                id: formData.equipmentId,
                type: formData.type,
                description: formData.description
            }
            break;
        }
        default: {
            throw Error(`Unknown formType: ${formData.formType}`);
        }
    }
    
    await updateArrayObjectItem(
        CollectionName.PC_BASE_DETAILS,
        pcData.baseDetails.pcId,
        fieldName,
        existingArray,
        updatedItem
    );
  } else if (['language', 'note', 'proficiency'].includes(formData.formType)) {     
    let fieldName;
    let existingArray;
    let updatedItem: string;

    switch (formData.formType) {
        case 'language': {
            fieldName = 'languages';
            existingArray = pcData.baseDetails.languages;
            updatedItem = formData.language;
            break;
        }
        case 'note': {
            fieldName = 'notes';
            if(!pcData.baseDetails.notes || pcData.baseDetails.notes.length < 1) throw Error('Notes array is empty');
            existingArray = pcData.baseDetails.notes;
            updatedItem = formData.note;
            break;
        }
        case 'proficiency': {
            fieldName = 'proficiencies';
            existingArray = pcData.baseDetails.proficiencies;
            updatedItem = formData.proficiency;
            break;
        }
        default: {
            throw Error(`Unknown formType: ${formData.formType}`);
        }
    }

    await updateStringArrayItem(
        CollectionName.PC_BASE_DETAILS,
        pcData.baseDetails.pcId,
        fieldName,
        existingArray,
        updatedItem,
        formData.originalItem
    );            
  } else if (formData.formType === 'character') {
    const update = {
      'name.firstName': formData.firstName,
      'name.lastName': formData.lastName,
      description: formData.description,
      imagePath: formData.imagePath,
      class: formData.class,
      subclass: formData.subclass,
      race: formData.race,
      background: formData.background,
      alignment: formData.alignment,
      level: Number(formData.level),
      'usableResources.hitDice.max': Number(formData.level),
      'usableResources.hitDice.current': Number(formData.level) - (pcData.baseDetails.usableResources.hitDice.max - pcData.baseDetails.usableResources.hitDice.current),
      proficiencyBonus: getProficiencyBonusByLevel(Number(formData.level)),
      'usableResources.hitPoints.max': Number(formData.maxHP),
      ...(Number(formData.maxHP) < pcData.baseDetails.usableResources.hitPoints.current && {'usableResources.hitPoints.current': Number(formData.maxHP)}),
      armorClass: Number(formData.armorClass),
      xp: formData.xp ? Number(formData.xp) : '',
      speed: Number(formData.speed),
      'usableResources.hitDice.type': formData.hitDiceType,
      defaultSpellCastingAbility: formData.defaultSpellCastingAbility
    };
    await (updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, update));
  } else {
    throw Error(`Invalid update type: ${formData.formType}`);
  }
}

export const getHPRange = (currentHP: number, maxHP: number): 'full' | 'high' | 'med-high' | 'med-low' | 'low' | 'min' | 'dying' => {
  const percentage = (currentHP / maxHP) * 100;
  if (percentage >= 100) return 'full';
  if (percentage >= 75) return 'high';
  if (percentage >= 50) return 'med-high';
  if (percentage >= 30) return 'med-low';
  if (currentHP > 1) return 'low';
  if (currentHP > 0) return 'min';
  return 'dying';
}

export const getSpendGoldButtonText = (inputAmountToSpend: string) => {
  const amount = Number(inputAmountToSpend);
  if (!amount) {
    return "Spend Gold";
  }
  return `Spend ${amount.toLocaleString()} Gold`;
}

export const formatWeaponDisplayTitle = (type: string, name?: string):
string => {  
  const displayTitle = name ? `${name} (${type})` : type;
  return displayTitle;
}

export const pcHasDetailsPageItems = (pcData: PlayerCharacter): boolean => {
  const hasItems =
    (Object.keys(pcData.baseDetails).includes('spells') && ((pcData.baseDetails.spells?.length ?? -1) > 0)) ||
    (Object.keys(pcData.baseDetails).includes('weapons') && ((pcData.baseDetails.weapons?.length ?? -1) > 0)) ||
    (Object.keys(pcData.baseDetails).includes('equipment') && ((pcData.baseDetails.equipment?.length ?? -1) > 0)) ||
    (Object.keys(pcData.baseDetails).includes('languages') && ((pcData.baseDetails.languages?.length ?? -1) > 0)) ||
    (Object.keys(pcData.baseDetails).includes('proficiencies') && ((pcData.baseDetails.proficiencies?.length ?? -1) > 0)) ||
    (Object.keys(pcData.baseDetails).includes('notes') && ((pcData.baseDetails.notes?.length ?? -1) > 0)) ||
    (pcData.features.length > 0) ||
    (pcData.summonables != undefined && pcData.summonables.length > 0);
  return hasItems;
}

export const getLimitedUseFeatures = (pcData: PlayerCharacter) => {
  return pcData.features.filter(feature => feature.data.maxUses).sort((a,b) => {
      if (a.data.name < b.data.name) return -1;
      return 1;
  });
}

export const getDefaultSummoned = (pcData: PlayerCharacter): {[key: string]: any} => {
  return pcData.summonables!.map(s => ({[s.id] : false}));
}

export const getSummonableIconName = (s: Summonable): string => {
  const hp = {
    current: s.data.hitPoints.current,
    max: s.data.hitPoints.max,
  };
  
  if (hp.current > (hp.max / 2)) return 'summonable-icon';
  if (hp.current > (hp.max / 4)) return 'summonable-icon-half-health';
  if (hp.current >= 1) return 'summonable-icon-low-health';
  return 'summonable-icon-downed';
}

export const getDefaultFormData = (pcData: PlayerCharacter) => {
  return {
      hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.current,
      hitPointsTemporary: pcData.baseDetails.usableResources.hitPoints.temporary,
      hitDiceCurrent: pcData.baseDetails.usableResources.hitDice.current,
      deathSavesSuccesses: pcData.baseDetails.usableResources.deathSaves.successesRemaining,
      deathSavesFailures: pcData.baseDetails.usableResources.deathSaves.failuresRemaining,
      gold: pcData.baseDetails.usableResources.gold,
      inspiration: pcData.baseDetails.usableResources.inspiration,
      armorClass: pcData.baseDetails.armorClass,
      ...getSpellSlotFormData(pcData.spellSlots ?? []),
      ...getFeatureFormData(getLimitedUseFeatures(pcData)),
      ...getSummonablesSummoned(pcData.summonables ?? [])
  }
};

export const emptySpellFormData: Spell = {
  id: '',
  name: '',
  description: '',
  level: '' as SpellLevel,
  spellCastingAbility: Ability.CHA
}

export const getSummonedItem = (pcData: PlayerCharacter) => {
  const summonables = pcData.summonables;
  
  const summoned = summonables?.filter(s => s.data.summoned == true)[0];  
  
  if (!summoned) {
    return {
      id: '',
      data: {
        pcId: '',
        type: '',
        description: '',
        source: {
          type: '',
          name: ''
        },
        hitPoints: {
          max: 0,
          current: 0
        },
        armorClass: 0,
        summoned: false
      }
    }
  } else {
    return summoned;
  }
}

export const emptyRichTextContent = '<p></p>';