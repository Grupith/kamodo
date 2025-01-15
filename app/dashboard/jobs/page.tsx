"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusTag from "@/components/StatusTag";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Activity, Plus, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const JobsDashboard = () => {
  const { id: companyId } = useCompany();

  interface Job {
    id: string;
    jobName: string;
    description?: string;
    status: string;
    createdAt: number;
    image?: string;
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
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
  }, [companyId]); // Memoize with `companyId` as a dependency

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Pagination functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const activeJobs = jobs.filter((job) => job.status === "active");

  return (
    <div className="py-4 sm:py-4 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl px-4 sm:px-4 lg:px-6"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage active jobs and job-related data.
            </p>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Button onClick={() => fetchJobs()} variant="secondary">
              <RefreshCcw size={16} />
            </Button>
            <Button
              onClick={() => {
                router.push("/dashboard/jobs/new");
                console.log("Create new job");
              }}
              variant="default"
            >
              <Plus size={16} />
              New
            </Button>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <Activity
              size={24}
              className="text-green-500 dark:text-green-400"
            />
            <h2 className="text-xl font-semibold tracking-tight dark:text-zinc-100">
              Active Jobs
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Here are the jobs currently in progress.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 mt-6">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <Card
                  key={job.id}
                  onClick={() => {
                    router.push(`/dashboard/jobs/${job.id}`);
                  }}
                  className="border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:scale-105 transition-all"
                >
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={job.image ?? ""} alt="Job Avatar" />
                      <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
                        #
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center w-full">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">
                          {job.jobName}
                        </CardTitle>
                        <StatusTag
                          status={job.status}
                          jobId={job.id}
                          companyId={companyId}
                          onStatusChange={(newStatus) => {
                            setJobs((prevJobs) =>
                              prevJobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, status: newStatus }
                                  : j
                              )
                            );
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Created on{" "}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription>
                      {job.description || "No description provided."}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No active jobs found.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight">All Jobs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View the history and details of all jobs.
          </p>

          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {currentJobs.map((job) => (
              <Card
                key={job.id}
                onClick={() => {
                  router.push(`/dashboard/jobs/${job.id}`);
                }}
                className="border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:scale-105 transition-all"
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={job.image ?? ""} alt="Job Avatar" />
                    <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
                      J
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center w-full">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">
                        {job.jobName}
                      </CardTitle>
                      <StatusTag
                        status={job.status}
                        jobId={job.id}
                        companyId={companyId}
                        onStatusChange={(newStatus) => {
                          setJobs((prevJobs) =>
                            prevJobs.map((j) =>
                              j.id === job.id ? { ...j, status: newStatus } : j
                            )
                          );
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription>
                    {job.description || "No description provided."}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobsDashboard;
