interface Props {
  editable: boolean;
  handleEdit: () => void;
}

function EditItemButton ({editable, handleEdit}: Props) {
  if (!editable) return undefined;

  return (
    <button
      type="button"
      className="btn btn-secondary float-right"
      data-bs-toggle="modal"
      data-bs-target="#editModal"
      onClick={handleEdit}
    >
      Edit
    </button>
  )
}

export default EditItemButton;