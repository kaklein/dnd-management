import { updateProfile, User } from "@firebase/auth"

export const setDisplayName = async (user: User) => {
  const displayName = user.email?.split('@')[0];
  await updateProfile(
    user, {
      displayName: displayName
    }
  );
}