import { useState } from "react";
import Button, { ButtonType } from "@components/Button";
import { BaseDetails } from "@models/playerCharacter/PlayerCharacter";
import { useNavigate } from "react-router-dom";

interface Props {
  pageName: string;
  pcList: BaseDetails[];
  pcName: string;
  selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
}



function PageHeaderBarPC ({pageName, pcList, pcName, selectedPc}: Props) {
  const navigate = useNavigate();
  const [showPcs, setShowPcs] = useState(false);

  const handleExpandCollapseClick = () => {
    if(!pcList) setShowPcs(false);
    else setShowPcs(!showPcs);
  }

  const handlePcClick = (pcId: string) => {
    selectedPc.setSelectedPcId(pcId);
    setShowPcs(false);
  }

  return (
    <div className="container-fluid page-header-bar">
      <div className="row">
        <div className="col-sm">
          <div className="pc-select">
            <div className="pc-show-collapse-bar">
               <Button text="Select Character" buttonType={ButtonType.INFO} onClick={handleExpandCollapseClick}></Button>
              <p>{pcName}</p>
            </div>
            {
              showPcs &&
              <div className="pc-list">
                {pcList!.filter(pc => pc.pcId !== selectedPc.pcId).sort((a, b) => {
                  const aName = `${a.name.firstName} ${a.name.lastName}`;
                  const bName = `${b.name.firstName} ${b.name.lastName}`;
                  if (aName < bName) return -1;
                  return 1;
                }).map((pc) => (
                    <div key={pc.pcId} className="pc-list-item"><Button onClick={() => handlePcClick(pc.pcId)} buttonType={ButtonType.DARK} text={`${pc.name.firstName} ${pc.name.lastName}`}/></div>
                ))}
                <div className="divider"></div>
                <div className="pc-list-item-add pc-list-item-center"><Button onClick={() => navigate('/create')} buttonType={ButtonType.INFO} text="+ Create New Character"/></div>
              </div>
            }
          </div>
        </div>
        <div className="col-sm-auto page-header-page-name">
          {pageName}
        </div>
        <div className="col-sm"/>
      </div>
    </div>
  )
}

export default PageHeaderBarPC;