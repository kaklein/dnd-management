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
    <div className="container-fluid summonable">
      <div className="row">       
        
        
        <div className={className} id="collapseExample">
          <div className="summonable-content">
            {summonable.data.name &&
            <>
              <h4 className="section-header summonable-title">{summonable.data.name}</h4>
              <h5 className="summonable-subtitle"><i>{summonable.data.type}</i></h5>
            </>
            }
            {
              !summonable.data.name &&
              <h4 className="section-header">{summonable.data.type}</h4>
            }

            {/* Hit Points display */}
            <Card customClass="">
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

            {/* AC display */}
            <h5 className="center summonable-ac">AC: {summonable.data.armorClass}</h5>                    

            {/* Dismiss button */}
            <Card customClass="no-border no-padding">
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
            </Card>                      
          </div>
        </div>
        <div className="col-auto drawer-handle">
            <button className="btn drawer-handle-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
            onClick={() => {
              setDisableBackdrop(!disableBackdrop);
            }}>
              { !disableBackdrop && <img alt="open summoned item" src="/images/icons/summonable-icon.png" width="40px"/>}
              { disableBackdrop && <img alt="collapse summoned item" src="/images/icons/summonable-collapse-icon.png" width="40px"/>}
            </button>
        </div>
      </div>
    </div>
  )
}

export default SummonableDrawer;