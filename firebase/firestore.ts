import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface UserDoc {
  uid: string;
  displayName: string | null;
  email: string | null;
  companyId: string | null;
  createdAt: any;
}

export const checkOrCreateUserDoc = async (
  userId: string,
  displayName: string | null,
  email: string | null
): Promise<UserDoc | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      // Create a new user document
      const newUser: UserDoc = {
        uid: userId,
        displayName,
        email,
        companyId: null,
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, newUser);
      console.log("New user document created:", newUser);
      return newUser;
    } else {
      // Return existing user document
      console.log("User document already exists:", userSnapshot.data());
      return userSnapshot.data() as UserDoc;
    }
  } catch (error) {
    console.error("Error checking or creating user document:", error);
    return null;
  }
};
