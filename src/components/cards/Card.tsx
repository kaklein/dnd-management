import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    id?: string;
    customClass?: string;
}

function Card ({children, id=undefined, customClass=undefined}: Props) {
    const className = customClass ? `card ${customClass}` : 'card';
    return (
        <div className={className} id={id} style={{width: "100%"}}>
            {children}
        </div>
    )
}

export default Card;
