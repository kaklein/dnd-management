import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

function Card ({children}: Props) {
    return (
        <div className="card" style={{width: "90%"}}>
            {children}
        </div>
    )
}



export default Card;
