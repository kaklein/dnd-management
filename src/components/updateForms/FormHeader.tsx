interface Props {
  formTitle: string;
  onClick: () => void;
  showForm: boolean;
}

function FormHeader ({formTitle, onClick, showForm}: Props) {
  return (
    <div className="update-form-header container-fluid">
      <div className="row">
        <div className="col-8 update-form-header-title">
          {formTitle}
        </div>
        <div className="col-4">
          <button
            className="btn btn-info expand-collapse-btn"
            type="button"
            onClick={onClick}
          >
            {showForm ? '-' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormHeader;