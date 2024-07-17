import Card from "@components/cards/Card";
import CardSetHorizontal from "./CardSetHorizontal";

interface Props {
    abilityName: string;
    score: number;
    modifier: number;
    skills: {
        name: string,
        proficient: boolean;
    }[];
    proficiencyBonus: number;
}

const getSkillModifier = (proficient: boolean, modifier: number, proficiencyBonus: number) => {
    const skillModifier = proficient ? modifier + proficiencyBonus : modifier;
    return skillModifier > 0 ? `+${String(skillModifier)}` : String(skillModifier);
};

function AbilityCard({ abilityName, score, modifier, proficiencyBonus, skills }: Props) {
    return (
        <div className="ability-card">
            <Card>
                <h1 className="ability-card-header">{abilityName}</h1>

                <CardSetHorizontal>
                    <>
                        <div className="ability-scores">
                            <h4 className="ability-card-sub-header">Score:</h4>
                            <h4>{score}</h4>
                            <hr/>
                            <h4 className="ability-card-sub-header">Modifier:</h4>
                            <h1>{modifier > 0 && '+'}{modifier}</h1>
                        </div>
                        <div className="ability-proficiencies">
                        <table className="table">
                            <tbody>
                                {
                                    skills.map((skill, i) => (
                                        <tr className={skill.proficient ? 'table-success' : 'table'} key={i}>
                                            <td><input type="checkbox" checked={skill.proficient} disabled/></td>
                                            <td>{ skill.name.toUpperCase() + ':' }</td>
                                            <td>{ getSkillModifier(skill.proficient, modifier, proficiencyBonus) }</td>
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
