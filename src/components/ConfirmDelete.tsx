import Button, { ButtonType } from "@components/Button";
import { useState } from "react";
import { Modal, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';


interface Props {
  defaultShow: boolean;
  itemName: string;
  handleCancel: () => void;
  handleDelete: () => void;
}

function ConfirmDelete ({defaultShow, itemName, handleCancel, handleDelete}: Props) {
  const [show, setShow] = useState(defaultShow);
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static" // todo
      keyboard={false} // todo
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