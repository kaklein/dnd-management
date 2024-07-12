import { getAuth } from "@firebase/auth"

export const logoutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
  console.log('Logged out.');
}