import { RestType } from "@models/enum/RestType";

interface Props {
    refreshRestType: RestType
}

function Refresh({refreshRestType}: Props) {
    const imageFileName = refreshRestType === RestType.SHORT ? 'short-rest.png' : 'long-rest.png';

    return (
        <div>
            <p>Refresh</p>
            <figure>
                <img className="icon" src={`@images/icons/${imageFileName}`} alt={`${refreshRestType} rest icon`}/>
                <figcaption>{refreshRestType.toLowerCase()} rest</figcaption>
            </figure>
        </div>
    )
}

export default Refresh;
