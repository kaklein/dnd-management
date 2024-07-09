import Card from "@components/cards/Card";
import { formatDataAsTable } from "@components/utils";

interface Props {
    abilityName: string;
    score: number;
    modifier: number;
    data: object;
}

function AbilityCard({ abilityName, score, modifier, data }: Props) {
    return (
        <Card>
            <h1>{abilityName}</h1>
            <Card>
                <>
                    <h4>Score:</h4>
                    <h4>{score}</h4>
                    <hr/>
                    <h4>Modifier:</h4>
                    <h1>{modifier > 0 && '+'}{modifier}</h1>
                </>
            </Card>
            {formatDataAsTable(data, true, true)}
        </Card>
    )
}

export default AbilityCard;
