import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface Job {
  id: string;
  jobName: string;
  createdAt: number;
  status: string;
  description?: string;
  startDate: number;
  endDate: number;
  assignedEmployees?: string[];
  selectedCustomer?: string;
  selectedEquipment?: string[];
  costs: number;
  charge: number;
  taxes: number;
  expenses: number;
}

export const fetchJobDetails = async (
  companyId: string,
  jobId: string
): Promise<Job | null> => {
  if (!companyId || !jobId) throw new Error("Missing companyId or jobId");

  try {
    const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
    const jobSnapshot = await getDoc(jobDocRef);

    if (jobSnapshot.exists()) {
      return { id: jobSnapshot.id, ...jobSnapshot.data() } as Job;
    } else {
      console.error("Job not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error; // Rethrow for handling in the caller
  }
};
