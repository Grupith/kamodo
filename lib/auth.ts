"use client";
import { signOut } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { checkOrCreateUserDoc } from "@/firebase/firestore";

// Handle the google sign in process
export const handleGoogleLogin = async ({
  onLoginSuccess,
  onError,
}: {
  onLoginSuccess: (newUser: boolean, companyId?: string) => void;
  onError: (message: string) => void;
}) => {
  try {
    // Set the prompt to force account selection
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check or Create user document
    const { newUser, userData } = await checkOrCreateUserDoc(
      firebaseUser.uid,
      firebaseUser.displayName || "",
      firebaseUser.email || ""
    );

    // Trigger success callback
    onLoginSuccess(newUser, userData?.companyId);
  } catch (error: unknown) {
    // Trigger error callback
    if (error instanceof Error) {
      onError(error.message);
    } else {
      onError("An unknown error occurred during login.");
    }
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out sucessfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
