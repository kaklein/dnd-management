import { RestType } from "@models/enum/RestType";
import { capitalize } from "./utils";

interface Props {
    refreshRestType: RestType
}

function Refresh({refreshRestType}: Props) {
    const imageFileName = refreshRestType === RestType.SHORT ? 'short-rest.png' : 'long-rest.png';

    return (
        <div className="container-fluid refresh d-flex justify-content-center">
            <div className="row refresh-row">
                <div className="col-4 refresh-col">
                    <img className="refresh-icon" src={`/images/icons/${imageFileName}`} alt={`${refreshRestType} rest icon`}/>
                </div>
                <div className="col-8 refresh-col">
                    <div className="short-div"><i>Refresh:</i></div>
                    <div className="short-div"><i>{capitalize(refreshRestType)} Rest</i></div>
                </div>
            </div>
        </div>
    )
}

export default Refresh;
