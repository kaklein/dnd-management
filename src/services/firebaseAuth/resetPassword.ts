import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = async (email: string) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Failed to send password reset email to ${email}`);
    console.error({
      errorCode: errorCode,
      message: errorMessage
    });
    throw error;
  });
}
