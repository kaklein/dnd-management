import Button, { ButtonType } from "@components/Button";
import Modal from 'react-bootstrap';

interface Props {
  show: boolean;
  itemName: string;
  handleCancel: () => void;
  handleDelete: () => void;
  setShow: (input: {show: boolean, data: any}) => void;
  clearedData: any
}

function ConfirmDelete ({show, itemName, handleCancel, handleDelete, setShow, clearedData}: Props) {
  return (
    <Modal.Modal
      backdrop="static"
      show={show}
      onHide={() => setShow({show: false, data: clearedData})}
    >
      <Modal.ModalDialog>
        <Modal.ModalHeader closeButton>
          <Modal.ModalTitle>Delete {itemName}?</Modal.ModalTitle>
        </Modal.ModalHeader>
        <Modal.ModalFooter>
          <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={handleCancel}/>
          <Button text="Delete" buttonType={ButtonType.DANGER} onClick={handleDelete}/>
        </Modal.ModalFooter>
      </Modal.ModalDialog>
    </Modal.Modal>
  )
}

export default ConfirmDelete;