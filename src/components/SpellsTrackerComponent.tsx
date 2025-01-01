import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import Card from "@components/cards/Card";
import ItemUseToggle from "./ItemUseToggle";
import { buildSpellSlotsCurrentKey, getSpellSaveDC, removeWhiteSpaceAndConvertToLowerCase } from "./utils";
import { Link } from "react-router-dom";
import Popover from "./modals/Popover";
import PopoverContentSpell from "./popovers/SpellPopoverContent";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { DamageType } from "@models/enum/DamageType";

interface Props {
  pcData: PlayerCharacter;
  formData: any;
  handleSubmit: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SpellDisplay {
  level: SpellLevel;
  spellSlot?: SpellSlot;
  spells?: Spell[];
}

const mergeSpellsAndSlots = (spellSlots: SpellSlot[], spells: Spell[]): SpellDisplay[] => {
  let spellDisplays: SpellDisplay[] = [];

  for (const slot of spellSlots) {
    if (slot.data.max > 0) {
        spellDisplays.push({
        level: slot.data.level,
        spellSlot: slot,
        spells: []
      });
    }
  };

  let index;
  for (const spell of spells) {
    index = spellDisplays.map(d => d.level).indexOf(spell.level);
    if (index < 0) { // indicates there are no displays for this level yet
      spellDisplays.push({
        level: spell.level,
        spells: [spell]
      });
    } else { // indicates there are displays for this level and we need to add the spell there
      spellDisplays[index].spells?.push(spell)
    }
  };

  return spellDisplays;
}

function SpellsTrackerComponent ({pcData, formData, handleSubmit}: Props) {
  const spellSlots = pcData.spellSlots ?? [];
  const spells = pcData.baseDetails.spells ?? [];
  
  if (spellSlots.length < 1 && spells.length < 1) return;

  const spellDisplays = mergeSpellsAndSlots(spellSlots, spells);

  return (
    <Card>
      <h3 className="section-header">Spells</h3>
        {
          spellDisplays.sort((a,b) => {
            if (a.level < b.level) return -1;
            return 1;
          }).map((d, index) => (
            <Card key={index}>
            <div className="spell-display center-table">
              <h3>{d.level === SpellLevel.CANTRIP ? 'Cantrips' : d.level}</h3>
              {
                d.spellSlot &&
                <ItemUseToggle
                  itemLabel={removeWhiteSpaceAndConvertToLowerCase(d.spellSlot.data.level)}
                  formDataName={buildSpellSlotsCurrentKey(d.spellSlot)}
                  maxUses={d.spellSlot.data.max}
                  currentUses={d.spellSlot.data.current}
                  formData={formData}
                  handleSubmit={handleSubmit} 
                />
              }
              {
                (!d.spellSlot && !(d.level === SpellLevel.CANTRIP))&&
                <div><p className="center"><i>No {d.level} spell slots! Use the <a style={{fontWeight: 'bold'}} className="text-link" href="/add">Add Items</a> page to add them.</i></p></div>
              }

              {
                (d.spells && d.spells.length > 0) &&
                  
                    d.spells.sort((a, b) => {
                      if (a.name < b.name) return -1;
                      return 1;
                    }).map((s, i) => (
                      <div className="container-fluid left-justify" key={i}>
                        <div className="row display-item-row">
                            <div className="col-5">
                                <b><Link className="text-link" to={'/details?spells=true#' + s.id}>{s.name}</Link></b>
                            </div>
                            <div className="col-7">
                                {
                                  s.hasAttack &&
                                  <Popover
                                      popoverBody={<PopoverContentSpell pcData={pcData} spell={s} displayType="attack bonus"/>}
                                      fitContent={true}
                                    >
                                      <span>ATK: <b>+{pcData.abilityScores.data[s.spellCastingAbility].modifier + pcData.baseDetails.proficiencyBonus}</b></span>
                                  </Popover>
                                }
                                {
                                  s.damage &&
                                    <div className="popover-main-content"><span>{s.damageType == DamageType.HEALING ? 'EFFECT:' : 'DMG:'} {s.damage} {s.damageType}</span></div>
                                }   
                                {
                                 s.hasSaveDC &&
                                 <Popover
                                    popoverBody={<PopoverContentSpell pcData={pcData} spell={s} displayType="save DC"/>}
                                    fitContent={true}
                                 >
                                  <span>Save DC: <b>{getSpellSaveDC(pcData, s)}</b></span>
                                 </Popover>
                                }
                            </div>
                        </div>
                    </div>
                    ))
                  }                
                
              {
                (!d.spells || d.spells.length < 1) &&
                <div><p className="center"><i>No {d.level} spells! Use the <a style={{fontWeight: 'bold'}} className="text-link" href="/add">Add Items</a> page to add them.</i></p></div>
              }
            </div>
            </Card>
          ))
        }
    </Card>
  )
}

export default SpellsTrackerComponent;