import { PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import Home from "./Home";
import Login from "./Login";

interface Props {
  loggedIn: boolean;
  pcData?: PlayerCharacter;
}

function IndexRouter ({loggedIn, pcData}: Props) {
  return (
    <>
      {
        !loggedIn &&
        <Login/>
      }
      {
        loggedIn &&
        <Home pcData={pcData!}/>
      }
    </>

  )
}

export default IndexRouter;