import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { useState } from "react";
import RestModalBody from "./RestModalBody";
import { Feature } from "@models/playerCharacter/Feature";
import { sleep } from "@services/firestore/utils";
import { getDefaultFormData } from "@pages/utils";
import { RestType } from "@models/enum/RestType";

interface Props {
  handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
  handleSubmit: (
    event: any
  ) => void;
  setFormData: (data: any) => void;
  action: string;  
  pcData: PlayerCharacter;
  limitedUseFeatures: Feature[];
}

function HPModal ({ handleChange, handleSubmit, setFormData, action, pcData, limitedUseFeatures }: Props) { 
  const title = action == 'takeDamage' ? "Damage Amount:" :
    action == 'gainHP' ? "Gained HP Amount:" : 
    action == 'refillHP' ? "Refill to Max HP?" :
    action == 'editTempHP' ? "Edit Temporary HP" :
    action == 'addInspiration' ? "Gain 1 Inspiration?" :
    action == 'useInspiration' ? "Use 1 Inspiration?" :
    action == 'editAC' ? "Edit Armor Class" :
    action == 'shortRest' ? "Short Rest" :
    action == 'longRest' ? "Long Rest" :
    undefined;
  const className = `modal fade ${action}`;
  const emptyModalData = {
    hpAmount: "",
    tempHPAmount: "",
    acAmount: ""
  }
  const [modalFormData, setModalFormData] = useState(emptyModalData);

  const takeDamage = (damageTaken: number): number => {
    return Math.max(pcData.baseDetails.usableResources.hitPoints.current - damageTaken, 0);
  }
  const loseTempHP = (damageTaken: number): number => {
    if (damageTaken > pcData.baseDetails.usableResources.hitPoints.temporary) throw Error('Cannot lose more temp HP than you have!');
    return pcData.baseDetails.usableResources.hitPoints.temporary - damageTaken;
  }
  const gainHP = (gainedHP: number): number => {
    return Math.min(pcData.baseDetails.usableResources.hitPoints.current + gainedHP, pcData.baseDetails.usableResources.hitPoints.max);
  }

  // FOR SHORT REST/LONG REST
  const isWarlock = pcData.baseDetails.class.toUpperCase() === "WARLOCK" ? true : false;
  const srDefaultFormData = {
    refreshSRFeatures: true,
    resetSavingThrows: true,
    resetSpellSlots: isWarlock ? true : false
  };
  const lrDefaultFormData = {
    refillHP: true,
    removeTempHP: true,
    regainAllHitDice: true,
    regainHalfHitDice: false,
    resetSpellSlots: true,
    resetLRFeatures: true,
    resetSavingThrows: true
  }
  const [shortRestFormData, setShortRestFormData] = useState(srDefaultFormData);
  const [longRestFormData, setLongRestFormData] = useState(lrDefaultFormData);

  const srFeaturesDisabled = (
    limitedUseFeatures.filter(f => 
      f.data.refresh === RestType.SHORT && f.data.currentUses! < f.data.maxUses!
    ).length < 1
  );
  const savingThrowsDisabled = (
    pcData.baseDetails.usableResources.deathSaves.successesRemaining == 3 &&
    pcData.baseDetails.usableResources.deathSaves.failuresRemaining == 3
  );
  const spellSlotsDisabled = (
    pcData.spellSlots == undefined ||
    pcData.spellSlots.length < 1 ||
    pcData.spellSlots.filter(f => f.data.current < f.data.max).length < 1
  )
  const srDisabled = {
    features: srFeaturesDisabled,
    savingThrows: savingThrowsDisabled,
    spellSlots: spellSlotsDisabled,
    all: srFeaturesDisabled && savingThrowsDisabled && (!isWarlock || (isWarlock && spellSlotsDisabled))
  };

  const hpDisabled = pcData.baseDetails.usableResources.hitPoints.current == pcData.baseDetails.usableResources.hitPoints.max;
  const tempHPDisabled = pcData.baseDetails.usableResources.hitPoints.temporary < 1;
  const lrFeaturesDisabled = (
    limitedUseFeatures.filter(f => 
      (f.data.refresh === RestType.SHORT || f.data.refresh === RestType.LONG) && f.data.currentUses! < f.data.maxUses!
    ).length < 1
  );
  const hitDiceDisabled = pcData.baseDetails.usableResources.hitDice.current === pcData.baseDetails.usableResources.hitDice.max;
  const lrDisabled = {
    hitPoints: hpDisabled,
    tempHP: tempHPDisabled,
    spellSlots: spellSlotsDisabled,
    features: lrFeaturesDisabled,
    savingThrows: savingThrowsDisabled,
    hitDice: hitDiceDisabled,
    all: hpDisabled && tempHPDisabled && spellSlotsDisabled && lrFeaturesDisabled && savingThrowsDisabled && hitDiceDisabled
  }
  
  return (
    <div className={className} id="hpModal" autoFocus={false} tabIndex={-1} aria-labelledby="hpModalLabel" aria-hidden="true">
      <form onSubmit={async (event) => {
        if (
          (action === 'shortRest' && srDisabled.all) ||
          (action === 'longRest' && lrDisabled.all)
        ) {
          event.preventDefault();
          setFormData(getDefaultFormData(pcData));
        } else {
          handleSubmit(event);
          await sleep(1000);
          setModalFormData(emptyModalData);
          if (action === "shortRest" || action === "longRest") {
            window.location.reload();
          }
        }       
      }}>
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="hpModalLabel">{title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
            onClick={() => {
              setModalFormData(emptyModalData);
              setShortRestFormData(srDefaultFormData);
              setLongRestFormData(lrDefaultFormData);
              setFormData(getDefaultFormData(pcData));
            }}/>
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
                      if (pcData.baseDetails.usableResources.hitPoints.temporary > 0) {
                        const tempHPTaken = Math.min(remainingDamage, pcData.baseDetails.usableResources.hitPoints.temporary);
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
                (action == 'takeDamage' && pcData.baseDetails.usableResources.hitPoints.temporary > 0) &&
                <p className="center gold-modal-txt">Damage will be subtracted from Temporary HP ({pcData.baseDetails.usableResources.hitPoints.temporary}) first.</p>
              }
            </div>
          }
          {
            action === 'editTempHP' &&
            <div className="modal-body">
              <p className="center gold-modal-text">Current: {pcData.baseDetails.usableResources.hitPoints.temporary}</p>
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
              <p className="center gold-modal-text">Current: {pcData.baseDetails.armorClass}</p>
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
          {
            action == 'shortRest' &&
            <div className="modal-body">
              <RestModalBody
                restType="short"
                pcData={pcData}
                setFormData={setFormData}
                handleChange={handleChange} 
                limitedUseFeatures={limitedUseFeatures}
                spellSlots={pcData.spellSlots ?? []}
                shortRestFormData={shortRestFormData}
                setShortRestFormData={setShortRestFormData}
                shortRestDisabled={srDisabled}
              />
            </div>
          }
          {
            action == 'longRest' &&
            <div className="modal-body">
              <RestModalBody
                restType="long"
                pcData={pcData}
                setFormData={setFormData}
                handleChange={handleChange} 
                limitedUseFeatures={limitedUseFeatures}
                spellSlots={pcData.spellSlots ?? []}
                longRestFormData={longRestFormData}
                setLongRestFormData={setLongRestFormData}
                longRestDisabled={lrDisabled}
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
                  Number(modalFormData.tempHPAmount) == pcData.baseDetails.usableResources.hitPoints.temporary
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
                  Number(modalFormData.acAmount) == pcData.baseDetails.armorClass
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
                Yes, {`${pcData.baseDetails.name.firstName ? pcData.baseDetails.name.firstName + ' is' : "I'm"}`} inspired!
              </button>
            }
            {
              (action == 'shortRest' || action == 'longRest') &&
              <button
                type="submit"
                className="btn btn-info"
                data-bs-dismiss="modal"
              >
                Take {action == 'shortRest' ? 'Short' : 'Long'} Rest
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