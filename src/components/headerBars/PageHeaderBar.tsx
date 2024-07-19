interface Props {
  pageName: string;
}

function PageHeaderBar ({pageName}: Props) {
  return (
    <div className="container-fluid page-header-bar">
      <div className="row">
        <div className="col-sm page-header-pc-name">
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