import { getSpendGoldButtonText } from "@pages/utils";
import { useState } from "react";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any
  ) => void;
  setFormData: (data: any) => void;
  action: string;
  currentGold: number;
}

function GoldModal ({ handleChange, handleSubmit, setFormData, action, currentGold }: Props) { 
  const title = action == 'gain' ? "Amount to Gain:" :
    action == 'spend' ? "Amount to Spend:" : 
    undefined;
  const className = `modal fade ${action}`;
  const [modalFormData, setModalFormData] = useState({
    goldAmount: ""
  });

  const spendGold = (goldSpent: number): number => {
    return Math.max(currentGold - goldSpent);
  }
  const gainGold = (goldGained: number): number => {
    return currentGold + goldGained;
  }
  
  return (
    <div className={className} id="goldModal" autoFocus={false} tabIndex={-1} aria-labelledby="goldModalLabel" aria-hidden="true">
      <form onSubmit={(event) => {
        handleSubmit(event);
        setModalFormData({goldAmount: ""});
      }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="goldModalLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalFormData({goldAmount: ""})}></button>
          </div>
          <div className="modal-body">
            { 
              action === 'spend' &&
              <p className="center gold-modal-txt">{currentGold.toLocaleString()} gold available</p>
            }
            <input
              className="large-number-input"
              value={modalFormData.goldAmount}
              min="0"
              max="99999"
              type="number"
              name="goldAmount"
              autoFocus
              onChange={
                (event) => {
                  setModalFormData({goldAmount: event.target.value});
                  const newGoldAmount = 
                    action === 'gain' ?
                    gainGold(Number(event.target.value)) :
                    spendGold(Number(event.target.value));
                  handleChange({target: {name: 'gold', value: newGoldAmount}}, setFormData);
                }
              }
            />
          </div>         
          <div className="modal-footer modal-button-wide">
            {
              action === 'gain' &&
              <button 
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.goldAmount) <= 0 || Number(modalFormData.goldAmount) > 99999}
              >
                {`Gain${" " + (Number(modalFormData.goldAmount) > 0 ? Number(modalFormData.goldAmount).toLocaleString() : '')} Gold`}
              </button>
            }
            {
              action === 'spend' &&
              <button
                type="submit"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                disabled={Number(modalFormData.goldAmount) <= 0 || Number(modalFormData.goldAmount) > currentGold || Number(modalFormData.goldAmount) > 99999}
              >
                { getSpendGoldButtonText(modalFormData.goldAmount) }
              </button>
            }
            { 
              (action === 'spend' && Number(modalFormData.goldAmount) > 0) &&
              <p className="center gold-modal-txt">You will have {(currentGold - Number(modalFormData.goldAmount)).toLocaleString()} gold left.</p>
            }
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}

export default GoldModal;