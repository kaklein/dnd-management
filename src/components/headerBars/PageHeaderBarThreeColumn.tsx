import { ReactNode } from "react";

interface Props {
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  pageName?: string;
}

function PageHeaderBarThreeColumn ({contentLeft=undefined, contentRight=undefined, pageName=undefined}: Props) {
  return (
    <div className="container-fluid page-header-bar">
      <div className="row">
        <div className="col-sm page-header-pc-name">
          {contentLeft}
        </div>
        <div className="col-sm-auto page-header-page-name">
          {pageName}
        </div>
        <div className="col-sm">
          {contentRight}
        </div>
      </div>
    </div>
  )
}

export default PageHeaderBarThreeColumn;