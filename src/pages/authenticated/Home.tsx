import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import PageHeaderBar from "@components/PageHeaderBar";
import { UserRole } from "@services/firestore/enum/UserRole";
import { readData } from "@services/firestore/crud/read";
import { CollectionName } from "@services/firestore/enum/CollectionName";
import { getAuth } from "@firebase/auth";
import { BaseDetails } from "@models/playerCharacter/PlayerCharacter";
import { useNavigate } from "react-router-dom";

interface Props {
  pcList: BaseDetails[];
  selectedPcId?: string;
  setSelectedPcId: (pcId: string) => void;
}


const handleClick = (pcId: string, navigate: (route: string) => void, setSelectedPcId: (pcId: string) => void) => {
  console.log('Clicked ' + pcId);
  setSelectedPcId(pcId);
  navigate('/');
}

function Home({ selectedPcId, pcList, setSelectedPcId }: Props) {
  const navigate = useNavigate();

  const currentUser = getAuth().currentUser;
  if(!currentUser) throw Error('No current user found.');
  const uid = currentUser.uid;

  return (
    <>
      {selectedPcId &&
        <Navbar/>
      }
        <PageHeaderBar 
            pageName="Home"
        />

        <p>Logged in as user with uid ${uid}</p>

        {
          pcList.map((pc) => (
            <h3 key={pc.pcId}><a onClick={() => handleClick(pc.pcId, navigate, setSelectedPcId)}>{pc.name.firstName} {pc.name.lastName}</a></h3>
          ))
        }



        <Footer/>
    </>
  )
}

export default Home;
