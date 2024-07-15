import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function CardSetHorizontal({children}: Props) {
    return (
        <div className="card-group card-set-horizontal">
            {children}
        </div>
    )
}

export default CardSetHorizontal;
