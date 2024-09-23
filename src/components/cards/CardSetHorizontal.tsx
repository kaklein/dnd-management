import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    customClass?: string;
}

function CardSetHorizontal({children, customClass=undefined}: Props) {
    return (
        <div className={`card-group card-set-horizontal ${customClass}`}>
            {children}
        </div>
    )
}

export default CardSetHorizontal;
