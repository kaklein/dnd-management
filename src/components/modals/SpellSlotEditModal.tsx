import GenericModal from "./GenericModal";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { buildSpellSlotsCurrentKey } from "@components/utils";
import { useState } from "react";

interface Props {
    spellSlot: SpellSlot;
    spellSlotFormData: any;
    setSpellSlotFormData: (update: any) => void;
    handleSubmit: (event: any, updates: any) => void;
}

function SpellSlotEditModal ({ spellSlot, spellSlotFormData, setSpellSlotFormData, handleSubmit }: Props) {
    const [slotCount, setSlotCount] = useState("");
    
    return (
        <GenericModal
          modalName="spellSlotEdit"
          title={`Edit ${spellSlot?.data?.level} Spell Slots`}
          onClose={() => {
            setSlotCount("");
          }}
          modalBody={
            <div>
                <p className="center gold-modal-text">Current: {spellSlot.data.current} / {spellSlot.data.max}</p>
                <p className="center gold-modal-text">Set available slots:</p>
                <input
                    type="number"
                    min="0"
                    name="newSpellSlotCount"
                    id="newSpellSlotCount"
                    autoFocus
                    required
                    max={spellSlot.data.max}
                    value={slotCount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSlotCount(event.target.value);
                        setSpellSlotFormData({
                            [buildSpellSlotsCurrentKey(spellSlot)]: Number(event.target.value)
                        });
                    }}
                    className="large-number-input"
                />
            </div>
          }
          modalFooter={
            <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={(event) => {
                    handleSubmit(event, spellSlotFormData);
                    setSlotCount("");
                }}
                disabled={
                    !slotCount ||
                    Number(slotCount) < 0 ||
                    Number(slotCount) > spellSlot.data.max ||
                    Number(slotCount) == spellSlot.data.current ||
                    isNaN(Number(slotCount))
                }
            >
                Save
            </button>
          }          
        />
    )
}

export default SpellSlotEditModal;