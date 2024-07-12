import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { useEffect, useState } from "react";

const useFirebaseAuthentication = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    })
  }, []);

  return !!authUser;
}

export default useFirebaseAuthentication;