"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash } from "lucide-react";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

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

      // Remove undefined fields before updating
      const sanitizedJobData = Object.fromEntries(
        Object.entries({
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
        }).filter(([, value]) => value !== undefined) // Skip unused key
      );

      await updateDoc(jobDocRef, sanitizedJobData);

      // Reflect saved changes in the original copy
      setOriginalJob(job);
      setIsEditing(false);
      toast({
        title: "Job Updated",
        description: "Job details have been successfully updated.",
        variant: "default",
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
        title: "Job Deleted",
        description: "The job has been successfully deleted.",
        variant: "default",
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
    <div className="py-4 sm:py-4 bg-background min-h-screen mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl px-4 sm:px-4 lg:px-6"
      >
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-500 dark:border-zinc-300 pb-4">
          <div>
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
                <Pencil className="w-5 h-5 mr-0.5" />
                Edit Job
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* MAIN CARD */}
        {/* Existing Cards and Details */}
        <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border mt-4">
          <CardHeader className="flex flex-row items-center justify-between space-x-4">
            <div>
              <CardTitle className="text-lg font-medium">Job Details</CardTitle>
              <CardDescription>
                Created on {new Date(job.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            {isEditing ? (
              <Input
                className="w-36"
                value={job.status}
                onChange={(e) => setJob({ ...job, status: e.target.value })}
              />
            ) : (
              <StatusTag
                status={job.status}
                jobId={job.id}
                companyId={companyId}
                onStatusChange={(newStatus) =>
                  setJob({ ...job, status: newStatus })
                }
              />
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add your detailed content */}
          </CardContent>
        </Card>

        {/* DELETE JOB CARD */}
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
