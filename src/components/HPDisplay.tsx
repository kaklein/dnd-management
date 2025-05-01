import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { getDefaultFormData, getAsPercentage, getHPRange } from "@pages/utils";

interface Props {
    pcData: PlayerCharacter;
    setHPModalAction: (action: string) => void;
    setFormData: (data: any) => void;
}

function HPDisplay ({pcData, setHPModalAction, setFormData}: Props) {
    return <>
        <h3 className="section-header">Hit Points</h3>
        <div className="hp container-fluid">
            <div className="row">
                <div className="col-6 hp-col">
                    <div className={`hp-display hp-display-${getHPRange(pcData.baseDetails.usableResources.hitPoints.current, pcData.baseDetails.usableResources.hitPoints.max)}`}>
                        {pcData.baseDetails.usableResources.hitPoints.current} / {pcData.baseDetails.usableResources.hitPoints.max}
                    </div>
                    <div className={`progress hp-progress ${pcData.baseDetails.usableResources.hitPoints.current <= 0 ? "progress-zero" : ""}`} role="progressbar" aria-label="HP Progress Bar" aria-valuenow={getAsPercentage(pcData.baseDetails.usableResources.hitPoints.current, pcData.baseDetails.usableResources.hitPoints.max)} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`progress-bar hp-progress-display-${getHPRange(pcData.baseDetails.usableResources.hitPoints.current, pcData.baseDetails.usableResources.hitPoints.max)}`} style={{ width: `${getAsPercentage(pcData.baseDetails.usableResources.hitPoints.current, pcData.baseDetails.usableResources.hitPoints.max)}%`}}></div>
                    </div>
                </div>
                <div className="col-6 hp-col">
                    <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#hpModal"
                        onClick={() => { setHPModalAction('takeDamage') }}
                        disabled={pcData.baseDetails.usableResources.hitPoints.current == 0}
                    >
                        Take Damage
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#hpModal"
                        onClick={() => { setHPModalAction('gainHP') }}
                        disabled={pcData.baseDetails.usableResources.hitPoints.current == pcData.baseDetails.usableResources.hitPoints.max}
                    >
                        Gain HP
                    </button>
                    <button
                        type="button"
                        className="btn btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#hpModal"
                        onClick={() => { 
                            setHPModalAction('refillHP');
                            setFormData({
                                ...getDefaultFormData(pcData),
                                hitPointsCurrent: pcData.baseDetails.usableResources.hitPoints.max,
                            });
                        }}
                        disabled={pcData.baseDetails.usableResources.hitPoints.current == pcData.baseDetails.usableResources.hitPoints.max}
                    >
                        Refill
                    </button>
                </div>
            </div>                  
        </div>
    </>
}

export default HPDisplay;