interface Props {
  editable: boolean;
  handleDelete: () => void;
}

function DeleteItemButton ({editable, handleDelete}: Props) {
  if (!editable) return undefined;

  return (
    <button
      type="button"
      className="btn btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#deleteModal"
      onClick={handleDelete}
    >
      Delete
    </button>
  )
}

export default DeleteItemButton;