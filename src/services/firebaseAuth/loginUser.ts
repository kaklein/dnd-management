import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { logError } from "@services/sentry/logger";

const INVALID_LOGIN_ERROR = 'auth/invalid-credential';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    const errorCode = e.code;
    const errorMessage = e.message;
    if (errorCode == INVALID_LOGIN_ERROR) {
      alert('Invalid username/password combo :( Please try again!');
    } else {
      logError(`Error signing in user with Firebase auth: ${JSON.stringify({
        errorCode,
        errorMessage
      })}`);
      return false;
    }
  };
  return true;
};

