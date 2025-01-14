"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartColumnStacked } from "lucide-react";

interface JobStatsCardProps {
  companyId: string;
}

export function JobStatsCard({ companyId }: JobStatsCardProps) {
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchJobStats = async () => {
      setLoading(true);
      try {
        // 1) Fetch all jobs
        const allJobsSnap = await getDocs(
          collection(db, "companies", companyId, "jobs")
        );
        const totalCount = allJobsSnap.size;

        // 2) Fetch only active jobs
        const activeQuery = query(
          collection(db, "companies", companyId, "jobs"),
          where("status", "==", "active")
        );
        const activeJobsSnap = await getDocs(activeQuery);
        const activeCount = activeJobsSnap.size;

        setTotalJobs(totalCount);
        setActiveJobs(activeCount);
      } catch (error) {
        console.error("Error fetching job stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobStats();
  }, [companyId]);

  return (
    <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-transform">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-200 dark:bg-blue-900 p-2 rounded-md">
            <ChartColumnStacked className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <CardTitle className="text-lg font-semibold dark:text-zinc-300">
            Jobs Summary
          </CardTitle>
        </div>
        <CardDescription>Quick stats on total and active jobs</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-2" />
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Total Jobs:</span>
              <span className="font-bold text-blue-500">{totalJobs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Jobs:</span>
              <span className="font-bold text-blue-500">{activeJobs}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
