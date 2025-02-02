import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import Card from "@components/cards/Card";
import { getSpellSaveDC } from "./utils";
import Popover from "./modals/Popover";
import PopoverContentSpell from "./popovers/SpellPopoverContent";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { DamageType } from "@models/enum/DamageType";
import { useState } from "react";
import { emptyRichTextContent, SAVE_CHANGES_ERROR, triggerSuccessAlert } from "@pages/utils";
import GenericModal from "./modals/GenericModal";
import { useNavigate } from "react-router-dom";
import { updateDataByPcId } from "@services/firestore/crud/update";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { QueryClient } from "@tanstack/react-query";
import { sleep } from "@services/firestore/utils";

interface Props {
    pcData: PlayerCharacter;
    queryClient: QueryClient;
    setShowSuccessAlert: (show: boolean) => void;
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

function PrepareSpellsList ({pcData, queryClient, setShowSuccessAlert}: Props) { 
    const navigate = useNavigate();
    const [disabledButtons, setDisabledButtons] = useState(false);
  
    // RETURN EARLY IF NO SPELL SLOTS
    const spellSlots = pcData.spellSlots ?? [];
    const spells = pcData.baseDetails.spells ?? [];
    if (spellSlots.length < 1 && spells.length < 1) return;

    const [spellDescriptionModalContent, setSpellDescriptionModalContent] = useState({
        title: '',
        content: emptyRichTextContent
    });

    // PREPARED SPELL FORM DETAILS
    const [newPreparedSpells, setNewPreparedSpells] = useState(spells.map(s=> ({
      ...s,
      prepared: s.prepared || s.prepared === undefined ? true : false
    })));
    const handlePrepareSpells = async (event: any) => {
        event.preventDefault();
    
        try {
            await updateDataByPcId(CollectionName.PC_BASE_DETAILS, pcData.baseDetails.pcId, { spells: newPreparedSpells });
        } catch (e: any) {
            console.error(e);
            alert(SAVE_CHANGES_ERROR);
            return;
        }
        queryClient.refetchQueries({ queryKey: ['pcData', pcData.baseDetails.pcId]});
        triggerSuccessAlert(setShowSuccessAlert);
        setDisabledButtons(true);
        await sleep(1500);
        navigate('/tracker');
        window.scrollTo(0, 0);
    }


    const spellDisplays = mergeSpellsAndSlots(spellSlots, spells);

  return (
    <>
    {/* Spell Description Modal */}
    <GenericModal
      modalName="spellDescription"
      title={spellDescriptionModalContent.title}
      onClose={() => setSpellDescriptionModalContent({title: '', content: emptyRichTextContent})}
      modalBody={<div dangerouslySetInnerHTML={{__html: spellDescriptionModalContent.content}}/>}
    />
    {
    spellDisplays.length > 0 &&
    <Card>
      <p className="center dark-purple update-form-description padding-20">
        &#9432; Toggle the PREPARE checkboxes as desired, then click Prepare Spells below to save changes.
        <br/>        
        All spells are displayed on the Details page, but only cantrips and Prepared spells are available on the Tracker page.
      </p>
      {
        spellDisplays.filter(s => s.level !== SpellLevel.CANTRIP).sort((a,b) => {
          if (a.level < b.level) return -1;
          return 1;
        }).map((d, index) => (
          <Card key={index}>
          <div className="spell-display center-table">
            <div className="row spell-display-header">
              <div className="col spell-display-header-col">
                <h3 className="left-justify">{d.level}</h3>
              </div>
            </div>              
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
                    <div className="container-fluid left-justify spell-display-custom-padding" key={i}>
                      <div className="row display-item-row">
                        <div className="col">
                          <button
                            type="button"
                            className="text-link invisible-btn spell-display-name"
                            data-bs-toggle="modal"
                            data-bs-target="#spellDescriptionModal"
                            disabled={!s.description || s.description == emptyRichTextContent}
                            onClick={() => {
                              setSpellDescriptionModalContent({
                                title: `${s.name} - ${s.level}${s.level !== SpellLevel.CANTRIP ? " Spell" : ""}`,
                                content: s.description
                              });
                            }}
                          >
                            <b>{s.name}</b>
                          </button>
                        </div>                          
                        <div className="col">
                            {
                              s.hasAttack &&
                              <Popover
                                  popoverBody={<PopoverContentSpell pcData={pcData} spell={s} displayType="attack bonus"/>}
                                  customClass="spell-display-item"
                                >
                                  <span>ATK: <b>+{pcData.abilityScores.data[s.spellCastingAbility].modifier + pcData.baseDetails.proficiencyBonus}</b></span>
                              </Popover>
                            }
                            {
                              s.damage &&
                                <div className="popover-main-content spell-display-item"><span>{s.damageType == DamageType.HEALING ? 'EFFECT:' : 'DMG:'} {s.damage} {s.damageType}</span></div>
                            }   
                            {
                              s.hasSaveDC &&
                              <Popover
                                popoverBody={<PopoverContentSpell pcData={pcData} spell={s} displayType="save DC"/>}
                                customClass="spell-display-item"
                              >
                              <span>Save DC: <b>{getSpellSaveDC(pcData, s)}</b></span>
                              </Popover>
                            }
                        </div>   
                        <div className="col-auto light-purple-bg prepare-section">
                            <input
                                className="inline"
                                type="checkbox"
                                checked={newPreparedSpells.find(spell => spell.id === s.id)?.prepared || newPreparedSpells.find(spell => spell.id === s.id)?.prepared === undefined}
                                onChange={() => {
                                    const newValue = !newPreparedSpells.find(spell => spell.id === s.id)?.prepared;
                                    setNewPreparedSpells(newPreparedSpells.map(spell => {
                                        if (spell.id === s.id) return {...spell, prepared: newValue}
                                        else return spell;
                                    }));                                    
                                }}
                            />
                            <p className="inline prepare-text">PREPARE</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
          </div>
          </Card>
        ))
      }
      <Card customClass="light-purple-bg">
      <div className="container-fluid">
            <div className="row">
                <div className="col"/>
                <div className="col-auto">
                    <button
                        type="button"
                        className="btn btn-secondary small-margin"
                        onClick={() => {
                          navigate('/tracker');
                          window.scrollTo(0, 0);
                        }}
                        disabled={disabledButtons}
                    >
                        Cancel (back to Tracker)
                    </button>
                    <button 
                        type="button"
                        className="btn btn-success btn-custom-green small-margin"
                        onClick={(event) => {
                            handlePrepareSpells(event);
                        }
                        }
                        disabled={disabledButtons}
                    >
                        Prepare {newPreparedSpells.filter(s => s.level !== SpellLevel.CANTRIP && (s.prepared || s.prepared === undefined)).length} Spells
                    </button>   
                </div>
            </div>
        </div>
      </Card>
        
      <div>        
      </div>
    </Card>
    }
    
    </>
  )
}

export default PrepareSpellsList;