import { Spell, SpellLevel } from "@models/playerCharacter/Spell";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import Card from "@components/cards/Card";
import { buildSpellSlotsCurrentKey, canCastSpell, getSpellSaveDC } from "./utils";
import Popover from "./modals/Popover";
import PopoverContentSpell from "./popovers/SpellPopoverContent";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { DamageType } from "@models/enum/DamageType";
import SpellUseModal from "./modals/SpellUseModal";
import { useState } from "react";
import { emptyRichTextContent, emptySpellFormData } from "@pages/utils";
import { buildDefaultSpellSlotFormData, getMatchingSpellSlots } from "@data/emptyFormData";
import SpellSlotEditModal from "./modals/SpellSlotEditModal";
import GenericModal from "./modals/GenericModal";
import { useNavigate } from "react-router-dom";

interface Props {
  pcData: PlayerCharacter;
  spellSlotLevel: {
    selected: SpellLevel;
    setSelected: (level: SpellLevel) => void;
  }
  handleSubmit: (event: any, updates: any) => void;
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

function SpellsTrackerComponent ({pcData, spellSlotLevel, handleSubmit}: Props) {
  const navigate = useNavigate();
  
  const [spellToCast, setSpellToCast] = useState(emptySpellFormData);
  
  const spellSlots = pcData.spellSlots ?? [];
  const spells = pcData.baseDetails.spells ?? [];
  const [spellSlotFormData, setSpellSlotFormData] = useState(buildDefaultSpellSlotFormData(spellToCast, spellSlots));
  const [spellSlotToEdit, setSpellSlotToEdit] = useState({
    id: '',
    data: {
      level: SpellLevel.CANTRIP,
      current: 0,
      max: 0,
      pcId: pcData.baseDetails.pcId,
    }
  });
  const [spellDescriptionModalContent, setSpellDescriptionModalContent] = useState({
    title: '',
    content: emptyRichTextContent
  });

  if (spellSlots.length < 1 && spells.length < 1) return;

  const spellDisplays = mergeSpellsAndSlots(spellSlots, spells);

  return (
    <>
    <SpellUseModal
      spell={spellToCast}
      spellSlots={spellSlots}
      spellSlotLevel={spellSlotLevel}
      spellSlotFormData={spellSlotFormData}
      setSpellSlotFormData={setSpellSlotFormData}
      handleSubmit={handleSubmit}
    />
    <SpellSlotEditModal
      spellSlot={spellSlotToEdit}
      spellSlotFormData={spellSlotFormData}
      setSpellSlotFormData={setSpellSlotFormData}
      handleSubmit={handleSubmit}
    />
    {/* Spell Description Modal */}
    <GenericModal
      modalName="spellDescription"
      title={spellDescriptionModalContent.title}
      onClose={() => setSpellDescriptionModalContent({title: '', content: emptyRichTextContent})}
      modalBody={<div dangerouslySetInnerHTML={{__html: spellDescriptionModalContent.content}}/>}
    />
    <Card>
    <h3 className="section-header no-margin">Spells</h3>
    <div className="container-fluid prepare-spells-button-display">
      <div className="row">
        <div className="col">
          <p><i>Prepared: {spells.filter(s => s.level !== SpellLevel.CANTRIP && (s.prepared || s.prepared === undefined)).length}</i></p>
        </div>
      <div className="col-auto">
        <button type="button" className="btn btn-secondary small-margin" onClick={() => {
          navigate('/prepare-spells');
          window.scrollTo(0, 0);
        }}>
          &#8663; Prepare Spells
        </button>        
      </div>
      </div>
    </div>
    
      {
        spellDisplays.sort((a,b) => {
          if (a.level < b.level) return -1;
          return 1;
        }).map((d, index) => (
          <Card key={index}>
          <div className="spell-display center-table">
            <div className="row spell-display-header">
              <div className="col spell-display-header-col">
                <h3 className="left-justify">{d.level === SpellLevel.CANTRIP ? 'Cantrips' : d.level}</h3>
              </div>
              {
              d.spellSlot &&
              <div className="col-auto spell-display-header-col spell-display-header-col-right">
                <p className="center inline spell-slot-count"><span className="small-text">SLOTS:</span> <b className={`${d.spellSlot.data.current == 0 ? "large-text no-slots" : "large-text"}`}>{d.spellSlot.data.current} / {d.spellSlot.data.max}</b></p>
                <div className="inline">
                  <button
                    type="button"
                    className="btn btn-secondary inline flip-horizontal no-margin"
                    data-bs-toggle="modal"
                    data-bs-target="#spellSlotEditModal"
                    onClick={() => {
                      const definedSpellSlot = d.spellSlot as SpellSlot;
                      setSpellSlotToEdit(definedSpellSlot);
                      setSpellSlotFormData({
                        [buildSpellSlotsCurrentKey(definedSpellSlot)] : undefined as unknown as number
                      });
                    }}
                  >
                    &#x270E;
                  </button>
                </div>
              </div>
              }
            </div>              
            {
              (!d.spellSlot && !(d.level === SpellLevel.CANTRIP))&&
              <div>
                <p className="center"><i>
                No {d.level} spell slots! Use the&nbsp;
                  <a 
                    style={{fontWeight: 'bold'}}
                    className="text-link"
                    onClick={() => {
                      navigate('/add');
                      window.scrollTo(0, 0);
                    }}
                  >
                    Add Items
                  </a>
                  &nbsp;page to add them.
                </i></p>
              </div>
            }

            {
              (d.spells && d.spells.length > 0) &&
                
                  d.spells.filter(s => s.prepared || s.prepared === undefined).sort((a, b) => {
                    if (a.name < b.name) return -1;
                    return 1;
                  }).map((s, i) => (
                    <div className="container-fluid left-justify spell-display-custom-padding" key={i}>
                      <div className="row display-item-row">
                        <div className="col-4">
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
                        <div className="col-auto cast-button-col">
                        {
                          s.level !== SpellLevel.CANTRIP &&
                            <button
                              type="button"
                              className="btn btn-info cast-button"
                              data-bs-toggle="modal"
                              data-bs-target="#spellUseModal"
                              disabled={!canCastSpell(s, spellSlots)}
                              onClick={() => {
                                spellSlotLevel.setSelected(getMatchingSpellSlots(s, spellSlots)[0].data.level);
                                setSpellToCast(s);
                                setSpellSlotFormData(buildDefaultSpellSlotFormData(s, spellSlots));
                              }}
                            >
                              CAST
                            </button>                              
                        }
                        </div>                         
                      </div>
                    </div>
                  ))
                }                
              
            {
              (!d.spells || d.spells.length < 1) &&
              <div>
                <p className="center"><i>
                No {d.level} spells! Use the&nbsp;
                  <a 
                    style={{fontWeight: 'bold'}}
                    className="text-link"
                    onClick={() => {
                      navigate('/add');
                      window.scrollTo(0, 0);
                    }}
                  >
                    Add Items
                  </a>
                  &nbsp;page to add them.
                </i></p>
              </div>
            }
            {
              (d.spells && d.spells.length > 0 && d.spells.filter(s => s.prepared || s.prepared === undefined).length < 1) &&
              <div>
                <p className="center"><i>
                  No {d.level} spells prepared! Go to&nbsp;
                  <a 
                    style={{fontWeight: 'bold'}}
                    className="text-link"
                    onClick={() => {
                      navigate('/prepare-spells');
                      window.scrollTo(0, 0);
                    }}
                  >
                    Prepare Spells
                  </a>
                  &nbsp;to adjust which spells are available to cast.
                </i></p>
              </div>
            }
          </div>
          </Card>
        ))
      }
    </Card>
    </>
  )
}

export default SpellsTrackerComponent;