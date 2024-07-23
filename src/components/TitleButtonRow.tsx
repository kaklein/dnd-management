import { ReactNode } from "react";

interface Props {
  text: string;
  formatAsHeader?: boolean;
  button?: ReactNode;
}
export function TitleButtonRow ({text, formatAsHeader=true, button}: Props) {
  return (
    <div className={`container-fluid title-button-row ${formatAsHeader ? "title-button-row-bg-dark": ""}`}>
      <div className="row">
        <div className="col-9">
          {
            formatAsHeader &&
            <h3>{text}</h3>
          }
          {
            !formatAsHeader &&
            <p>{text}</p>
          }
        </div>
        <div className="col-3">
          {button}
        </div>
      </div>
    </div>
  )
}

export default TitleButtonRow;