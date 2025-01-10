import { buildSpellSlotsCurrentKey, canCastSpell, capitalize } from "@components/utils";
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
                    (slot.data.level !== SpellLevel.CANTRIP && slot.data.level >= spell.level)
                ).map(s => (
                    <div key={s.id}>
                        <input
                            className="inline"
                            type="checkbox"
                            checked={spellSlotLevel.selected == s.data.level}
                            onChange={() => {
                                const newCurrent = s.data.current - 1;
                                setSpellSlotFormData({
                                    [buildSpellSlotsCurrentKey(s)]: newCurrent
                                });
                                spellSlotLevel.setSelected(s.data.level);
                            }}
                        />
                        {s.data.level} - {s.data.current} / {s.data.max} slots remaining
                    </div>
                ))
            }
        </div> :
        undefined
    
    return (
        <GenericModal
            modalName="spellUse"
            title={`Cast ${spell.name}`}
            onClose={() => {
                setSpellSlotFormData({});
            }}
            modalBody={modalBody}
            modalFooter={
                <div>
                    <button
                        type="submit"
                        className="btn-btn-success"
                        data-bs-dismiss="modal"
                        disabled={!canCastSpell(spell, spellSlots)}                        
                        onClick={(event) => {
                            handleSubmit(event, spellSlotFormData);
                        }}
                    >
                        Cast {capitalize(spell.name)} as {spellSlotLevel.selected}
                    </button>
                </div>
            }
        />
    )
}

export default SpellUseModal;