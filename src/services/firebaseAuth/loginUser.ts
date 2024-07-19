import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { getUserRole } from "@services/firestore/getUserRole";

const INVALID_LOGIN_ERROR = 'auth/invalid-credential';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userRole = await getUserRole(userCredential.user.uid);
    localStorage.setItem('userRole', userRole);
  } catch (e: any) {
    const errorCode = e.code;
    const errorMessage = e.message;
    if (errorCode == INVALID_LOGIN_ERROR) {
      alert('Invalid username/password combo :( Please try again!');
    } else {
      console.error(`Error signing in user with Firebase auth: ${JSON.stringify({
        errorCode,
        errorMessage
      })}`);
      return false;
    }
  };
  return true;
};

