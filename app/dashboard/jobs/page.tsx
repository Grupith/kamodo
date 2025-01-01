"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCompany } from "@/contexts/CompanyContext";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const JobsDashboard = () => {
  const { id: companyId } = useCompany(); // Get the companyId from CompanyContext
  interface Job {
    id: string;
    jobName: string;
    description?: string;
    status: string;
    createdAt: number;
  }
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;

      try {
        const jobsRef = collection(db, "companies", companyId, "jobs");
        const snapshot = await getDocs(jobsRef);

        const jobList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        setJobs(jobList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading jobs...</p>
      </div>
    );
  }

  // Filter active jobs
  const activeJobs = jobs.filter((job) => job.status === "active");

  return (
    <div className="py-10 sm:py-16 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Page Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Jobs Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage active jobs and job-related data.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/jobs/new")}
            variant="default"
          >
            Create New Job
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Active Jobs Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Active Jobs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Here are the jobs currently in progress.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{job.jobName}</CardTitle>
                      <CardDescription>
                        {job.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">
                          Created:
                        </span>
                        <span>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <span
                          className={`font-medium ${
                            job.status === "active"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground">
                No active jobs found. Start by creating a new job.
              </p>
            )}
          </div>
        </div>

        {/* All Jobs Section */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">All Jobs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View the history and details of all jobs.
          </p>

          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{job.jobName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.description || "No description"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          job.status === "active"
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {job.status}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobsDashboard;
