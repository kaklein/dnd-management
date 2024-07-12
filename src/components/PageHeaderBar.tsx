interface Props {
  pageName: string;
  pcName?: string;
}

function PageHeaderBar ({pageName, pcName}: Props) {
  return (
    <div className="container-fluid page-header-bar">
      <div className="row">
        <div className="col-sm page-header-pc-name">
          {pcName && pcName}
        </div>
        <div className="col-sm-auto page-header-page-name">
          {pageName}
        </div>
        <div className="col-sm">
        </div>
      </div>
    </div>
  )
}

export default PageHeaderBar;