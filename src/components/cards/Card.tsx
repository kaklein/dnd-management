import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function Card ({children}: Props) {
    return (
        <div className="card" style={{width: "100%"}}>
            {children}
        </div>
    )
}

export default Card;
