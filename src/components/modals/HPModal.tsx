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
  };
}

function HPModal ({ handleChange, handleSubmit, setFormData, action, pcHitPoints }: Props) { 
  const title = action == 'takeDamage' ? "Damage Amount:" :
    action == 'gainHP' ? "Gained HP Amount:" : 
    action == 'refillHP' ? "Refill to Max HP?" :
    undefined;
  const className = `modal fade ${action}`;
  const [modalFormData, setModalFormData] = useState({
    hpAmount: ""
  });

  const takeDamage = (damageTaken: number): number => {
    return Math.max(pcHitPoints.current - damageTaken, 0);
  }
  const gainHP = (gainedHP: number): number => {
    return Math.min(pcHitPoints.current + gainedHP, pcHitPoints.max);
  }
  
  return (
    <div className={className} id="hpModal" autoFocus={false} tabIndex={-1} aria-labelledby="hpModalLabel" aria-hidden="true">
      <form onSubmit={(event) => {
        handleSubmit(event);
        setModalFormData({hpAmount: ""});
      }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="hpModalLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalFormData({hpAmount: ""})}></button>
          </div>
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
                    setModalFormData({hpAmount: event.target.value});
                    const newCurrentHP = 
                      action === 'takeDamage' ?
                      takeDamage(Number(event.target.value)) :
                      gainHP(Number(event.target.value));
                    handleChange({target: {name: 'hitPointsCurrent', value: newCurrentHP}}, setFormData);
                  }
                }
              />
            </div>
          }

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
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}

export default HPModal;