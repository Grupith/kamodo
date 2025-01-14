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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusTag from "@/components/StatusTag";

// 1) Add this import for pagination:
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Activity } from "lucide-react";

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
  const router = useRouter();

  // 2) Pagination states:
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Adjust this to show more/less jobs per page
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Handlers for next & previous page
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

  // 3) Slice the jobs array to show only the jobs for the current page:
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

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
            <h1 className="text-2xl font-semibold tracking-tight">
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

        <Separator className="my-2" />

        {/* Active Jobs Section */}
        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <Activity size={24} className="text-zinc-500 dark:text-zinc-400" />
            <h2 className="text-xl font-semibold tracking-tight">
              Active Jobs
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Here are the jobs currently in progress.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-6">
            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 cursor-pointer hover:shadow-lg hover:scale-105 transition-transform">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={job.image ?? ""} alt="Job Avatar" />
                        <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800">
                          #
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium">
                            {job.jobName}
                          </CardTitle>
                          <StatusTag status={job.status} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Created on{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {job.description ? (
                        <CardDescription>{job.description}</CardDescription>
                      ) : (
                        <CardDescription>No description</CardDescription>
                      )}
                      <Separator className="my-2" />
                      {/* Additional info can go here if needed */}
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

          {/* 4) Display only the sliced jobs (`currentJobs`) instead of `jobs`: */}
          <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {currentJobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border cursor-pointer hover:shadow-lg hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={job.image ?? ""} alt="Job Avatar" />
                      <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800">
                        J
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center w-full">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">
                          {job.jobName}
                        </CardTitle>
                        <StatusTag status={job.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Created on{" "}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {job.description ? (
                      <CardDescription>{job.description}</CardDescription>
                    ) : (
                      <CardDescription>No description</CardDescription>
                    )}
                    <Separator className="my-2" />
                    {/* Additional job info can go here */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 5) Add the pagination component below the jobs grid */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous Button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePreviousPage();
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Render page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  {/* Ellipsis example (optional) */}
                  {/*
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  */}

                  {/* Next Button */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handleNextPage();
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JobsDashboard;
