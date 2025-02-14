import { ReactNode } from "react";

interface Props {
  text: string;
  formatAsHeader?: boolean;
  buttons?: ReactNode;
  customColor?: "dark-purple";
  centered?: boolean;
  matchSectionHeaderFormat?: boolean;
  page?: "details";
}
export function TitleButtonRow ({text, formatAsHeader=true, buttons, centered=false, customColor=undefined, matchSectionHeaderFormat=false, page=undefined}: Props) {
  const titleClass = centered ? "center" : "";
  
  let className = `container-fluid title-button-row`;
  if (customColor == "dark-purple") className = className.concat(" bg-purple");
  if (formatAsHeader) className = className.concat(" title-button-row-bg-dark");
  if (matchSectionHeaderFormat) className = className.concat(" title-button-row-match-section-header")
  
  const titleDisplay = formatAsHeader ? <h3 className={titleClass}>{text}</h3> : <p className={titleClass}>{text}</p>;

  return (
    <div className={className}>
      <div className="row">
        <div className="col">
          {!centered && titleDisplay}
        </div>
        <div className={page == "details" ? "col-auto" : "col"}>
          {centered && titleDisplay}
        </div>
        <div className={page == "details" ? "col-auto horiz-btn right-justify" : "col horiz-btn right-justify"}>
          {buttons}
        </div>
      </div>
    </div>
  )
}

export default TitleButtonRow;