import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth } from '../../firebase';
import { SentryLogger } from "@services/sentry/logger";


export const createUser = async (email: string, password: string, logger: SentryLogger): Promise<{
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
    logger.logError(`Error creating user with Firebase auth: ${JSON.stringify({
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

