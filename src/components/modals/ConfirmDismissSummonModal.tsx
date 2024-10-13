import { Summonable } from "@models/playerCharacter/Summonable";

interface Props {
  summonable: Summonable;
  handleDismiss: () => void;
}

function ConfirmDismissSummonModal({summonable, handleDismiss}: Props) {
  return (
    <div className="modal fade" id="confirmDismissSummonModal" tabIndex={-1} aria-labelledby="confirmDismissSummonModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="confirmDismissSummonModalLabel">Dismiss {`${summonable.data.name ?? summonable.data.type}`}?</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-danger" onClick={handleDismiss} data-bs-dismiss="modal">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDismissSummonModal;