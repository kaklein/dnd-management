import Button, { ButtonType } from "@components/Button";
import { Modal, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';


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
      backdrop="static"
      show={show}
      onShow={() => {console.log('opened modal')}}
      onHide={() => setShow({show: false, data: clearedData})}
    >
      <ModalHeader>
        <ModalTitle>Delete {itemName}?</ModalTitle>
      </ModalHeader>
      <ModalFooter>
        <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={handleCancel}/>
        <Button text="Delete" buttonType={ButtonType.DANGER} onClick={handleDelete}/>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDelete;