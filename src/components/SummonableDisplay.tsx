import { Summonable } from "@models/playerCharacter/Summonable";
import Card from "./cards/Card";
import TitleButtonRow from "./TitleButtonRow";
import EditItemButton from "./EditItemButton";
import DeleteItemButton from "./DeleteItemButton";
import { capitalize } from "./utils";
import { getModifierFormatted } from "@services/firestore/utils";

interface Props {
    summonables?: Summonable[];
    setEditModalFormData: (data: any) => void;
    emptyEditModalData: any;
    setShowConfirmDelete: (data: any) => void;
    emptyShowConfirmDeleteData: any;
    setInitialEditorContent: (content: any) => void;
}

function SummonableDisplay ({ summonables, setEditModalFormData, emptyEditModalData, setShowConfirmDelete, emptyShowConfirmDeleteData, setInitialEditorContent }: Props) {
    if (!summonables || summonables?.length < 1) return undefined;

    return (
        summonables?.sort((a,b) => {
            const aComparable = a.data.name ?? a.data.type;
            const bComparable = b.data.name ?? b.data.type;
            if (aComparable < bComparable) return -1;
            return 1;
        }).map(s => (
            <Card key={s.id}>
                <a id={s.id}></a>
                <TitleButtonRow
                    text={s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type}
                    page="details"
                    buttons={
                        <>                                        
                        <EditItemButton
                            handleEdit={() => {
                                setEditModalFormData({
                                    ...emptyEditModalData,
                                    formType: 'summonable',
                                    displayName: s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type,
                                    summonableId: s.id,
                                    type: s.data.type,
                                    name: s.data.name ?? '',
                                    description: s.data.description,
                                    sourceType: s.data.source.type,
                                    sourceName: s.data.source.name,
                                    hitPointMaximum: String(s.data.hitPoints.max),
                                    hitPointsCurrent: String(s.data.hitPoints.current),
                                    armorClass: String(s.data.armorClass),
                                    summoned: s.data.summoned ? "true" : "false",
                                    attacks: s.data.attacks ?? [],
                                    useAbilityScores: s.data.abilityScores && s.data.abilityScores.strength >= 0 ? 'true' : 'false',
                                    strengthScore: s.data.abilityScores?.strength ?? '',
                                    dexterityScore: s.data.abilityScores?.dexterity ?? '',
                                    constitutionScore: s.data.abilityScores?.constitution ?? '',
                                    intelligenceScore: s.data.abilityScores?.intelligence ?? '',
                                    wisdomScore: s.data.abilityScores?.wisdom ?? '',
                                    charismaScore: s.data.abilityScores?.charisma ?? '',
                                    proficiencyBonus: s.data.abilityScores?.proficiencyBonus ?? ''
                                });
                                setInitialEditorContent(s.data.description);
                            }}
                        />
                        <DeleteItemButton
                            handleDelete={() => setShowConfirmDelete({
                                show: true,
                                data: {
                                    ...emptyShowConfirmDeleteData,
                                    summonableId: s.id,
                                    displayName: s.data.name ? `${s.data.name} (${s.data.type})` : s.data.type
                                }
                            })}
                        />
                        </>
                    }
                />
                <div className="content">
                    <h5 className="left-justify section-header gray-bg">Description</h5>
                    <div className="long-text-display left-justify" dangerouslySetInnerHTML={{__html: s.data.description}}/>
                    
                    <h5 className="left-justify section-header gray-bg">Stats</h5>
                    <p><b>Source: </b>{s.data.source.name} ({capitalize(s.data.source.type)})</p>
                    <p><b>Max HP: </b>{s.data.hitPoints.max}</p>
                    <p><b>Armor Class: </b>{s.data.armorClass}</p>
                    {
                        (Number(s.data.abilityScores?.proficiencyBonus) > 0) &&
                        <p><b>Proficiency Bonus: </b>+{s.data.abilityScores?.proficiencyBonus}</p>
                    }
                    {
                        (s.data.abilityScores && s.data.abilityScores.strength >= 0) &&
                        <div className="mini-stat-block center">
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>STR</b></div>
                            <p>{s.data.abilityScores.strength} ({getModifierFormatted(s.data.abilityScores.strength)})</p>
                        </div>
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>DEX</b></div>
                            <p>{s.data.abilityScores.dexterity} ({getModifierFormatted(s.data.abilityScores.dexterity)})</p>
                        </div>
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>CON</b></div>
                            <p>{s.data.abilityScores.constitution} ({getModifierFormatted(s.data.abilityScores.constitution)})</p>
                        </div>
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>INT</b></div>
                            <p>{s.data.abilityScores.intelligence} ({getModifierFormatted(s.data.abilityScores.intelligence)})</p>
                        </div>
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>WIS</b></div>
                            <p>{s.data.abilityScores.wisdom} ({getModifierFormatted(s.data.abilityScores.wisdom)})</p>
                        </div>
                        <div className="stat-block-item">
                            <div className="stat-block-item-title"><b>CHA</b></div>
                            <p>{s.data.abilityScores.charisma} ({getModifierFormatted(s.data.abilityScores.charisma)})</p>
                        </div>
                        </div>
                    }
                    {
                        (s.data.attacks && s.data.attacks.length > 0) &&
                        <>
                        <h5 className="left-justify section-header gray-bg">Attacks & Actions</h5>
                        <div className="long-text-display">
                            {
                                s.data.attacks.sort((a, b) => {
                                    if (a.name < b.name) return -1;
                                    return 1
                                }).map(a => (
                                    <div key={a.id} className="display-item-row">
                                        <p><b>{a.name.toUpperCase()}</b></p>
                                        <div dangerouslySetInnerHTML={{ __html: a.description}}/>
                                    </div>
                                ))
                            }
                        </div>
                        </>
                    }                                    
                </div>                            
            </Card>
        ))   
    )
}

export default SummonableDisplay;