interface Props {
  pageName: string;
  showLogo?: boolean;
}

function PageHeaderBar ({pageName, showLogo=false}: Props) {
  return (
    <>
    {
      showLogo &&
      <div className="welcome">
        <img src="/images/logo-1.png" width="250px"/>
      </div>
    }
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
    </>
  )
}

export default PageHeaderBar;