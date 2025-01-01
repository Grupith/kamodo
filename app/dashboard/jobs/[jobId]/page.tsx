"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCompany } from "@/contexts/CompanyContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
          const jobData = { id: jobSnapshot.id, ...jobSnapshot.data() } as Job;
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
    <div className="py-10 sm:py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-card text-card-foreground border">
          <CardHeader>
            <CardTitle>
              {isEditing ? (
                <Input
                  value={job.jobName}
                  onChange={(e) => setJob({ ...job, jobName: e.target.value })}
                  className="text-xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold">{job.jobName}</h1>
              )}
            </CardTitle>
            <CardDescription>
              Created on: {new Date(job.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STATUS */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              {isEditing ? (
                <Input
                  id="status"
                  value={job.status}
                  onChange={(e) => setJob({ ...job, status: e.target.value })}
                />
              ) : (
                <p>{job.status}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              {isEditing ? (
                <Input
                  id="description"
                  value={job.description || ""}
                  onChange={(e) =>
                    setJob({ ...job, description: e.target.value })
                  }
                />
              ) : (
                <p>{job.description}</p>
              )}
            </div>

            {/* START DATE */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium">Start Date</Label>
              {isEditing ? (
                <ReactDatePicker
                  className="border border-input rounded-md p-2 text-sm"
                  selected={new Date(job.startDate)}
                  onChange={(date) =>
                    setJob({ ...job, startDate: (date as Date).getTime() })
                  }
                />
              ) : (
                <p>{new Date(job.startDate).toLocaleDateString()}</p>
              )}
            </div>

            {/* END DATE */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium">End Date</Label>
              {isEditing ? (
                <ReactDatePicker
                  className="border border-input rounded-md p-2 text-sm"
                  selected={new Date(job.endDate)}
                  onChange={(date) =>
                    setJob({ ...job, endDate: (date as Date).getTime() })
                  }
                />
              ) : (
                <p>{new Date(job.endDate).toLocaleDateString()}</p>
              )}
            </div>

            <Separator className="my-6" />

            {/* COSTS / CHARGE / TAXES / EXPENSES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COSTS */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="costs" className="text-sm font-medium">
                  Costs
                </Label>
                {isEditing ? (
                  <Input
                    id="costs"
                    type="number"
                    value={job.costs.toString()}
                    onChange={(e) =>
                      setJob({ ...job, costs: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  <p>{job.costs}</p>
                )}
              </div>

              {/* CHARGE */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="charge" className="text-sm font-medium">
                  Charge
                </Label>
                {isEditing ? (
                  <Input
                    id="charge"
                    type="number"
                    value={job.charge.toString()}
                    onChange={(e) =>
                      setJob({ ...job, charge: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  <p>{job.charge}</p>
                )}
              </div>

              {/* TAXES */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="taxes" className="text-sm font-medium">
                  Taxes
                </Label>
                {isEditing ? (
                  <Input
                    id="taxes"
                    type="number"
                    value={job.taxes.toString()}
                    onChange={(e) =>
                      setJob({ ...job, taxes: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  <p>{job.taxes}</p>
                )}
              </div>

              {/* EXPENSES */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="expenses" className="text-sm font-medium">
                  Expenses
                </Label>
                {isEditing ? (
                  <Input
                    id="expenses"
                    type="number"
                    value={job.expenses.toString()}
                    onChange={(e) =>
                      setJob({ ...job, expenses: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  <p>{job.expenses}</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {isEditing ? (
                <>
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
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/jobs")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Back to Jobs
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobDetails;
