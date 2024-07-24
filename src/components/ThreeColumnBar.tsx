import { ReactNode } from "react";

interface Props {
  contentLeft?: ReactNode;
  contentMiddle?: ReactNode;
  contentRight?: ReactNode;
}

function ThreeColumnBar ({contentLeft=undefined, contentMiddle=undefined, contentRight=undefined}: Props) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
          {contentLeft}
        </div>
        <div className="col-sm">
          {contentMiddle}
        </div>
        <div className="col-auto">
          {contentRight}
        </div>
      </div>
    </div>
  )
}

export default ThreeColumnBar;