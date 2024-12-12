// lib/firestore.ts

import { db } from "./firebase"; // Ensure Firebase is correctly initialized here
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface Company {
  id: string;
  name: string;
  numberOfEmployees?: number;
  website?: string;
  state?: string;
  businessType?: string;
  ownerId: string;
  createdAt?: any; // Use Firebase Timestamp if applicable
}

// Fetch company data
export const fetchCompanyDataByOwnerId = async (
  uid: string
): Promise<Company> => {
  if (!uid) throw new Error("User ID is required");

  const companiesRef = collection(db, "companies");
  const q = query(companiesRef, where("ownerId", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No company found for the given owner ID");
  }

  // Assuming one company per owner, take the first result
  const companyDoc = querySnapshot.docs[0];
  const companyData = companyDoc.data();

  // Ensure the return value matches the Company type
  return {
    id: companyDoc.id,
    name: companyData.name,
    numberOfEmployees: companyData.numberOfEmployees,
    website: companyData.website,
    state: companyData.state,
    businessType: companyData.businessType,
    ownerId: companyData.ownerId,
    createdAt: companyData.createdAt,
  };
};

/**
 * Checks if a user document exists; if not, creates it.
 *
 * @param uid - The user's unique identifier.
 * @param displayName - The user's display name.
 * @param email - The user's email.
 * @returns An object indicating whether the user was newly created and their data.
 */
export async function checkOrCreateUserDoc(
  uid: string,
  displayName: string,
  email: string
) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid,
      displayName: displayName || "",
      email,
      companyId: null, // No company yet
      createdAt: serverTimestamp(),
    });
    return { newUser: true };
  }

  return { newUser: false, userData: userSnap.data() };
}

/**
 * Creates a new company, assigns the user as Owner, and updates the user's companyId.
 *
 * @param uid - The user's unique identifier.
 * @param companyName - The name of the company.
 * @param numberOfEmployees - Number of employees in the company.
 * @param website - Company website URL.
 * @param state - State where the company is located.
 * @param businessType - Type of business.
 * @returns The newly created company's ID.
 */
export async function createCompany(
  uid: string,
  companyName: string,
  numberOfEmployees: number,
  website: string,
  state: string,
  businessType: string
): Promise<string> {
  try {
    // 1. Add a new company document to the 'companies' collection
    const companyRef = await addDoc(collection(db, "companies"), {
      name: companyName,
      numberOfEmployees,
      website,
      state,
      businessType,
      ownerId: uid,
      createdAt: serverTimestamp(),
    });

    const companyId = companyRef.id;

    // 2. Fetch user data to get email and displayName
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User document does not exist.");
    }

    const userData = userSnap.data();

    // 3. Create a membership document for the owner in the 'members' subcollection
    await setDoc(doc(db, "companies", companyId, "members", uid), {
      displayName: userData.displayName,
      email: userData.email,
      role: "Owner",
      joinedAt: serverTimestamp(),
    });

    // 4. Update the user's document with the new companyId
    await updateDoc(doc(db, "users", uid), {
      companyId,
    });

    return companyId;
  } catch (error) {
    console.error("Error creating company:", error);
    throw new Error("Failed to create company. Please try again.");
  }
}
