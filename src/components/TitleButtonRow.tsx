import { ReactNode } from "react";

interface Props {
  text: string;
  formatAsHeader?: boolean;
  buttons?: ReactNode;
  customColor?: "dark-purple";
}
export function TitleButtonRow ({text, formatAsHeader=true, buttons, customColor=undefined}: Props) {
  return (
    <div className={`container-fluid title-button-row ${customColor ? "bg-purple" : formatAsHeader ? "title-button-row-bg-dark": ""}`}>
      <div className="row">
        <div className="col-7">
          {
            formatAsHeader &&
            <h3>{text}</h3>
          }
          {
            !formatAsHeader &&
            <p>{text}</p>
          }
        </div>
        <div className="col-5 horiz-btn">
          {buttons}
        </div>
      </div>
    </div>
  )
}

export default TitleButtonRow;