import Card from "@components/cards/Card";
import { buildSummonableSummonedKey } from "@components/utils";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Summonable } from "@models/playerCharacter/Summonable";
import { getAsPercentage, getDefaultFormData, getHPRange } from "@pages/utils";
import Popover from "./Popover";
import { getModifierFormatted } from "@services/firestore/utils";
import { DamageType } from "@models/enum/DamageType";

interface Props {
  summonable: Summonable;
  pcData: PlayerCharacter;
  setFormData: (data: any) => void;
  searchParams: URLSearchParams;
  setSummonableAction: (action: 'gainHP' | 'takeDamage' | 'refillHP' | '') => void;
  setDisableBackdrop: (newValue: boolean) => void;
  disableBackdrop: boolean;
}

function SummonableDrawer ({summonable, pcData, setFormData, searchParams, setSummonableAction, setDisableBackdrop, disableBackdrop}: Props) {
  if (!summonable.id) return;
  let className = "col-auto collapse collapse-horizontal drawer-body popup";
  className = searchParams.get("showSummonable") == "true" ? className.concat(" show") : className;

  return (
    <div className="container-fluid summonable" id="top">
      <div className="row">
        <div className={className} id="collapseExample">          
          <div className="summonable-content" style={{width: "93vw"}}>
            {/* Collapse button */}
            {
              disableBackdrop &&
              <div className="collapse-btn collapse-btn-top">
                <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                  onClick={() => {
                    setDisableBackdrop(false);
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
                  <h4 className={`summonable-title-header ${summonable.data.name ? "summonable-title-header-flat-bottom" : ""}`}>{summonable.data.name ? summonable.data.name : summonable.data.type}</h4>
                </div>                                
              </div>
              {
                summonable.data.name &&
                <h5 className="summonable-subtitle"><i>{summonable.data.type}</i></h5>
              }
            </div>

            {/* Hit Points display */}
            <Card>
                <h4 className="section-header">Hit Points</h4>
                <div className="hp container-fluid">
                    <div className="row">
                        <div className="col-6 hp-col">
                            <div className={`hp-display hp-display-${getHPRange(summonable.data.hitPoints.current, summonable.data.hitPoints.max)}`}>
                                {summonable.data.hitPoints.current} / {summonable.data.hitPoints.max}
                            </div>
                            <div className={`progress hp-progress ${summonable.data.hitPoints.current <= 0 ? "progress-zero" : ""}`} role="progressbar" aria-label="Summonable HP Progress Bar" aria-valuenow={getAsPercentage(summonable.data.hitPoints.current, summonable.data.hitPoints.max)} aria-valuemin={0} aria-valuemax={100}>
                                <div className={`progress-bar hp-progress-display-${getHPRange(summonable.data.hitPoints.current, summonable.data.hitPoints.max)}`} style={{ width: `${getAsPercentage(summonable.data.hitPoints.current, summonable.data.hitPoints.max)}%`}}></div>
                            </div>                                
                        </div>
                        <div className="col-6 hp-col">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#summonableActionModal"
                                onClick={() => { setSummonableAction('takeDamage') }}
                                disabled={summonable.data.hitPoints.current == 0}
                            >
                                Take Damage
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                data-bs-toggle="modal"
                                data-bs-target="#summonableActionModal"
                                onClick={() => { setSummonableAction('gainHP') }}
                                disabled={summonable.data.hitPoints.current == summonable.data.hitPoints.max}
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
                                disabled={summonable.data.hitPoints.current == summonable.data.hitPoints.max}
                            >
                                Refill
                            </button>
                        </div>
                    </div>                  
                </div>
            </Card>

            {/* Attacks display (if any) */}
            {
              (summonable.data.attacks && summonable.data.attacks.length > 0) &&
              <Card>
                <h4 className="section-header">Attacks & Actions</h4>
                
                {
                  summonable.data.attacks.map(s => (
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
                    <h5>{summonable.data.armorClass}</h5>
                  </div>
                  {
                    Number(summonable.data.abilityScores?.proficiencyBonus) > 0 &&
                    <div className="col summonable-stat">
                      <p className="center">Proficiency Bonus:</p>
                      <h5>+{summonable.data.abilityScores?.proficiencyBonus}</h5>
                    </div>
                  }                  
                </div>
              </div>

              {/* Stat Block display */}
              {
                (summonable.data.abilityScores && summonable.data.abilityScores.strength >= 0) &&
                <div className="mini-stat-block center">
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>STR</b></div>
                    <p>{summonable.data.abilityScores.strength} ({getModifierFormatted(summonable.data.abilityScores.strength)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>DEX</b></div>
                    <p>{summonable.data.abilityScores.dexterity} ({getModifierFormatted(summonable.data.abilityScores.dexterity)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>CON</b></div>
                    <p>{summonable.data.abilityScores.constitution} ({getModifierFormatted(summonable.data.abilityScores.constitution)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>INT</b></div>
                    <p>{summonable.data.abilityScores.intelligence} ({getModifierFormatted(summonable.data.abilityScores.intelligence)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>WIS</b></div>
                    <p>{summonable.data.abilityScores.wisdom} ({getModifierFormatted(summonable.data.abilityScores.wisdom)})</p>
                  </div>
                  <div className="stat-block-item">
                    <div className="stat-block-item-title"><b>CHA</b></div>
                    <p>{summonable.data.abilityScores.charisma} ({getModifierFormatted(summonable.data.abilityScores.charisma)})</p>
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
                      setFormData({
                          ...getDefaultFormData(pcData),
                          [buildSummonableSummonedKey(summonable)]: false,
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
                  <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    onClick={() => {
                      setDisableBackdrop(false);
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