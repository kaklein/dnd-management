import { buildSummonableSummonedKey } from "@components/utils";
import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { Summonable } from "@models/playerCharacter/Summonable";
import { getDefaultFormData } from "@pages/utils";

interface Props {
  summonable: Summonable;
  pcData: PlayerCharacter;
  setFormData: (data: any) => void;
  searchParams: URLSearchParams;
}

function SummonableModal ({summonable, pcData, setFormData, searchParams}: Props) {
  if (!summonable.id) return;
  let className = "col-auto collapse collapse-horizontal drawer-body";
  className = searchParams.get("showSummonable") == "true" ? className.concat(" show") : className;
  return (
    <div className="container-fluid summonable">
      <div className="row">
        <div className={className} id="collapseExample">
          <div className="summonable-content">
            {summonable.data.name &&
            <>
              <h4>{summonable.data.name}</h4>
              <h5><i>{summonable.data.type}</i></h5>
            </>
            }
            {
              !summonable.data.name &&
              <h4>{summonable.data.type}</h4>
            }

            {/* Hit Points display */}
            <div></div>

            {/* AC display */}
            <div>
              <h5>AC:</h5>
              <h4>{summonable.data.armorClass}</h4>
            </div>          

            {/* Dismiss button */}
            <button
              type="button"
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#confirmDismissSummonModal"
              onClick={() => { 
                  setFormData({
                      ...getDefaultFormData(pcData),
                      [buildSummonableSummonedKey(summonable)]: false,
                  });
              }}
            >
              Dismiss
            </button>            
          </div>
        </div>
        <div className="col-auto drawer-handle">
            <button className="btn btn-primary drawer-handle-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              &lt;
            </button>
        </div>
      </div>

    </div>
  )
}

export default SummonableModal;