import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';

const INVALID_LOGIN_ERROR = 'auth/invalid-credential';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  console.log('Logging in user with Firebase auth...');
  
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(`Successfully logged in user with email ${user.email}`);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == INVALID_LOGIN_ERROR) {
      alert('Invalid username/password combo :( Please try again!');
    } else {
      console.error(`Error signing in user with Firebase auth: ${JSON.stringify({
        errorCode,
        errorMessage
      })}`);
      return false;
    }
  });
  return true;
}

