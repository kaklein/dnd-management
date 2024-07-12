import { updateProfile, User } from "@firebase/auth"

export const setDisplayName = async (user: User) => {
  console.log(user.email);
  const displayName = user.email?.split('@')[0];
  await updateProfile(
    user, {
      displayName: displayName
    }
  );
  console.log('Updated displayName to ' + displayName);
}