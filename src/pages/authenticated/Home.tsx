import Navbar from "@components/Navbar";
import { getAuth } from "@firebase/auth";
import { BaseDetails } from "@models/playerCharacter/PlayerCharacter";
import { useNavigate } from "react-router-dom";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Card from "@components/cards/Card";
import Button, { ButtonType } from "@components/Button";

interface Props {
  pcList: BaseDetails[];
  selectedPcId?: string;
  setSelectedPcId: (pcId: string) => void;
}

const handleClick = (pcId: string, navigate: (route: string) => void, setSelectedPcId: (pcId: string) => void) => {
  setSelectedPcId(pcId);
  navigate('/');
}

const sortPcsByName = (a: BaseDetails, b: BaseDetails) => {
  let fullNameA = `${a.name.firstName} ${a.name.lastName}`;
  let fullNameB = `${b.name.firstName} ${b.name.lastName}`;
  if(fullNameA < fullNameB ) return -1;
  return 1;
}

function Home({ selectedPcId, pcList, setSelectedPcId }: Props) {
  const navigate = useNavigate();

  const currentUser = getAuth().currentUser;
  if(!currentUser) throw Error('No current user found.');

  return (
    <>
      <Navbar isSelectedPc={!!selectedPcId}/>

        <PageHeaderBar 
            pageName="Home"
        />

        <Card>
          <div>
            <h4>Select a Player Character</h4>
            <div className="pc-list">
              {pcList.sort((a, b) => sortPcsByName(a, b)).map((pc) => (
                <div key={pc.pcId} className="pc-list-item-center"><Button text={`${pc.name.firstName} ${pc.name.lastName}`} key={pc.pcId} buttonType={ButtonType.DARK} onClick={() => handleClick(pc.pcId, navigate, setSelectedPcId)}/></div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="center">
          <Button text="+ Create New Character" onClick={() => navigate('/create')} buttonType={ButtonType.INFO}/>
          </div>
        </Card>
      </>
  )
}

export default Home;
