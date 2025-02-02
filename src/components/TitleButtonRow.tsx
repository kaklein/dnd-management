import { ReactNode } from "react";

interface Props {
  text: string;
  formatAsHeader?: boolean;
  buttons?: ReactNode;
  customColor?: "dark-purple";
  centered?: boolean;
}
export function TitleButtonRow ({text, formatAsHeader=true, buttons, centered=false, customColor=undefined}: Props) {
  const titleClass = centered ? "center" : ""
  const titleDisplay = formatAsHeader ? <h3 className={titleClass}>{text}</h3> : <p className={titleClass}>{text}</p>;
  return (
    <div className={`container-fluid title-button-row ${customColor ? "bg-purple" : formatAsHeader ? "title-button-row-bg-dark": ""}`}>
      <div className="row">
        <div className="col-sm">
          {!centered && titleDisplay}
        </div>
        <div className="col-sm">
          {centered && titleDisplay}
        </div>
        <div className="col-sm horiz-btn right-justify">
          {buttons}
        </div>
      </div>
    </div>
  )
}

export default TitleButtonRow;