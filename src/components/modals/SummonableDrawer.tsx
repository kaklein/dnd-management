import Card from "@components/cards/Card";
import { buildSummonableSummonedKey } from "@components/utils";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Summonable } from "@models/playerCharacter/Summonable";
import { getDefaultFormData, getHPRange } from "@pages/utils";

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
            {/* Title bar and collapse button */}
            <div className="summonable-title-row">
              <div className="summonable-title row">
                <div className="col-10 no-padding">
                  <h4 className={`summonable-title-header ${summonable.data.name ? "summonable-title-header-flat-bottom" : ""}`}>{summonable.data.name ? summonable.data.name : summonable.data.type}</h4>
                </div>
                {
                  disableBackdrop &&
                  <div className="col-2 no-padding">
                    <button className="btn drawer-handle-btn handle-inline" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                      onClick={() => {
                        setDisableBackdrop(false);
                      }}
                    >
                      <img alt="collapse summoned item" src="/images/icons/summonable-collapse-icon-white.png" width="30px"/>
                    </button>
                  </div>
                }                
              </div>
              {
                summonable.data.name &&
                <h5 className="summonable-subtitle"><i>{summonable.data.type}</i></h5>
              }
            </div>

            {/* Hit Points display */}
            <Card>
                <h3 className="section-header">Hit Points</h3>
                <div className="hp container-fluid">
                    <div className="row">
                        <div className="col-6 hp-col">
                            <div className={`hp-display hp-display-${getHPRange(summonable.data.hitPoints.current, summonable.data.hitPoints.max)}`}>
                                {summonable.data.hitPoints.current} / {summonable.data.hitPoints.max}
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

            <Card>
              <h4 className="section-header">Stats</h4>
              {/* AC display */}
              <h5 className="center summonable-ac">AC: {summonable.data.armorClass}</h5>                    

              {/* Stat Block display */}
              {/* TODO: populate values from data */}
              <div className="mini-stat-block center">
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>STR</b></div>
                  <p>2 (-4)</p>
                </div>
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>DEX</b></div>
                  <p>14 (+2)</p>
                </div>
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>CON</b></div>
                  <p>8 (-1)</p>
                </div>
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>INT</b></div>
                  <p>2 (-4)</p>
                </div>
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>WIS</b></div>
                  <p>12 (+1)</p>
                </div>
                <div className="stat-block-item">
                  <div className="stat-block-item-title"><b>CHA</b></div>
                  <p>6 (-2)</p>
                </div>
              </div>
            </Card>
            

            {/* Attacks display (if any) */}
            {/* TODO: populate based on array of attacks from summonable */}
            <Card>
              <h4 className="section-header">Attacks</h4>
              <div className="display-item-row left-justify">
                <div className="summonable-attack-name">BEAK &nbsp;&nbsp;</div>
                <div className="summonable-attack-content">
                  Attack bonus: +4 &nbsp;&nbsp; Damage: 1d1 piercing
                </div>
              </div>
              <div className="display-item-row left-justify">
                <div className="summonable-attack-name">CAW &nbsp;&nbsp;</div>
                <div className="summonable-attack-content">
                  Attack bonus: +1 &nbsp;&nbsp; Damage: 1d1 psychic
                </div>
              </div>
            </Card>

            {/* Dismiss button and collapse button */}
            <Card customClass="no-border no-padding">
              <div className="summonable-title row summonable-bottom-btn-container">
                <div className="col-10 no-padding">
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
              {
                disableBackdrop &&
                <div className="col-2 no-padding">
                  <button className="btn drawer-handle-btn handle-inline" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    onClick={() => {
                      setDisableBackdrop(false);
                    }}
                  >
                    <img alt="collapse summoned item" src="/images/icons/summonable-collapse-icon-white.png" width="30px"/>
                  </button>
                </div>
              }
              </div>
            </Card>                      
          </div>
        </div>
        {
          !disableBackdrop &&
          <div className="col-auto drawer-handle">
              <button className="btn drawer-handle-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
              onClick={() => {
                setDisableBackdrop(!disableBackdrop);
              }}>
                <a href="#top">{ !disableBackdrop && <img alt="open summoned item" src="/images/icons/summonable-icon.png" width="40px"/>}</a>
              </button>
          </div>
        }
        
      </div>
    </div>
  )
}

export default SummonableDrawer;