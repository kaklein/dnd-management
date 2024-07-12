import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth } from '../../firebase';

export const createUser = async (email: string, password: string): Promise<User | undefined> => {
  console.log('Creating user with Firebase');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`Successfully created user with email ${user.email}`);
    return user;
  } catch (e: any) {
    const errorCode = e.code;
    const errorMessage = e.message;
    console.error(`Error creating user with Firebase auth: ${JSON.stringify({
      errorCode,
      errorMessage
    })}`);
  }
}

