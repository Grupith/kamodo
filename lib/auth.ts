"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

// Sign out user
// returns A promise that resolves when the sign-out is complete.
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out sucessfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
