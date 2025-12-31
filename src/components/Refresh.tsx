import { RestType } from "@models/enum/RestType";
import { capitalize } from "./utils";
import Popover from "./modals/Popover";

interface Props {
    refreshRestType: RestType;
    disabled?: boolean;
}

function Refresh({ refreshRestType, disabled=false }: Props) {
    const imageFileName = refreshRestType === RestType.SHORT ? 'short-rest.png' : 'long-rest.png';
    const className = disabled ? "refresh-icon refresh-icon-disabled" : "refresh-icon";
    return (
        <Popover
            popoverBody={<p>Refreshes after <b>{capitalize(refreshRestType)} Rest</b></p>}
        >
            <img className={className} src={`/images/icons/${imageFileName}`} alt={`${refreshRestType} rest refresh icon`}/>
        </Popover>
    )
}

export default Refresh;
