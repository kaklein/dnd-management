import { useState } from "react";
import { Summonable } from "@models/playerCharacter/Summonable";
import { updateById } from "@services/firestore/crud/update";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { QueryClient } from "@tanstack/react-query";
import { triggerSuccessAlert } from "@pages/utils";
import { logError } from "@services/sentry/logger";

interface Props {
  action: string;  
  summonable: Summonable;
  setShowSuccessAlert: (show: boolean) => void;
  queryClient: QueryClient;
  searchParams: URLSearchParams;
  setDisableBackdrop: (newValue: boolean) => void;
  pcId: string;
}

function SummonableActionModal ({ action, summonable, setShowSuccessAlert, queryClient, searchParams, setDisableBackdrop, pcId }: Props) { 
  const itemDisplayName = summonable.data.name ?? summonable.data.type;
  const title = action == 'takeDamage' ? itemDisplayName + " Damage Amount:" :
    action == 'gainHP' ? itemDisplayName + " Gained HP Amount:" : 
    action == 'refillHP' ? "Refill " + itemDisplayName + " to Max HP?" :
    action == 'summon' ? "Summon " + itemDisplayName + "?" :
    undefined;
  const className = `modal fade ${action}`;
  const emptyModalData = {
    hpInputAmount: "",
  }

  const [submitData, setSubmitData] = useState({
    newHPAmount: summonable.data.hitPoints.current
  })
  const [modalFormData, setModalFormData] = useState(emptyModalData);

  const takeDamage = (damageTaken: number): number => {
    return Math.max(summonable.data.hitPoints.current - damageTaken, 0);
  }
  const gainHP = (gainedHP: number): number => {
    return Math.min(summonable.data.hitPoints.current + gainedHP, summonable.data.hitPoints.max);
  }
 
  return (
    <div className={className} id="summonableActionModal" autoFocus={false} tabIndex={-1} aria-labelledby="summonableActionModalLabel" aria-hidden="true">
      <form onSubmit={async (event) => {   
        event.preventDefault();

        if (['takeDamage', 'gainHP', 'refillHP'].includes(action)) {
          try {
            await updateById(CollectionName.SUMMONABLES, summonable.id, {
              'hitPoints.current': action === 'refillHP' ? summonable.data.hitPoints.max : submitData.newHPAmount
            } );
          } catch (e: any) {
            logError(e);
            alert('We encountered an error saving your changes. Please refresh the page and try again.');
            return;
          }
        } else if (['summon'].includes(action)) {
          try {
            await updateById(CollectionName.SUMMONABLES, summonable.id, {
              summoned: true
            });
            searchParams.set("showSummonable", "true");
            setDisableBackdrop(true);
          } catch (e: any) {
            logError(e);
            alert('We encountered an error saving your changes. Please refresh the page and try again.');
            return;
          }
        } else {
          throw Error ('Unknown action in summon modal: ' + action);
        }
        setModalFormData(emptyModalData);
        queryClient.refetchQueries({ queryKey: ['pcData', pcId]});
        triggerSuccessAlert(setShowSuccessAlert);       
      }}>
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="summonableActionModalLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
            onClick={() => {
              setModalFormData(emptyModalData);              
            }}/>
          </div>

          {/* Bodies */}
          {
            (action === 'takeDamage' || action === 'gainHP') &&
            <div className="modal-body">
              <input
                className="large-number-input"
                value={modalFormData.hpInputAmount}
                min="0"
                max="999"
                type="number"
                name="hpAmount"
                autoFocus
                onChange={
                  (event) => {
                    setModalFormData({hpInputAmount: event.target.value});
                    if (action === 'takeDamage') {
                      setSubmitData({newHPAmount: takeDamage(Number(event.target.value))});
                    } else {
                      setSubmitData({newHPAmount: gainHP(Number(event.target.value))});
                    }
                  }
                }
              />
            </div>
          }          

          {/* Footers/Submit buttons */}
          <div className="modal-footer modal-button-wide">
            {
              action === 'takeDamage' &&
              <button 
                type="submit"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.hpInputAmount) <= 0 || Number(modalFormData.hpInputAmount) > 999}
              >
                {`Take${" " + (Number(modalFormData.hpInputAmount) > 0 ? modalFormData.hpInputAmount : '')} Damage`}
              </button>
            }
            {
              action === 'gainHP' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.hpInputAmount) <= 0 || Number(modalFormData.hpInputAmount) > 999}
              >
                {`Gain${" " + (Number(modalFormData.hpInputAmount) > 0 ? modalFormData.hpInputAmount : '')} HP`}
              </button>
            }
            {
              action === 'refillHP' &&
              <>
              <button
                type="submit"
                className="btn btn-info"
                data-bs-dismiss="modal"
              >
                Yes, Refill to Max
              </button>
              </>
            }
            {
              action === 'summon' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                Yes, call them forth!
              </button>
            }           
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}

export default SummonableActionModal;