import { buildSpellSlotsCurrentKey, canCastSpell } from "@components/utils";
import GenericModal from "./GenericModal";
import { SpellSlot } from "@models/playerCharacter/usableResources/SpellSlot";
import { Spell, SpellLevel } from "@models/playerCharacter/Spell";

interface Props {
    spell: Spell;
    spellSlots: SpellSlot[];
    spellSlotLevel: {
        selected: SpellLevel;
        setSelected: (level: SpellLevel) => void;
    }
    spellSlotFormData: any;
    setSpellSlotFormData: (update: any) => void;
    handleSubmit: (event: any, updates: any) => void;
}

function SpellUseModal ({spell, spellSlots, spellSlotLevel, spellSlotFormData, setSpellSlotFormData, handleSubmit}: Props) {    
    const modalBody = spell.level !== SpellLevel.CANTRIP ?
        <div>
            {
                spellSlots.filter(slot => 
                    (slot.data.level !== SpellLevel.CANTRIP && slot.data.level >= spell.level && slot.data.max > 0)
                ).map(s => (
                    <div key={s.id} className={`${s.data.current < 1 ? "disabled-check-input" : ""}`}>
                        <input
                            className="inline"
                            type="checkbox"
                            checked={spellSlotLevel.selected == s.data.level}
                            disabled={s.data.current < 1}
                            onChange={() => {
                                const newCurrent = s.data.current - 1;
                                setSpellSlotFormData({
                                    [buildSpellSlotsCurrentKey(s)]: newCurrent
                                });
                                spellSlotLevel.setSelected(s.data.level);
                            }}
                        />
                        <b> {s.data.level}</b><span> ({s.data.current} / {s.data.max} slots available)</span>
                    </div>
                ))
            }
        </div> :
        undefined
    
    return (
        <GenericModal
            modalName="spellUse"
            title={`Cast ${spell.name} - ${spell.level} Spell`}
            onClose={() => {
                setSpellSlotFormData({});
            }}
            modalBody={modalBody}
            modalFooter={
                <button
                    type="submit"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    disabled={!canCastSpell(spell, spellSlots, spellSlotLevel.selected)}                        
                    onClick={(event) => {
                        handleSubmit(event, spellSlotFormData);
                    }}
                >
                    {spell.level === spellSlotLevel.selected ? "Cast" : "Upcast"} as {spellSlotLevel.selected}
                </button>
            }
        />
    )
}

export default SpellUseModal;