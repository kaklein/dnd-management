interface Props {
  formTitle: string;
  onClick: () => void;
  showForm: boolean;
  anchorTag?: string;
  expandType?: "expand" | "add"
}

function FormHeader ({formTitle, onClick, showForm, anchorTag=undefined, expandType="expand"}: Props) {
  const buttonType = (expandType === "add" && showForm) ? "danger" : 
    (expandType == "add" && !showForm) ? "success btn-custom-green" :
    "info";
  const expandSymbol = expandType === "add" ? <span className="symbol">+</span> : <span className="down-arrow">v</span>;
  const collapseSymbol = expandType === "add" ? "Cancel" : <span className="up-arrow">^</span>;
  
  return (
    <div className="update-form-header container-fluid">
      <div className="row">
        <div className="col-8 update-form-header-title" id={anchorTag}>
          {formTitle}
        </div>
        <div className="col-4">
          {anchorTag && 
            <a href={'#' + anchorTag}>
              <button
                className={`btn btn-${buttonType} expand-collapse-btn`}
                type="button"
                onClick={onClick}
              >
                {
                  showForm ? collapseSymbol : expandSymbol
                }
              </button>
            </a>
          }
          
          {!anchorTag &&
            <button
              className="btn btn-info expand-collapse-btn"
              type="button"
              onClick={onClick}
            >
              {showForm ? '-' : '+'}
            </button>
          }
          
        </div>
      </div>
    </div>
  )
}

export default FormHeader;