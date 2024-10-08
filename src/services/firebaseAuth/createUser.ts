import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth } from '../../firebase';


export const createUser = async (email: string, password: string): Promise<{
  success: boolean,
  error: any,
  user: User | undefined
}> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      success: true,
      error: {},
      user: user
    };
  } catch (e: any) {
    const errorCode = e.code;
    const errorMessage = e.message;
    console.error(`Error creating user with Firebase auth: ${JSON.stringify({
        errorCode,
        errorMessage
    })}`);
    return {
      success: false,
      error: {
        errorCode: errorCode,
        errorMessage: errorMessage
      },
      user: undefined
    }
  }
}

