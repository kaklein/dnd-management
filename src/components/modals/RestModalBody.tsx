import { buildFeatureCurrentUsesKey, buildSpellSlotsCurrentKey } from "@components/utils";
import { RestType } from "@models/enum/RestType";
import { Feature } from "@models/playerCharacter/Feature";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";

interface Props {
  restType: "short" | "long";
  pcData: PlayerCharacter;
  setFormData: (data: any) => void;
  handleChange: (event: any, setFunction: (data: any) => void) => void;
  limitedUseFeatures: Feature[];
  spellSlots: SpellSlot[];
  shortRestFormData?: any;
  setShortRestFormData?: (data: any) => void;
  shortRestDisabled?: {
    features: boolean;
    savingThrows: boolean;
    spellSlots: boolean;
    all: boolean;
  }
  longRestFormData?: any;
  setLongRestFormData?: (data: any) => void;
  longRestDisabled?: {
    hitPoints: boolean;
    tempHP: boolean;
    spellSlots: boolean;
    features: boolean;
    savingThrows: boolean;
    hitDice: boolean;
    all: boolean;
  }
}

const noRefreshMessage = (customText?: string) => {
  return (
    <span className="no-refresh-message"> [{customText ?? 'None available to refresh'}]</span>
  ) 
}

function RestModalBody({restType, pcData, setFormData, handleChange, limitedUseFeatures, spellSlots, shortRestFormData, setShortRestFormData, longRestFormData, setLongRestFormData, shortRestDisabled, longRestDisabled}: Props) {  
  if (restType === 'short') {
    if(!setShortRestFormData || !shortRestDisabled) throw Error('Missing required params for short rest');
    const isWarlock = pcData.baseDetails.class.toUpperCase() === "WARLOCK" ? true : false;

    return (
      <div>
        {
          !shortRestDisabled.all &&<p>The selected resources will be automatically reset:</p>
        }
        {
          shortRestDisabled.all &&<p>No resources need to be refreshed right now. But {pcData.baseDetails.name.firstName} can still take a nap or something!</p>
        }
        <div>
          <input
            type="checkbox"
            checked={shortRestFormData.refreshSRFeatures}
            name="refreshSRFeatures"
            id="refreshSRFeatures"
            onChange={() => {
              setShortRestFormData({
                ...shortRestFormData,
                refreshSRFeatures: !shortRestFormData.refreshSRFeatures
              });
              if (!shortRestFormData.refreshSRFeatures) {
                limitedUseFeatures.filter(f => f.data.refresh == RestType.SHORT).map(f => {
                  const key = buildFeatureCurrentUsesKey(f);
                  handleChange({target: {name: key, value: f.data.maxUses}}, setFormData);
                });
              } else {
                limitedUseFeatures.filter(f => f.data.refresh == RestType.SHORT).map(f => {
                  const key = buildFeatureCurrentUsesKey(f);
                  handleChange({target: {name: key, value: f.data.currentUses}}, setFormData);
                });
              }
            }}
            disabled={shortRestDisabled.features}
          />
          <div className={shortRestDisabled.features ? "no-refresh-msg inline" : "inline"}><label htmlFor="refreshSRFeatures"><b>Features</b> that refresh on a short rest {shortRestDisabled.features && noRefreshMessage()}</label></div>
        </div>
        
        <div>
          <input
            type="checkbox"
            checked={shortRestFormData.resetSavingThrows}
            name="resetSavingThrows"
            id="resetSavingThrows"
            onChange={() => {
              setShortRestFormData({
                ...shortRestFormData,
                resetSavingThrows: !shortRestFormData.resetSavingThrows
              });
              if (!shortRestFormData.resetSavingThrows) {
                handleChange({target: {name: 'deathSavesSuccesses', value: 3}}, setFormData);
                handleChange({target: {name: 'deathSavesFailures', value: 3}}, setFormData);
              } else {
                handleChange({target: {name: 'deathSavesSuccesses', value: pcData.baseDetails.usableResources.deathSaves.successesRemaining}}, setFormData);
                handleChange({target: {name: 'deathSavesFailures', value: pcData.baseDetails.usableResources.deathSaves.successesRemaining}}, setFormData);
              }
            }}
            disabled={shortRestDisabled.savingThrows}
          />
          <div className={shortRestDisabled.savingThrows ? "no-refresh-msg inline" : "inline"}><label htmlFor="resetSavingThrows"><b>Saving throws</b>{shortRestDisabled.savingThrows && noRefreshMessage()}</label></div>
        </div>

        {
          isWarlock &&
          <div>
            <input
              type="checkbox"
              checked={shortRestFormData.resetSpellSlots}
              name="resetSpellSlots"
              id="resetSpellSlots"
              onChange={() => {
                setShortRestFormData({
                  ...shortRestFormData,
                  resetSpellSlots: !shortRestFormData.resetSpellSlots
                });                
                if (!shortRestFormData.resetSpellSlots) {
                  spellSlots.map(s => {
                    const key = buildSpellSlotsCurrentKey(s);
                    handleChange({target: {name: key, value: s.data.max}}, setFormData);
                  });
                } else {
                  spellSlots.map(s => {
                    const key = buildSpellSlotsCurrentKey(s);
                    handleChange({target: {name: key, value: s.data.current}}, setFormData);
                  });
                }
              }}
              disabled={shortRestDisabled.spellSlots}
            />
            <div className={shortRestDisabled.spellSlots ? "no-refresh-msg inline" : "inline"}><label htmlFor="resetSpellSlots"><b>Spell slots</b> (Warlocks only){shortRestDisabled.spellSlots && noRefreshMessage()}</label></div>
            </div>
        }
      </div>
    )
  } else {
    if(!setLongRestFormData || !longRestDisabled) throw Error('Missing required params for long rest');
    return (
      <div>
        {
          !longRestDisabled.all &&<p>The selected resources will be automatically reset:</p>
        }
        {
          longRestDisabled.all &&<p>No resources need to be refreshed right now. But {pcData.baseDetails.name.firstName} can still get a good night's sleep!</p>
        }
        {/* all HP */}
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.refillHP}
            name="refillHP"
            id="refillHP"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                refillHP: !longRestFormData.refillHP
              });                            
              if (!longRestFormData.refillHP) {
                handleChange({target: {name: 'hitPointsCurrent', value: pcData.baseDetails.usableResources.hitPoints.max}}, setFormData);
              } else {
                handleChange({target: {name: 'hitPointsCurrent', value: pcData.baseDetails.usableResources.hitPoints.current}}, setFormData);
              }
            }}
            disabled={longRestDisabled.hitPoints}
          />
          <div className={longRestDisabled.hitPoints ? "no-refresh-msg inline" : "inline"}><label htmlFor="refillHP"><b>Hit Points</b> (full refill){longRestDisabled.hitPoints && noRefreshMessage()}</label></div>
        </div>

        {/* Remove temp hp */}
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.removeTempHP}
            name="removeTempHP"
            id="removeTempHP"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                removeTempHP: !longRestFormData.removeTempHP
              });
              if (!longRestFormData.removeTempHP) {
                handleChange({target: {name: 'hitPointsTemporary', value: 0}}, setFormData);
              } else {
                handleChange({target: {name: 'hitPointsTemporary', value: pcData.baseDetails.usableResources.hitPoints.temporary}}, setFormData);
              }            
            }}
            disabled={longRestDisabled.tempHP}
          />
          <div className={longRestDisabled.tempHP ? "no-refresh-msg inline" : "inline"}><label htmlFor="removeTempHP"><b>Temporary Hit Points</b> (reset to 0){longRestDisabled.tempHP && noRefreshMessage()}</label></div>
        </div>

        {/* all spell slots */}
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.resetSpellSlots}
            name="resetSpellSlots"
            id="resetSpellSlots"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                resetSpellSlots: !longRestFormData.resetSpellSlots
              });
              if (!longRestFormData.resetSpellSlots) {
                spellSlots.map(s => {
                  const key = buildSpellSlotsCurrentKey(s);
                  handleChange({target: {name: key, value: s.data.max}}, setFormData);
                });              
              } else {
                spellSlots.map(s => {
                  const key = buildSpellSlotsCurrentKey(s);
                  handleChange({target: {name: key, value: s.data.current}}, setFormData);
                });
              }            
            }}
            disabled={longRestDisabled.spellSlots}
          />
          <div className={longRestDisabled.spellSlots ? "no-refresh-msg inline" : "inline"}><label htmlFor="resetSpellSlots"><b>Spell slots</b>{longRestDisabled.spellSlots && noRefreshMessage()}</label></div>
        </div>  

        {/* features that refresh on short OR Long rest */}
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.resetLRFeatures}
            name="resetLRFeatures"
            id="resetLRFeatures"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                resetLRFeatures: !longRestFormData.resetLRFeatures
              });
              if (!longRestFormData.resetLRFeatures) {
                limitedUseFeatures.map(f => {
                  const key = buildFeatureCurrentUsesKey(f);
                  handleChange({target: {name: key, value: f.data.maxUses}}, setFormData);
                });
              } else {
                limitedUseFeatures.map(f => {
                  const key = buildFeatureCurrentUsesKey(f);
                  handleChange({target: {name: key, value: f.data.currentUses}}, setFormData);
                });
              }
            }}
            disabled={longRestDisabled.features}
          />
          <div className={longRestDisabled.features ? "no-refresh-msg inline" : "inline"}><label htmlFor="resetLRFeatures"><b>Features</b> that refresh on a short or long rest{longRestDisabled.features && noRefreshMessage()}</label></div>
        </div>

        {/* saving throws */}
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.resetSavingThrows}
            name="resetSavingThrows"
            id="resetSavingThrows"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                resetSavingThrows: !longRestFormData.resetSavingThrows
              });
              if (!longRestFormData.resetSavingThrows) {
                handleChange({target: {name: 'deathSavesSuccesses', value: 3}}, setFormData);
                handleChange({target: {name: 'deathSavesFailures', value: 3}}, setFormData);
              } else {
                handleChange({target: {name: 'deathSavesSuccesses', value: pcData.baseDetails.usableResources.deathSaves.successesRemaining}}, setFormData);
                handleChange({target: {name: 'deathSavesFailures', value: pcData.baseDetails.usableResources.deathSaves.successesRemaining}}, setFormData);
              }            
            }}
            disabled={longRestDisabled.savingThrows}
          />
          <div className={longRestDisabled.savingThrows ? "no-refresh-msg inline" : "inline"}><label htmlFor="resetSavingThrows"><b>Saving Throws</b>{longRestDisabled.savingThrows && noRefreshMessage()}</label></div>
        </div>         

        {/* all Hit Dice */}
        {/* (with extra confirm for regaining all or just half hit dice) */}
        <div className={longRestDisabled.hitDice ? "no-refresh-msg inline" : "inline"}><h6>Hit Dice:{longRestDisabled.hitDice && noRefreshMessage()}</h6></div>
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.regainHalfHitDice}
            name="regainHalfHitDice"
            id="regainHalfHitDice"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                regainHalfHitDice: !longRestFormData.regainHalfHitDice,
                ...(longRestFormData.regainHalfHitDice == false && {regainAllHitDice: false})
              });
              if (!longRestFormData.regainHalfHitDice) {
                const halfHitDice = Math.max(Math.floor(pcData.baseDetails.usableResources.hitDice.max / 2), 1);
                const newHitDiceCount = Math.min(pcData.baseDetails.usableResources.hitDice.max, pcData.baseDetails.usableResources.hitDice.current + halfHitDice);
                handleChange({target: {name: 'hitDiceCurrent', value: newHitDiceCount}}, setFormData);
              } else {
                if (!longRestFormData.regainAllHitDice) {
                  handleChange({target: {name: 'hitDiceCurrent', value: pcData.baseDetails.usableResources.hitDice.current}}, setFormData);                
                }              
              }
            }}
            disabled={longRestDisabled.hitDice}
          />
          <div className={longRestDisabled.hitDice ? "no-refresh-msg inline" : "inline"}><label htmlFor="regainHalfHitDice"><b>Regain half</b> (RAW)</label></div>
        </div>
        <div>
          <input
            type="checkbox"
            checked={longRestFormData.regainAllHitDice}
            name="regainAllHitDice"
            id="regainAllHitDice"
            onChange={() => {
              setLongRestFormData({
                ...longRestFormData,
                regainAllHitDice: !longRestFormData.regainAllHitDice,
                ...(longRestFormData.regainAllHitDice == false && {regainHalfHitDice: false})
              });
              if (!longRestFormData.regainAllHitDice) {                
                handleChange({target: {name: 'hitDiceCurrent', value: pcData.baseDetails.usableResources.hitDice.max}}, setFormData);
              } else {
                if (!longRestFormData.regainHalfHitDice) {
                  handleChange({target: {name: 'hitDiceCurrent', value: pcData.baseDetails.usableResources.hitDice.current}}, setFormData);                
                }
              }
            }}
            disabled={longRestDisabled.hitDice}
          />
          <div className={longRestDisabled.hitDice ? "no-refresh-msg inline" : "inline"}><label htmlFor="regainAllHitDice"><b>Regain all</b></label></div>
        </div>   
      
      </div>
    )
  }
}

export default RestModalBody;