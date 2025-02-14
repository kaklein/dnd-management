interface Props {
  editable?: boolean;
  handleEdit: () => void;
  customClass?: string;
  iconAndText?: boolean;
}

function EditItemButton ({editable=true, handleEdit, customClass=undefined, iconAndText=false}: Props) {
  if (!editable) return undefined;

  return (
    <button
      type="button"
      className={`btn btn-secondary float-right ${customClass}`}
      data-bs-toggle="modal"
      data-bs-target="#editModal"
      onClick={handleEdit}
    >
      <span className="inline-block flip-horizontal">&#x270E;</span>
      {
        iconAndText && " Edit Details"
      }
    </button>
  )
}

export default EditItemButton;