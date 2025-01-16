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
  deleteDoc,
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

interface Employee {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  createdAt?: any; // Use Firebase Timestamp if applicable
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
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

  // Convert Firestore Timestamp to JavaScript Date
  if (companyData.createdAt?.toDate) {
    companyData.createdAt = companyData.createdAt.toDate();
  }

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

// FetchCustomers
export async function fetchCustomers(companyId: string): Promise<Customer[]> {
  const customersRef = collection(db, "companies", companyId, "customers");
  const querySnapshot = await getDocs(customersRef);
  const customers: Customer[] = [];
  querySnapshot.forEach((doc) => {
    customers.push({ id: doc.id, ...doc.data() } as Customer);
  });
  return customers;
}

// FetchCustomerById
export async function fetchCustomerById(companyId: string, customerId: string) {
  const docRef = doc(db, `companies/${companyId}/customers/${customerId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Customer not found");
  }
}

// Delete customer by ID
export async function deleteCustomerById(
  companyId: string,
  customerId: string
): Promise<void> {
  if (!companyId || !customerId) {
    throw new Error(
      "Both companyId and customerId are required to delete a customer."
    );
  }

  try {
    const customerDocRef = doc(
      db,
      "companies",
      companyId,
      "customers",
      customerId
    );
    await deleteDoc(customerDocRef);
    console.log(`Customer with ID: ${customerId} successfully deleted.`);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer.");
  }
}

// Get employees for a company
export const getEmployeesForCompany = async (companyId: string) => {
  const employeesRef = collection(db, "companies", companyId, "employees");
  const querySnapshot = await getDocs(employeesRef);
  const employees: Employee[] = [];
  querySnapshot.forEach((doc) => {
    employees.push({ id: doc.id, ...doc.data() } as Employee);
  });

  return employees;
};

// Fetch employee by ID
export async function fetchEmployeeById(companyId: string, employeeId: string) {
  const docRef = doc(db, `companies/${companyId}/employees`, employeeId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Employee not found");
  }
}

// Delete employee by ID
export const deleteEmployeeById = async (
  companyId: string,
  employeeId: string
): Promise<void> => {
  if (!companyId || !employeeId) {
    throw new Error("Both companyId and employeeId are required.");
  }

  try {
    const employeeDocRef = doc(
      db,
      "companies",
      companyId,
      "employees",
      employeeId
    );
    await deleteDoc(employeeDocRef);
    console.log(`Employee with ID: ${employeeId} successfully deleted.`);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Fetch equipment for a company
export const getEquipmentForCompany = async (companyId: string) => {
  if (!companyId) {
    throw new Error(
      "Invalid companyId: companyId is required to fetch equipment."
    );
  }

  const equipmentRef = collection(db, "companies", companyId, "equipment");
  const querySnapshot = await getDocs(equipmentRef);
  const equipment: { id: string; [key: string]: any }[] = [];
  querySnapshot.forEach((doc) => {
    equipment.push({ id: doc.id, ...doc.data() });
  });

  return equipment;
};

// Fetch equipment by ID
export const fetchEquipmentById = async (
  companyId: string,
  equipmentId: string
) => {
  try {
    console.log(
      "Fetching equipment for Company ID:",
      companyId,
      "Equipment ID:",
      equipmentId
    );
    const docRef = doc(db, `companies/${companyId}/equipment/${equipmentId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`No equipment found for ID: ${equipmentId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

// Delete equipment by ID
export async function deleteEquipmentById(
  companyId: string,
  equipmentId: string
): Promise<void> {
  if (!companyId || !equipmentId) {
    throw new Error("Both companyId and equipmentId are required");
  }

  try {
    const equipmentRef = doc(
      db,
      "companies",
      companyId,
      "equipment",
      equipmentId
    );
    await deleteDoc(equipmentRef);
    console.log(`Equipment with ID: ${equipmentId} successfully deleted.`);
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw new Error("Failed to delete equipment.");
  }
}

// Create job document
export async function createJob(companyId: string, jobData: any) {
  try {
    const jobsRef = collection(db, "companies", companyId, "jobs");
    const newJobRef = await addDoc(jobsRef, jobData);
    console.log("Job created with ID:", newJobRef.id);
    return newJobRef.id;
  } catch (error) {
    console.error("Error creating job:", error);
    throw new Error("Failed to create job. Please try again.");
  }
}

// Checks if user exists in the 'users' collection, creates a new user document if not.
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

// Creates a new company, assigns the user as Owner, and updates the user's companyId.
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
