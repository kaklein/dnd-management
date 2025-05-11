import { Feature } from "@models/playerCharacter/Feature";
import { getAsPercentage } from "@pages/utils";

interface Props {
    feature: Feature;
    setResourceUseModalData: (data: any) => void;
}

function PoolDisplay ({ feature, setResourceUseModalData }: Props) {
    const currentUses = feature.data.currentUses ?? 0;
    const maxUses = feature.data.maxUses ?? 0;
    
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
                        setResourceUseModalData({
                            title: `Use ${feature.data.name}`,
                            action: 'use',
                            feature
                        });
                    }}
                    disabled={feature.data.currentUses == 0}
                >
                    Use
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#resourceUseModal"
                    onClick={() => { 
                        setResourceUseModalData({
                            title: `Gain Resources: ${feature.data.name}`,
                            action: 'gain',
                            feature
                        });
                    }}
                    disabled={feature.data.currentUses! >= feature.data.maxUses!}
                >
                    Gain
                </button>
                <button
                    type="button"
                    className="btn btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#resourceUseModal"
                    onClick={() => { 
                        setResourceUseModalData({
                            title: `Refill ${feature.data.name}?`,
                            action: 'refill',
                            feature
                        });
                    }}
                    disabled={feature.data.currentUses == feature.data.maxUses}
                >
                    Refill
                </button>

            </div>
        </div>
    </div>
    </>
}

export default PoolDisplay;