import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    customClass?: string;
}

function Card ({children, customClass=undefined}: Props) {
    const className = customClass ? `card ${customClass}` : 'card';
    return (
        <div className={className} style={{width: "100%"}}>
            {children}
        </div>
    )
}

export default Card;
