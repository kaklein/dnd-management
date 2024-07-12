import { sendEmailVerification, User } from "@firebase/auth"

export const sendVerification = async (user: User) => {
  console.log(user.email);
  await sendEmailVerification(user);
  console.log('Email sent!');
}