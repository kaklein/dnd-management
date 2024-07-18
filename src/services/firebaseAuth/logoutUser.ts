import { getAuth } from "@firebase/auth"

export const logoutUser = async () => {
  const auth = getAuth();
  await auth.signOut();
  localStorage.clear();
  console.log('Logged out.');
}