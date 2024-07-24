import Button, { ButtonType } from "@components/Button";
import { Modal, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';


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
    <Modal
      // backdrop="static"
      show={show}
      onHide={() => setShow({show: false, data: clearedData})}
    >
      <ModalDialog>
        <ModalHeader closeButton>
          <ModalTitle>Delete {itemName}?</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={handleCancel}/>
          <Button text="Delete" buttonType={ButtonType.DANGER} onClick={handleDelete}/>
        </ModalFooter>
      </ModalDialog>
    </Modal>
  )
}

export default ConfirmDelete;