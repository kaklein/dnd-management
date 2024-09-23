interface Props {
  formTitle: string;
  onClick: () => void;
  showForm: boolean;
  anchorTag?: string;
}

function FormHeader ({formTitle, onClick, showForm, anchorTag=undefined}: Props) {
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
                className="btn btn-info expand-collapse-btn"
                type="button"
                onClick={onClick}
              >
                {showForm ? '-' : '+'}
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