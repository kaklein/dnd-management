import { RestType } from "@models/enum/RestType";
import { capitalize } from "./utils";
import Popover from "./modals/Popover";

interface Props {
    refreshRestType: RestType
}

function Refresh({refreshRestType}: Props) {
    const imageFileName = refreshRestType === RestType.SHORT ? 'short-rest.png' : 'long-rest.png';

    return (
        <Popover
            popoverBody={<p>Refreshes after <b>{capitalize(refreshRestType)} Rest</b></p>}
        >
            <img className="refresh-icon" src={`/images/icons/${imageFileName}`} alt={`${refreshRestType} rest refresh icon`}/>
        </Popover>
    )
}

export default Refresh;
