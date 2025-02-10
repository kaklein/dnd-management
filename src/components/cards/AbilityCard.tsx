import Card from "@components/cards/Card";
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

const buildRowClassName = (formData: any, skill: {displayName: string, formFieldName: string, proficient: boolean}, currentIndex: number, totalSkills: number) => {
    let className = formData[skill.formFieldName] === "true" ? 'table-highlighted' : 'table';
    if (currentIndex == 0) className == className.concat(" round-top-corners");
    if (currentIndex == totalSkills - 1) className == className.concat(" round-bottom-corners");
    return className;
}

const buildRowCheckboxClassName = (currentIndex: number, totalSkills: number) => {
    let className = currentIndex == 0 ? "row-checkbox round-top-left" : "row-checkbox";
    if (currentIndex == totalSkills - 1) className = className.concat(" round-bottom-left");
    return className;
}

const buildRowEndClassName = (currentIndex: number, totalSkills: number) => {
    let className = currentIndex == 0 ? "round-top-right" : "";
    if (currentIndex == totalSkills - 1) className = className.concat(" round-bottom-right");
    return className;
}

function AbilityCard({ abilityName, proficiencyBonus, skills, editable, handleChange, setFormData, formData }: Props) {
    const modifier = getModifier(formData[`${abilityName.toLowerCase()}Score`]);
    return (
        <div className="ability-card">
            <Card customClass="ability-card-card">
                <h1 className="ability-card-header">{abilityName}</h1>
                <div className="container-fluid ability-scores-container">
                    <div className="row">
                        <div className="col-auto">
                            <div className="ability-scores">
                                <label className="inline" htmlFor={`${abilityName.toLowerCase()}Score`}/>
                                <h4 className="ability-score-base-score">
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
                                <p className={`ability-card-sub-header ${editable && "ability-card-grayed-out-text"}`}>MOD:</p>
                                <h3 className={`${editable ? "ability-card-grayed-out-text" : ""}`}>{modifier > 0 && '+'}{modifier}</h3>
                            </div>
                        </div>
                        <div className="col small-padding">
                            <div className="ability-proficiencies">
                            <table className="table">
                                <tbody className="full-width">
                                    {
                                        skills.map((skill, i) => (
                                            <tr className={
                                                buildRowClassName(formData, skill, i, skills.length)
                                                } key={i}>
                                                <td className={
                                                    buildRowCheckboxClassName(i, skills.length)                                                    
                                                }>
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
                                                        className={`ability-card-checkbox-editable-${editable} ${!editable && formData[skill.formFieldName] === "false" ? "ability-card-checkbox-unchecked" : ""}`}
                                                    />
                                                </td>
                                                <td className={skill.displayName == 'Saving Throws' ? "italic" : "bold"}>{ skill.displayName.toUpperCase() + ':' }</td>
                                                <td className={buildRowEndClassName(i, skills.length)}><b>{ getSkillModifier(formData[skill.formFieldName] === "true" ? true : false, modifier, proficiencyBonus) }</b></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>                
            </Card>
        </div>
    )
}

export default AbilityCard;
