"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useCompany } from "@/contexts/CompanyContext";

// Custom components
import StatusTag from "@/components/StatusTag";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Job {
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

const JobDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { id: companyId } = useCompany();

  const [job, setJob] = useState<Job | null>(null);
  const [originalJob, setOriginalJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Extract the job ID from the route params
  const jobId = Array.isArray(params?.jobId) ? params.jobId[0] : params?.jobId;

  // Fetch the job details once on mount
  useEffect(() => {
    if (!companyId || !jobId) return;

    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
        const jobSnapshot = await getDoc(jobDocRef);

        if (jobSnapshot.exists()) {
          const jobData = {
            id: jobSnapshot.id,
            ...jobSnapshot.data(),
          } as Job;
          setJob(jobData);
          setOriginalJob(jobData);
        } else {
          console.error("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [companyId, jobId]);

  // Handle saving updated job details to Firestore
  const handleSave = async () => {
    if (!job || !companyId || !jobId) return;

    setSaving(true);
    try {
      const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
      await updateDoc(jobDocRef, {
        jobName: job.jobName,
        description: job.description,
        startDate: job.startDate,
        endDate: job.endDate,
        assignedEmployees: job.assignedEmployees,
        selectedCustomer: job.selectedCustomer,
        selectedEquipment: job.selectedEquipment,
        costs: job.costs,
        charge: job.charge,
        taxes: job.taxes,
        expenses: job.expenses,
        status: job.status,
      });
      // Reflect saved changes in the original copy
      setOriginalJob(job);
      setIsEditing(false);
      alert("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing: revert changes to original job
  const handleCancelEdit = () => {
    if (originalJob) {
      setJob({ ...originalJob });
    }
    setIsEditing(false);
  };

  // Render a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  // If job was not found
  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-4 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-6"
      >
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            {/* If editing, show an input for the job name */}
            {isEditing ? (
              <Input
                className="text-2xl font-semibold tracking-tight w-full md:w-auto"
                value={job.jobName}
                onChange={(e) => setJob({ ...job, jobName: e.target.value })}
              />
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight">
                {job.jobName}
              </h1>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Manage the details, status, and finances of this job.
            </p>
          </div>

          {/* Edit / Save Buttons */}
          {isEditing ? (
            <div className="flex justify-between items-center space-x-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="default"
                className="w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center sm:space-x-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="default"
                className="w-full sm:w-auto"
              >
                Edit Job
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/dashboard/jobs")}
              >
                Back to Jobs
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* MAIN CARD */}
        <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border mt-4">
          {/* Header with Status (TaskStatus) & Created On */}
          <CardHeader className="flex flex-row items-center justify-between space-x-4">
            <div>
              <CardTitle className="text-lg font-medium">Job Details</CardTitle>
              <CardDescription className="text-xs">
                Created on {new Date(job.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>

            {/* Status in header */}
            {isEditing ? (
              <Input
                className="w-36"
                value={job.status}
                onChange={(e) => setJob({ ...job, status: e.target.value })}
              />
            ) : (
              <StatusTag status={job.status} />
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* DESCRIPTION, START DATE, END DATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DESCRIPTION */}
              <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      value={job.description || ""}
                      onChange={(e) =>
                        setJob({ ...job, description: e.target.value })
                      }
                    />
                  ) : job.description ? (
                    <p>{job.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No description provided.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* START DATE */}
              <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                <CardHeader>
                  <CardTitle>Start Date</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={
                        new Date(job.startDate).toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setJob({
                          ...job,
                          startDate: new Date(e.target.value).getTime(),
                        })
                      }
                    />
                  ) : (
                    <p>{new Date(job.startDate).toLocaleDateString()}</p>
                  )}
                </CardContent>
              </Card>

              {/* END DATE */}
              <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                <CardHeader>
                  <CardTitle>End Date</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={new Date(job.endDate).toISOString().split("T")[0]}
                      onChange={(e) =>
                        setJob({
                          ...job,
                          endDate: new Date(e.target.value).getTime(),
                        })
                      }
                    />
                  ) : (
                    <p>{new Date(job.endDate).toLocaleDateString()}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* FINANCES SECTION */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Finances</h2>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* COSTS */}
                <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                  <CardHeader>
                    <CardTitle>Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={job.costs.toString()}
                        onChange={(e) =>
                          setJob({ ...job, costs: parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      <p>{job.costs}</p>
                    )}
                  </CardContent>
                </Card>

                {/* CHARGE */}
                <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                  <CardHeader>
                    <CardTitle>Charge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={job.charge.toString()}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            charge: parseFloat(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <p>{job.charge}</p>
                    )}
                  </CardContent>
                </Card>

                {/* TAXES */}
                <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                  <CardHeader>
                    <CardTitle>Taxes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={job.taxes.toString()}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            taxes: parseFloat(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <p>{job.taxes}</p>
                    )}
                  </CardContent>
                </Card>

                {/* EXPENSES */}
                <Card className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border hover:shadow-lg hover:scale-[1.01] transition-transform">
                  <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={job.expenses.toString()}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            expenses: parseFloat(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <p>{job.expenses}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default JobDetails;
