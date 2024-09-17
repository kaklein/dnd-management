interface Props {
  editable: boolean;
  handleDelete: () => void;
  customDeleteText?: string;
}

function DeleteItemButton ({editable, handleDelete, customDeleteText}: Props) {
  if (!editable) return undefined;

  return (
    <button
      type="button"
      className="btn btn-danger float-right"
      data-bs-toggle="modal"
      data-bs-target="#deleteModal"
      onClick={handleDelete}
    >
      {customDeleteText ?? 'Delete'}
    </button>
  )
}

export default DeleteItemButton;