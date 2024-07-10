import Card from "@components/cards/Card";
import { formatDataAsTable } from "@components/utils";
import CardSetHorizontal from "./CardSetHorizontal";

interface Props {
    abilityName: string;
    score: number;
    modifier: number;
    data: object;
}

function AbilityCard({ abilityName, score, modifier, data }: Props) {
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
                            {formatDataAsTable(data, true, true)} 
                        </div>
                    </>
                </CardSetHorizontal>
            </Card>
        </div>
    )
}

export default AbilityCard;
