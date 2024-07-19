import { sendEmailVerification, User } from "@firebase/auth"

export const sendVerification = async (user: User) => {
  await sendEmailVerification(user);
}