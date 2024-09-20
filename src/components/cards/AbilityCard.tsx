import Card from "@components/cards/Card";
import CardSetHorizontal from "./CardSetHorizontal";
import { getModifier } from "@services/firestore/utils";

interface Props {
    abilityName: string;
    score: number;
    skills: {
        displayName: string;
        formFieldName: string;
        proficient: boolean;
    }[];
    proficiencyBonus: number;
    editable: boolean;
    handleChange: (event: any, setFunction: (prevFormData: any) => void) => void;
    setFormData: (data: any) => void;
    formData: any;
}

const getSkillModifier = (proficient: boolean, modifier: number, proficiencyBonus: number) => {
    const skillModifier = proficient ? modifier + proficiencyBonus : modifier;
    return skillModifier > 0 ? `+${String(skillModifier)}` : String(skillModifier);
};

function AbilityCard({ abilityName, proficiencyBonus, skills, editable, handleChange, setFormData, formData }: Props) {
    const modifier = getModifier(formData[`${abilityName.toLowerCase()}Score`]);
    return (
        <div className="ability-card">
            <Card>
                <h1 className="ability-card-header">{abilityName}</h1>

                <CardSetHorizontal>
                    <>
                        <div className="ability-scores">
                            <label htmlFor={`${abilityName.toLowerCase()}Score`}><h4 className="ability-card-sub-header">Score:</h4></label>
                            <h4>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                id={`${abilityName.toLowerCase()}Score`}
                                name={`${abilityName.toLowerCase()}Score`}
                                value={formData[`${abilityName.toLowerCase()}Score`]}
                                disabled={!editable}
                                className={`ability-score-editable-${editable}`}
                                onChange={(event) => handleChange(event, setFormData)}
                            />
                            </h4>
                            <hr/>
                            <h4 className="ability-card-sub-header">Modifier:</h4>
                            <h1>{modifier > 0 && '+'}{modifier}</h1>
                        </div>
                        <div className="ability-proficiencies">
                        <table className="table">
                            <tbody>
                                {
                                    skills.map((skill, i) => (
                                        <tr className={formData[skill.formFieldName] === "true" ? 'table-success' : 'table'} key={i}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    id={skill.formFieldName} 
                                                    name={skill.formFieldName} 
                                                    checked={formData[skill.formFieldName] === "true"}
                                                    disabled={!editable}
                                                    onChange={(event) => {
                                                        event.target.value = event.target.checked ? "true" : "false";
                                                        handleChange(event, setFormData);
                                                    }}
                                                />
                                            </td>
                                            <td>{ skill.displayName.toUpperCase() + ':' }</td>
                                            <td><b>{ getSkillModifier(formData[skill.formFieldName] === "true" ? true : false, modifier, proficiencyBonus) }</b></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        </div>
                    </>
                </CardSetHorizontal>
            </Card>
        </div>
    )
}

export default AbilityCard;
