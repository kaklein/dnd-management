import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any
  ) => void;
  setFormData: (data: any) => void;
  action: string;
  pcHitPoints: {
    current:  number;
    max: number;
    temporary: number;
  };
  currentAC: number;
  pcName?: string;
}

function HPModal ({ handleChange, handleSubmit, setFormData, action, pcHitPoints, currentAC, pcName=undefined }: Props) { 
  const title = action == 'takeDamage' ? "Damage Amount:" :
    action == 'gainHP' ? "Gained HP Amount:" : 
    action == 'refillHP' ? "Refill to Max HP?" :
    action == 'editTempHP' ? "Edit Temporary HP" :
    action == 'addInspiration' ? "Gain 1 Inspiration?" :
    action == 'useInspiration' ? "Use 1 Inspiration?" :
    action == 'editAC' ? "Edit Armor Class" :
    undefined;
  const className = `modal fade ${action}`;
  const emptyModalData = {
    hpAmount: "",
    tempHPAmount: "",
    acAmount: ""
  }
  const [modalFormData, setModalFormData] = useState(emptyModalData);

  const takeDamage = (damageTaken: number): number => {
    return Math.max(pcHitPoints.current - damageTaken, 0);
  }
  const loseTempHP = (damageTaken: number): number => {
    if (damageTaken > pcHitPoints.temporary) throw Error('Cannot lose more temp HP than you have!');
    return pcHitPoints.temporary - damageTaken;
  }
  const gainHP = (gainedHP: number): number => {
    return Math.min(pcHitPoints.current + gainedHP, pcHitPoints.max);
  }
  
  return (
    <div className={className} id="hpModal" autoFocus={false} tabIndex={-1} aria-labelledby="hpModalLabel" aria-hidden="true">
      <form onSubmit={(event) => {
        handleSubmit(event);
        setModalFormData(emptyModalData);
      }}>
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="hpModalLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalFormData(emptyModalData)}></button>
          </div>

          {/* Bodies */}
          {
            (action === 'takeDamage' || action === 'gainHP') &&
            <div className="modal-body">
              <input
                className="large-number-input"
                value={modalFormData.hpAmount}
                min="0"
                max="999"
                type="number"
                name="hpAmount"
                autoFocus
                onChange={
                  (event) => {
                    setModalFormData({...emptyModalData, hpAmount: event.target.value});
                    let newCurrentHP;
                    let newTempHP;
                    if (action === 'takeDamage') {
                      let remainingDamage = Number(event.target.value);
                      // check for temp HP and take from there first
                      if (pcHitPoints.temporary > 0) {
                        const tempHPTaken = Math.min(remainingDamage, pcHitPoints.temporary);
                        newTempHP = loseTempHP(tempHPTaken);
                        remainingDamage = remainingDamage - tempHPTaken;
                        handleChange({target: {name: 'hitPointsTemporary', value: newTempHP}}, setFormData);
                      }
                      // take any remaining from regular HP
                      if (remainingDamage > 0) {
                        newCurrentHP = takeDamage(remainingDamage);
                        handleChange({target: {name: 'hitPointsCurrent', value: newCurrentHP}}, setFormData);
                      }
                    } else {
                      newCurrentHP = gainHP(Number(event.target.value));
                      handleChange({target: {name: 'hitPointsCurrent', value: newCurrentHP}}, setFormData);
                    }
                  }
                }
              />
              {
                (action == 'takeDamage' && pcHitPoints.temporary > 0) &&
                <p className="center gold-modal-txt">Damage will be subtracted from Temporary HP ({pcHitPoints.temporary}) first.</p>
              }
            </div>
          }
          {
            action === 'editTempHP' &&
            <div className="modal-body">
              <p className="center gold-modal-text">Current: {pcHitPoints.temporary}</p>
              <input className="large-number-input"
              value={modalFormData.tempHPAmount}
              min="0"
              max="99"
              type="number"
              name="tempHPAmount"
              id="tempHPAmount"
              autoFocus
              onChange={(event) => {
                setModalFormData({...emptyModalData, tempHPAmount: event.target.value});
                handleChange({target: {name: 'hitPointsTemporary', value: Number(event.target.value)}}, setFormData);
              }}
              />
            </div>
          }
          {
            action === 'editAC' &&
            <div className="modal-body">
              <p className="center gold-modal-text">Current: {currentAC}</p>
              <input className="large-number-input"
              value={modalFormData.acAmount}
              min="0"
              max="99"
              type="number"
              name="acAmount"
              id="acAmount"
              autoFocus
              onChange={(event) => {
                setModalFormData({...emptyModalData, acAmount: event.target.value});
                handleChange({target: {name: 'armorClass', value: Number(event.target.value)}}, setFormData);
              }}
              />
            </div>
          }
          {
            action === 'useInspiration' &&
            <div className="modal-body">
              <p className="center gold-modal-text">
                Gives advantage on one attack roll, saving throw, or ability check.
              </p>
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
                disabled={Number(modalFormData.hpAmount) <= 0 || Number(modalFormData.hpAmount) > 999}
              >
                {`Take${" " + (Number(modalFormData.hpAmount) > 0 ? modalFormData.hpAmount : '')} Damage`}
              </button>
            }
            {
              action === 'gainHP' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.hpAmount) <= 0 || Number(modalFormData.hpAmount) > 999}
              >
                {`Gain${" " + (Number(modalFormData.hpAmount) > 0 ? modalFormData.hpAmount : '')} HP`}
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
              action === 'editTempHP' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={
                  Number(modalFormData.tempHPAmount) < 0 || 
                  Number(modalFormData.tempHPAmount) > 99 || 
                  modalFormData.tempHPAmount == "" ||
                  Number(modalFormData.tempHPAmount) == pcHitPoints.temporary
                }
              >
                {`Set Temporary HP ${modalFormData.tempHPAmount ? 'to ' + Number(modalFormData.tempHPAmount) : ""}`}
              </button>
            }
            {
              action === 'editAC' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={
                  Number(modalFormData.acAmount) < 0 || 
                  Number(modalFormData.acAmount) > 99 || 
                  modalFormData.acAmount == "" ||
                  Number(modalFormData.acAmount) == currentAC
                }
              >
                {`Set AC ${modalFormData.acAmount ? 'to ' + Number(modalFormData.acAmount) : ""}`}
              </button>
            }
            {
              action == 'useInspiration' &&
              <button
                type="submit"
                className="btn btn-insp-pink"
                data-bs-dismiss="modal"
              >
                Use it!
              </button>
            }
            {
              action == 'addInspiration' &&
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"                
              >
                Yes, {`${pcName ? pcName + ' is' : "I'm"}`} inspired!
              </button>
            }
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}

export default HPModal;