import Card from "@components/cards/Card";
import { buildSummonableSelectedKey, buildSummonableSummonedKey } from "@components/utils";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Summonable } from "@models/playerCharacter/Summonable";
import { getAsPercentage, getDefaultFormData, getHPRange, getNextSummonable, toggleSummonableDrawer } from "@pages/utils";
import Popover from "./Popover";
import { getModifierFormatted } from "@services/firestore/utils";
import { DamageType } from "@models/enum/DamageType";

interface Props {
  summonables: Summonable[];
  pcData: PlayerCharacter;
  setFormData: (data: any) => void;
  setSummonableAction: (action: 'gainHP' | 'takeDamage' | 'refillHP' | '') => void;
  setDisableBackdrop: (newValue: boolean) => void;
  disableBackdrop: boolean;
  setSelectedSummonable: (summonable: Summonable) => void;
  selectedSummonable?: Summonable;
}

function SummonableDrawer ({summonables, pcData, setFormData, setSummonableAction, setDisableBackdrop, disableBackdrop, setSelectedSummonable, selectedSummonable=undefined}: Props) {
  if (!selectedSummonable) return;

  let className = "col-auto drawer-body";
  if (disableBackdrop) {
    className += " expand";
  } else {
    className += " drawer-body-collapsed";
  }

  let containerClassName = "container-fluid summonable";
  if (disableBackdrop) {
    containerClassName += " expand";
  } else {
    containerClassName += " contract";
  }

  return (
    <div className={containerClassName} id="summonable-drawer-container">
      <div className="row">
        <div className={className} id="summonable-drawer">          
          <div className="summonable-content" style={{width: "93vw"}}>
            {/* Collapse button */}
            {
              disableBackdrop &&
              <div className="collapse-btn collapse-btn-top">
                <button className="btn" type="button"
                  onClick={() => {
                    setDisableBackdrop(false);
                    toggleSummonableDrawer();
                  }}
                >
                  <p className="inline"><span className="collapse-icon">&lsaquo;</span> COLLAPSE</p>
                </button>
              </div>
            }
            
            {/* Title bar */}
            <div className="summonable-title-row">
              <div className="summonable-title row">
                <div className="col no-padding">
                  <div className={`summonable-title-header center ${selectedSummonable.data.name ? "summonable-title-header-flat-bottom" : ""}`}>
                    <div className="row align-items-center">
                      <div className="col-auto">
                        {/* Next Button */}
                        { summonables.length > 1 &&
                          <button className="btn btn-secondary btn-page-nav" disabled={summonables.length < 2} onClick={() => { setSelectedSummonable(getNextSummonable(selectedSummonable, summonables, true)) }}>&laquo;</button>
                        }
                      </div>
                      <div className="col">
                        <h4 className="summonable-name">{selectedSummonable.data.name ? selectedSummonable.data.name : selectedSummonable.data.type}</h4>
                      </div>
                      <div className="col-auto">
                        {/* Back Button */}
                        { summonables.length > 1 &&
                          <button className="btn btn-secondary btn-page-nav" disabled={summonables.length < 2} onClick={() => { setSelectedSummonable(getNextSummonable(selectedSummonable, summonables)) }}>&raquo;</button>                
                        }
                      </div>
                    </div>
                  </div>
                </div>                                
              </div>
              {
                selectedSummonable.data.name &&
                <h5 className="summonable-subtitle center"><i>{selectedSummonable.data.type}</i></h5>
              }
            </div>

            {/* Hit Points display */}
            <Card>
                <h4 className="section-header">Hit Points</h4>
                <div className="hp container-fluid">
                    <div className="row">
                        <div className="col-6 hp-col">
                            <div className={`hp-display hp-display-${getHPRange(selectedSummonable.data.hitPoints.current, selectedSummonable.data.hitPoints.max)}`}>
                                {selectedSummonable.data.hitPoints.current} / {selectedSummonable.data.hitPoints.max}
                            </div>
                            <div className={`progress hp-progress ${selectedSummonable.data.hitPoints.current <= 0 ? "progress-zero" : ""}`} role="progressbar" aria-label="Summonable HP Progress Bar" aria-valuenow={getAsPercentage(selectedSummonable.data.hitPoints.current, selectedSummonable.data.hitPoints.max)} aria-valuemin={0} aria-valuemax={100}>
                                <div className={`progress-bar hp-progress-display-${getHPRange(selectedSummonable.data.hitPoints.current, selectedSummonable.data.hitPoints.max)}`} style={{ width: `${getAsPercentage(selectedSummonable.data.hitPoints.current, selectedSummonable.data.hitPoints.max)}%`}}></div>
                            </div>                                
                        </div>
                        <div className="col-6 hp-col">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#summonableActionModal"
                                onClick={() => { setSummonableAction('takeDamage') }}
                                disabled={selectedSummonable.data.hitPoints.current == 0}
                            >
                                Take Damage
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                data-bs-toggle="modal"
                                data-bs-target="#summonableActionModal"
                                onClick={() => { setSummonableAction('gainHP') }}
                                disabled={selectedSummonable.data.hitPoints.current == selectedSummonable.data.hitPoints.max}
                            >
                                Gain HP
                            </button>
                            <button
                                type="button"
                                className="btn btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#summonableActionModal"
                                onClick={() => { 
                                  setSummonableAction('refillHP');
                                }}
                                disabled={selectedSummonable.data.hitPoints.current == selectedSummonable.data.hitPoints.max}
                            >
                                Refill
                            </button>
                        </div>
                    </div>                  
                </div>
            </Card>

            {/* Attacks display (if any) */}
            {
              (selectedSummonable.data.attacks && selectedSummonable.data.attacks.length > 0) &&
              <Card>
                <h4 className="section-header">Attacks & Actions</h4>
                
                {
                  selectedSummonable.data.attacks.map(s => (
                    <Popover
                      key={s.id}
                      popoverBody={
                        <div dangerouslySetInnerHTML={{__html: s.description}}/>
                      }
                      customClass="left-justify display-item-row"
                    >
                    <div className="row">
                      <div className="col summonable-attack-name">{s.name.toUpperCase()} &nbsp;&nbsp;</div>
                      {
                        s.damage &&
                        <div className="col summonable-attack-content">
                          {s.damageType === DamageType.HEALING ? 'Effect:' : 'Damage:'} {s.damage} {s.damageType}
                        </div>
                      }
                    </div>          
                    </Popover>
                  ))
                }
              </Card>
            } 

            <Card>
              <h4 className="section-header">Stats</h4>
              {/* AC display */}
              <div className="container-fluid">
                <div className="row">
                  <div className="col summonable-stat">
                    <p className="center">AC:</p>
                    <h5>{selectedSummonable.data.armorClass}</h5>
                  </div>
                  {
                    Number(selectedSummonable.data.abilityScores?.proficiencyBonus) > 0 &&
                    <div className="col summonable-stat">
                      <p className="center">Proficiency Bonus:</p>
                      <h5>+{selectedSummonable.data.abilityScores?.proficiencyBonus}</h5>
                    </div>
                  }                  
                </div>
              </div>

              {/* Stat Block display */}
              {
                (selectedSummonable.data.abilityScores && selectedSummonable.data.abilityScores.strength >= 0) &&
                <div className="mini-stat-block center">
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>STR</b></div>
                    <p>{selectedSummonable.data.abilityScores.strength} ({getModifierFormatted(selectedSummonable.data.abilityScores.strength)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>DEX</b></div>
                    <p>{selectedSummonable.data.abilityScores.dexterity} ({getModifierFormatted(selectedSummonable.data.abilityScores.dexterity)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>CON</b></div>
                    <p>{selectedSummonable.data.abilityScores.constitution} ({getModifierFormatted(selectedSummonable.data.abilityScores.constitution)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>INT</b></div>
                    <p>{selectedSummonable.data.abilityScores.intelligence} ({getModifierFormatted(selectedSummonable.data.abilityScores.intelligence)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>WIS</b></div>
                    <p>{selectedSummonable.data.abilityScores.wisdom} ({getModifierFormatted(selectedSummonable.data.abilityScores.wisdom)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>CHA</b></div>
                    <p>{selectedSummonable.data.abilityScores.charisma} ({getModifierFormatted(selectedSummonable.data.abilityScores.charisma)})</p>
                  </div>
                </div>
              }
            </Card>           

            {/* Dismiss button and collapse button */}
            <Card customClass="no-border no-padding">
              <div className="summonable-title row summonable-bottom-btn-container">
                <div className="col no-padding">
                <div className="summonable-title-header-bottom">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmDismissSummonModal"
                    onClick={() => {
                      const otherSummonables = summonables.filter(s => s.id !== selectedSummonable.id && s.data.summoned === true && !s.data.selected);
                      setFormData({
                          ...getDefaultFormData(pcData),
                          [buildSummonableSummonedKey(selectedSummonable)]: false,
                          ...(otherSummonables[0] && {[buildSummonableSelectedKey(otherSummonables[0])]: true}),
                      });
                    }}
                  >
                    Dismiss
                  </button>
                </div>
                </div>              
              </div>
              {
                disableBackdrop &&
                <div className="collapse-btn collapse-btn-bottom">
                  <button className="btn" type="button"
                    onClick={() => {
                      setDisableBackdrop(false);
                      toggleSummonableDrawer();
                    }}
                  >
                    <p className="inline"><span className="collapse-icon">&lsaquo;</span> COLLAPSE</p>
                  </button>
                </div>
              }
            </Card>                      
          </div>
        </div>        
      </div>
    </div>
  )
}

export default SummonableDrawer;