import { buildFeatureCurrentUsesKey } from "@components/utils";
import { Feature } from "@models/playerCharacter/Feature";
import { useState } from "react";

interface Props {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, explicitFormData?: any) => void;
    formData: any;
    modalData: {
        title: string;
        action: 'use' | 'gain' | 'refill' | '';
        feature: Feature;
    }
}

function ResourceUseModal ({ handleSubmit, formData, modalData }: Props) {
    const currentResources = modalData.feature.data.currentUses ?? 0;
    const maxResources = modalData.feature.data.maxUses ?? 0;
    
    const formKey = buildFeatureCurrentUsesKey(modalData.feature);
    
    const className = `modal fade ${modalData.action}`;
    
    const [modalFormData, setModalFormData] = useState({
        resourceAmount: ""
    });
    const [updatedCurrentUses, setUpdatedCurrentUses] = useState(currentResources);

    const useResources = (amountSpent: number): number => {
    return Math.max(currentResources - amountSpent);
    }
    const gainResources = (amountGained: number): number => {
    return currentResources + amountGained;
    }
    
    return (
    <div className={className} id="resourceUseModal" autoFocus={false} tabIndex={-1} aria-labelledby="resourceUseModalLabel" aria-hidden="true">
      <form onSubmit={(event) => {
        if (modalData.action === 'refill') {
            handleSubmit(event, {
                ...formData,
                [formKey]: String(maxResources)
            });
        } else {
            handleSubmit(event, {
                ...formData,
                [formKey]: String(updatedCurrentUses)
            });
        }        
        setModalFormData({resourceAmount: ""});
      }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="resourceUseModalLabel">{modalData.title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalFormData({resourceAmount: ""})}></button>
          </div>
          {
            (modalData.action === 'use' || modalData.action === 'gain') &&
                <div className="modal-body">
                { 
                modalData.action === 'use' &&
                <p className="center gold-modal-txt">{currentResources.toLocaleString()} resources available</p>
                }
                {
                    (modalData.action === 'use' || modalData.action === 'gain') &&
                    <input
                        className="large-number-input"
                        value={modalFormData.resourceAmount}
                        min="0"
                        max="99999"
                        type="number"
                        name="amount"
                        autoFocus
                        onChange={
                            (event) => {
                                setModalFormData({resourceAmount: event.target.value});
                                const newAmount = 
                                    modalData.action === 'gain' ?
                                    gainResources(Number(event.target.value)) :
                                    useResources(Number(event.target.value));
                                setUpdatedCurrentUses(newAmount);
                            }
                        }
                    />
                }            
            </div> 
          }
                  
          <div className="modal-footer modal-button-wide">
            {
              modalData.action === 'gain' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.resourceAmount) <= 0 || Number(modalFormData.resourceAmount) > (maxResources - currentResources)}
              >
                {`Gain${" " + (Number(modalFormData.resourceAmount) > 0 ? Number(modalFormData.resourceAmount).toLocaleString() : '')} Resources`}
              </button>
            }
            {
              modalData.action === 'use' &&
              <button
                type="submit"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.resourceAmount) <= 0 || Number(modalFormData.resourceAmount) > currentResources || Number(modalFormData.resourceAmount) > maxResources}
              >
                {`Use${" " + (Number(modalFormData.resourceAmount) > 0 ? Number(modalFormData.resourceAmount).toLocaleString() : '')} Resources`}
              </button>
            }
            { 
              (modalData.action === 'use' && Number(modalFormData.resourceAmount) > 0) &&
              <p className="center gold-modal-txt">You will have {(currentResources - Number(modalFormData.resourceAmount)).toLocaleString()} left.</p>
            }
            {
                modalData.action === 'refill' &&
                <button
                    type="submit"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    disabled={currentResources >= maxResources}
                >
                    Yes, Refill to Max ({maxResources})
                </button>
            }
          </div>
        </div>
      </div>
      </form>
    </div>
    )
}

export default ResourceUseModal;