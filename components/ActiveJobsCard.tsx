"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, FileText, Menu } from "lucide-react";

interface Job {
  id: string;
  jobName: string;
  status: string;
  // Add other job fields if needed (e.g. createdAt)
}

interface ActiveJobsCardProps {
  jobs: Job[];
  onFilterChange: (filter: string) => void;
}

export function ActiveJobsCard({ jobs, onFilterChange }: ActiveJobsCardProps) {
  return (
    <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
      {/* Card Header */}
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <div className="bg-green-200 dark:bg-green-900 p-2 rounded-md">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle className="text-lg font-semibold dark:text-zinc-200">
              Active Jobs
            </CardTitle>
          </div>

          {/* Filter Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-4 rounded-md hover:bg-muted cursor-pointer">
                <Menu className="h-6 w-6" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onFilterChange("status")}>
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange("date-asc")}>
                  Date Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange("date-desc")}>
                  Date Desc
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {/* Card Content with the Active Jobs */}
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="block"
              >
                <Card className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-800 hover:scale-105 transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle className="text-lg font-medium">
                        {job.jobName}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active jobs found.</p>
        )}
      </CardContent>
    </Card>
  );
}
