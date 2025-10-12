import { Feature } from "@models/playerCharacter/Feature";
import { getAsPercentage } from "@pages/utils";

interface Props {
    feature: Feature;
    setResourceUseModalData: (data: any) => void;
    disabled?: boolean;
}

function PoolDisplay ({ ...props }: Props) {
    const currentUses = props.feature.data.currentUses ?? 0;
    const maxUses = props.feature.data.maxUses ?? 0;
    
    return <>
    <div className="resource-use container-fluid">
        <div className="row">
            <div className="col-6 hp-col">
                <div className={`resource-use-display ${currentUses === 0 ? "resource-use-display-none" : undefined}`}>
                    {currentUses} / {maxUses}
                </div>
                <div className={`progress resource-progress`} role="progressbar" aria-label="Resource Progress Bar" aria-valuenow={currentUses / maxUses} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-bar bg-info" style={{ width: `${getAsPercentage(currentUses, maxUses)}%`}}></div>
                </div>
            </div>
            <div className="col-6 hp-col">
                <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#resourceUseModal"
                    onClick={() => {
                        props.setResourceUseModalData({
                            title: `Use ${props.feature.data.name}`,
                            action: 'use',
                            feature: props.feature
                        });
                    }}
                    disabled={props.feature.data.currentUses == 0 || props.disabled}
                >
                    Use
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#resourceUseModal"
                    onClick={() => { 
                        props.setResourceUseModalData({
                            title: `Gain Resources: ${props.feature.data.name}`,
                            action: 'gain',
                            feature: props.feature
                        });
                    }}
                    disabled={props.feature.data.currentUses! >= props.feature.data.maxUses! || props.disabled}
                >
                    Gain
                </button>
                <button
                    type="button"
                    className="btn btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#resourceUseModal"
                    onClick={() => { 
                        props.setResourceUseModalData({
                            title: `Refill ${props.feature.data.name}?`,
                            action: 'refill',
                            feature: props.feature
                        });
                    }}
                    disabled={props.feature.data.currentUses == props.feature.data.maxUses || props.disabled}
                >
                    Refill
                </button>

            </div>
        </div>
    </div>
    </>
}

export default PoolDisplay;