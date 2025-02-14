import { useState } from "react";

interface Props {
  pcName: string;
  handleCancel: () => void;
  handleDelete: () => void;
}

function DeletePC ({pcName, handleCancel, handleDelete}: Props) {
  const [firstYes, setFirstYes] = useState(false);
  
  return (
    <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteModalLabel">Are you sure you want to delete {pcName}?</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setFirstYes(false);
                handleCancel;
              }}
            />
          </div>
          <div className="modal-body">
            <p><b>This will delete all data associated with this character and cannot be undone.</b></p>
            <div className="container-fluid">
              <div className="row">
                <div className="col no-padding">
                  <button type="button" className="btn btn-danger no-side-margin full-width" disabled={firstYes} onClick={() => {setFirstYes(true)}}>
                    Yes, that's why I clicked "delete".
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col no-padding">
                  <button 
                    type="button"
                    className="btn btn-secondary no-side-margin full-width"
                    disabled={firstYes}
                    onClick={() => {
                      setFirstYes(false);
                      handleCancel;
                    }} 
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {
            firstYes &&
            <div className="modal-footer">
              <p><b>Are you <i>really</i> sure? There's no going back after this. {pcName} will be GONE!</b></p>
              <div className="container-fluid">
                <div className="row">
                  <div className="col no-padding">
                    <button
                      type="button"
                      className="btn btn-danger no-side-margin full-width"
                      onClick={handleDelete}
                      data-bs-dismiss="modal"
                    >
                      Yes. DELETE {pcName.toUpperCase()}!
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col no-padding">
                    <button
                      type="button"
                      className="btn btn-secondary no-side-margin full-width"
                      onClick={() => { 
                        setFirstYes(false);
                        handleCancel; 
                      }}
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default DeletePC;