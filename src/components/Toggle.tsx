import {removeWhiteSpaceAndConvertToLowerCase} from "./utils";

interface Props {
    label: string;
    count: number;
    defaultPosition?: string;
}

function Toggle({ label, count, defaultPosition="unchecked" }: Props) {
    const checked = defaultPosition === "checked";
    const formattedLabel = removeWhiteSpaceAndConvertToLowerCase(label);

    return (
        <div className="d-flex flex-row form-check toggle">
            <p className="toggle-label">{label}</p>
            <div>
            {
                [...Array(count)].map((x, i) =>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id={`${formattedLabel}-checkbox-${i}`} value={`${formattedLabel}-option-${i}`} defaultChecked={checked}/>
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Toggle;
