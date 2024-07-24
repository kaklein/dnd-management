interface Props {
  itemName: string;
  handleCancel: () => void;
  handleDelete: () => void;
}

function ConfirmDelete ({itemName, handleCancel, handleDelete}: Props) {
  return (
    <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteModalLabel">Delete {itemName}?</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCancel} data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDelete;