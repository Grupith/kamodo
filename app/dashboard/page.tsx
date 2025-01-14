"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import CompanyCard from "@/components/CompanyCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCompany } from "@/contexts/CompanyContext";
import { ActiveJobsCard } from "@/components/ActiveJobsCard";

export default function DashboardPage() {
  const { company, loading } = useCompany();
  // State to hold your top 3 active jobs
  interface Job {
    id: string;
    jobName: string;
    status: string;
  }
  const [topJobs, setTopJobs] = useState<Job[]>([]);

  // Fetch the top 3 active jobs from Firestore when companyId is available
  useEffect(() => {
    if (!company?.id) return;

    const fetchTopJobs = async () => {
      try {
        const jobsRef = collection(db, "companies", company.id, "jobs");
        const q = query(jobsRef, where("status", "==", "active"), limit(3));
        const snapshot = await getDocs(q);

        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          jobName: doc.data().jobName,
          status: doc.data().status,
        })) as Job[];

        setTopJobs(jobsData);
      } catch (error) {
        console.error("Error fetching top jobs:", error);
      }
    };

    fetchTopJobs();
  }, [company?.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p>Loading company information...</p>
        </div>
      </ProtectedRoute>
    );
  }

  function handleFilterChange(filter: string) {
    // TODO: implement logic for re-sorting or re-fetching your jobs
    // e.g., set sorting or pass filter query to Firestore, etc.
    console.log("Filtering by:", filter);
  }

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CompanyCard */}
          <div className="col-span-1 lg:col-span-2">
            {company ? (
              <CompanyCard company={company} />
            ) : (
              <p>No company information available.</p>
            )}
          </div>

          {/* Active Jobs Card */}
          <div className="col-span-2 rounded-lg">
            <ActiveJobsCard
              jobs={topJobs}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Example placeholder card */}
          <div className="col-span-1 border rounded-lg border-[var(--border)] bg-card bg-zinc-100 dark:bg-zinc-900">
            <div className="shadow-md rounded-lg p-6 h-full">
              <h2 className="text-xl font-semibold">Additional Component</h2>
              <p>Details about this component go here.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
