import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

function CardSetHorizontal({children}: Props) {
    return (
        <div className="d-flex flex-row">
            {children}
        </div>
    )
}

export default CardSetHorizontal;
