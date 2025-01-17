"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useCompany } from "@/contexts/CompanyContext";
import StatusTag from "@/components/StatusTag";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  ClipboardPen,
  Pencil,
  RotateCcw,
  Save,
  Trash,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { fetchJobDetails } from "@/utils/fetchJobDetails";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import JobProgressMeter from "@/components/JobProgressMeter";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";

interface Job {
  id: string;
  jobName: string;
  createdAt: number;
  status: string;
  description?: string;
  startDate: number | undefined;
  endDate: number | undefined;
  assignedEmployees?: string[];
  selectedCustomer?: string;
  selectedEquipment?: string[];
  costs: number;
  charge: number;
  taxes: number;
  expenses: number;
  totalDays?: number;
  repeats?: string;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  // Extract the job ID from the route params
  const jobId = Array.isArray(params?.jobId) ? params.jobId[0] : params?.jobId;

  useEffect(() => {
    if (job?.startDate && job?.endDate) {
      const totalDays = Math.ceil(
        (job.endDate - job.startDate) / (1000 * 60 * 60 * 24)
      );
      setJob((prevJob) => (prevJob ? { ...prevJob, totalDays } : null));
    }
  }, [job?.startDate, job?.endDate]);

  // Memoize the handleFetchJobDetails function
  const handleFetchJobDetails = useCallback(async () => {
    if (!companyId || !jobId) return;

    setLoading(true);
    try {
      const jobData = await fetchJobDetails(companyId, jobId);
      if (jobData) {
        interface TimestampNormalizer {
          (timestamp: number): number;
        }

        const normalizeToMidnight: TimestampNormalizer = (timestamp) => {
          const date = new Date(timestamp);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        };

        const startDate = jobData.startDate
          ? normalizeToMidnight(jobData.startDate)
          : undefined;
        const endDate = jobData.endDate
          ? normalizeToMidnight(jobData.endDate)
          : undefined;

        const totalDays =
          startDate && endDate
            ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
            : undefined;

        setJob({ ...jobData, startDate, endDate, totalDays });
        setOriginalJob({ ...jobData, startDate, endDate, totalDays });
        console.log("Job details fetched:", { startDate, endDate, totalDays });
      } else {
        console.error("Job not found");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  }, [companyId, jobId]);
  // Fetch job details on mount and when dependencies change
  useEffect(() => {
    handleFetchJobDetails();
  }, [handleFetchJobDetails]);

  // Handle saving updated job details to Firestore
  const handleSave = async () => {
    if (!job || !companyId || !jobId) return;

    setSaving(true);
    try {
      const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);

      // Remove undefined fields before updating
      const sanitizedJobData = Object.fromEntries(
        Object.entries({
          jobName: job.jobName,
          description: job.description || "",
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
        }).filter(([, value]) => value !== undefined) // Skip unused key
      );

      await updateDoc(jobDocRef, sanitizedJobData);

      // Reflect saved changes in the original copy
      setOriginalJob(job);
      setIsEditing(false);
      toast({
        title: "Job Updated!",
        description: "The job details have been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
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

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!companyId || !jobId) return;

    try {
      const jobDocRef = doc(db, "companies", companyId, "jobs", jobId);
      await deleteDoc(jobDocRef);

      toast({
        title: "Job Deleted!",
        description: "The job has been successfully deleted.",
        variant: "success",
      });

      // Redirect to the jobs list after deletion
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Render a loading state
  if (loading) {
    return <LoadingSkeleton />;
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
    <div className="py-4 sm:py-4 bg-background min-h-screen mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl px-4 sm:px-4 lg:px-6"
      >
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-400 dark:border-zinc-600 pb-4">
          <div>
            <div className="flex items-center space-x-4">
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
              {/* Job Status */}
              <StatusTag
                status={job.status}
                jobId={job.id}
                companyId={companyId}
                onStatusChange={(newStatus) =>
                  setJob({ ...job, status: newStatus })
                }
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage the details, status, and finances of this job.
            </p>
          </div>

          <section className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
            {/* Edit / Save Buttons */}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row sm:space-x-2">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  <Save className="w-5 h-5 mr-0.5" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-row sm:flex-row space-x-4">
                {/* REFRESH */}
                <Button
                  variant="outline"
                  onClick={handleFetchJobDetails}
                  disabled={loading}
                  size="icon"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="default"
                  className="w-fit md:w-auto"
                >
                  <Pencil className="w-5 h-5 mr-0.5" />
                  Edit
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Job Progress Meter */}
        <div>
          <JobProgressMeter />
        </div>

        {/* Main Grid of Cards */}

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {/* Job Information */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-x-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center mb-0.5">
                  <ClipboardPen className="w-6 h-6 mr-2 text-blue-600" />
                  Job Information
                </CardTitle>
                <CardDescription>
                  Created on {new Date(job.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Add your detailed content */}
              <div>
                <h3 className="text-md font-medium">Description</h3>
                {isEditing ? (
                  <Textarea
                    className="w-full mt-1"
                    value={job.description}
                    onChange={(e) =>
                      setJob({ ...job, description: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {job.description || "No description provided."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Scheduling Card */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-x-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center mb-0.5">
                  {/* Replace with any icon you prefer — e.g., CalendarDays from lucide-react */}
                  <CalendarDays className="w-6 h-6 mr-2 text-blue-600" />
                  Schedule
                </CardTitle>
                <CardDescription>Manage job dates and repeats</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Start Date & End Date Section */}
              <div className="w-full">
                <h3 className="text-md font-medium">Date Range</h3>
                {isEditing ? (
                  <DatePickerWithRange
                    dateRange={{
                      from: job.startDate ? new Date(job.startDate) : undefined,
                      to: job.endDate ? new Date(job.endDate) : undefined,
                    }}
                    onDateChange={(range) => {
                      if (!range) {
                        console.error("Invalid range: range is undefined");
                        return;
                      }

                      const startDate = range.from
                        ? range.from.getTime()
                        : undefined;
                      const endDate = range.to ? range.to.getTime() : undefined;

                      setJob((prevJob) =>
                        prevJob
                          ? {
                              ...prevJob,
                              startDate: startDate ?? undefined,
                              endDate: endDate ?? undefined,
                            }
                          : null
                      );
                    }}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {job.startDate && job.endDate
                      ? `${new Date(
                          job.startDate
                        ).toLocaleDateString()} - ${new Date(
                          job.endDate
                        ).toLocaleDateString()}`
                      : "Date range not set"}
                  </p>
                )}
              </div>

              {/* Total Days & Repeats Section */}

              <div className="flex flex-col sm:flex-row sm:space-x-8">
                {/* Total Days */}
                <div className="w-full sm:w-1/2">
                  <h3 className="text-md font-medium">Total Days</h3>
                  <p className="text-xl text-muted-foreground">
                    {job.totalDays ?? "N/A"}
                  </p>
                </div>
                {/* Repeats */}
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <h3 className="text-md font-medium">Repeats</h3>
                  {isEditing ? (
                    <Input
                      value={job.repeats || ""}
                      onChange={(e) =>
                        setJob({
                          ...job,
                          repeats: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {job.repeats || "No repeats"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Render delete job card in editor view */}
        {isEditing && (
          <div className="mt-8">
            <Card className="w-fit bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 hover:shadow-lg transition-transform">
              <CardHeader>
                <CardTitle className="text-black-600">Delete Job</CardTitle>
                <CardDescription>
                  Deleting this job is permanent and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full lg:w-1/2"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash className="w-5 h-5 mr-0.5" />
                  Delete Job
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* DELETE MODAL */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="rounded-lg dark:bg-zinc-900 dark:border-zinc-800 border">
            <DialogHeader>
              <DialogTitle className="mb-4">Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                job and its associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                className="my-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteJob}
                className="my-2"
              >
                Delete Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default JobDetails;
