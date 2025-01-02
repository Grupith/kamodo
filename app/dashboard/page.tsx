"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import CompanyCard from "@/components/CompanyCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCompany } from "@/contexts/CompanyContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

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

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CompanyCard */}
          <div className="col-span-1 lg:col-span-2">
            {company ? (
              <CompanyCard company={company} />
            ) : (
              <p>No company information available.</p>
            )}
          </div>

          {/* Example placeholder card */}
          <div className="col-span-1 border rounded-lg border-[var(--border)] bg-card bg-zinc-100 dark:bg-zinc-900">
            <div className="shadow-md rounded-lg p-6 h-full">
              <h2 className="text-xl font-semibold">Additional Component</h2>
              <p>Details about this component go here.</p>
            </div>
          </div>

          {/* Top 3 Active Jobs Card */}
          <div className="col-span-1 rounded-lg border border-[var(--border)] bg-card bg-zinc-100 dark:bg-zinc-900">
            <Card className="h-full border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Top 3 Active Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topJobs.length > 0 ? (
                  <div className="space-y-4">
                    {topJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/dashboard/jobs/${job.id}`}
                        className="block"
                      >
                        <Card className="border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 hover:dark:bg-zinc-800 transition-colors">
                          <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                              {job.jobName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground">
                              Status: {job.status}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active jobs found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
