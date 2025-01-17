"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusTag from "@/components/StatusTag";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

import {
  AdjustmentsHorizontalIcon,
  FolderPlusIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { useCompany } from "@/contexts/CompanyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw } from "lucide-react";

interface Job {
  id: string;
  jobName: string;
  description?: string;
  status: string;
  createdAt: number;
  image?: string;
}

export default function JobsDashboard() {
  const router = useRouter();
  const { id: companyId } = useCompany();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);

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
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Filter jobs whenever `jobs` or `searchTerm` changes
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = jobs.filter((job) => {
      const { jobName = "", description = "", status = "" } = job;
      // Add more fields if needed (e.g., assignedEmployees, etc.)
      return (
        jobName.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term)
      );
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  // Toggle cards ↔ table
  const toggleView = () => {
    setView((prev) => (prev === "cards" ? "table" : "cards"));
  };

  // Handle "Enter" to jump to first match, or "Escape" to clear
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredJobs.length > 0) {
      router.push(`/dashboard/jobs/${filteredJobs[0].id}`);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  // DataTable columns
  const columns: ColumnDef<Job>[] = [
    {
      id: "jobName",
      accessorKey: "jobName",
      header: "Job Name",
      cell: ({ row }) => row.original.jobName || "No Name",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusTag
          status={row.original.status}
          jobId={row.original.id}
          companyId={companyId}
          onStatusChange={(newStatus) =>
            setJobs((prevJobs) =>
              prevJobs.map((j) =>
                j.id === row.original.id ? { ...j, status: newStatus } : j
              )
            )
          }
        />
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString() || "",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-6">
        <p>Loading jobs...</p>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      {/* HEADER / CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
          {/* SEARCH INPUT */}
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          <div className="flex gap-4">
            {/* TOGGLE VIEW */}
            <Button variant="outline" size="icon" onClick={toggleView}>
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </Button>
            {/* REFRESH */}
            <Button variant="outline" size="icon" onClick={() => fetchJobs()}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            {/* NEW JOB */}
            <Button variant="default" asChild>
              <Link href="/dashboard/jobs/new">
                <FolderPlusIcon className="w-4 h-4" />
                Create Job
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* TOGGLE: CARDS or TABLE */}
      {view === "cards" ? (
        <motion.div
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-lg
                    border
                    bg-zinc-100
                    dark:bg-zinc-900
                    text-card-foreground
                    shadow-sm
                    transition-transform
                    hover:scale-105
                    hover:shadow-lg
                    dark:border-zinc-800
                    p-2
                  "
                >
                  {/* Header */}
                  <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={job.image ?? ""} alt="Job Avatar" />
                          <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
                            <FolderIcon className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>

                        {/* Title & Created Date */}
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-semibold line-clamp-1">
                            {job.jobName}
                          </CardTitle>
                          <span className="mt-0.5 text-xs text-muted-foreground">
                            Created on{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* StatusTag (right aligned on larger screens) */}
                      <div className="w-fit">
                        <StatusTag
                          status={job.status}
                          jobId={job.id}
                          companyId={companyId}
                          onStatusChange={(newStatus) =>
                            setJobs((prevJobs) =>
                              prevJobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, status: newStatus }
                                  : j
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="p-4">
                    <CardDescription className="text-sm line-clamp-3 mb-4">
                      {job.description || "No description provided."}
                    </CardDescription>

                    {/* View button with Link */}
                    <Link href={`/dashboard/jobs/${job.id}`} passHref>
                      <Button variant="default" asChild>
                        <span>View Job</span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              No jobs found.
            </p>
          )}
        </motion.div>
      ) : (
        // TABLE VIEW
        <DataTable
          columns={columns}
          data={filteredJobs}
          onRowClick={(row) => router.push(`/dashboard/jobs/${row.id}`)}
        />
      )}
    </div>
  );
}
