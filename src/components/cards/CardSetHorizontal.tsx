import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function CardSetHorizontal({children}: Props) {
    return (
        <div className="d-flex flex-row card-set-horizontal">
            {children}
        </div>
    )
}

export default CardSetHorizontal;
