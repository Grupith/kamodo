"use client";

import React, { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, TableIcon } from "lucide-react";
import DataTable from "@/components/ui/data-table"; // Update the import to your actual DataTable path

const TasksPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId;
  const searchParams = useSearchParams();
  const jobName = searchParams.get("jobName");

  const [viewMode, setViewMode] = useState<"cards" | "table">("table");

  const tasks = [
    {
      id: "1",
      title: "Task One",
      description: "Description for Task One",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Task Two",
      description: "Description for Task Two",
      status: "Completed",
    },
  ];

  // Correct column definitions
  const columns = [
    {
      accessorKey: "title", // Key in the tasks data
      header: "Title",
      id: "title",
    },
    {
      accessorKey: "description", // Key in the tasks data
      header: "Description",
      id: "description",
    },
    {
      accessorKey: "status", // Key in the tasks data
      header: "Status",
      id: "status",
    },
  ];

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
            <h1 className="text-2xl font-semibold tracking-tight">
              Tasks for Job {jobName && `(${jobName})`}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage tasks for this job.
            </p>
          </div>

          <div className="flex flex-row sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
            {/* Create Task Button */}
            <Button
              onClick={() => router.push(`/dashboard/jobs/${jobId}/tasks/new`)}
              variant="default"
              className="w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-0.5" />
              Create Task
            </Button>

            {/* Toggle View Button */}
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() =>
                setViewMode((prevMode) =>
                  prevMode === "cards" ? "table" : "cards"
                )
              }
            >
              {viewMode === "cards" ? (
                <>
                  <TableIcon className="w-5 h-5 mr-0.5" />
                  Table View
                </>
              ) : (
                <>
                  <ClipboardList className="w-5 h-5 mr-0.5" />
                  Card View
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === "cards" ? (
          <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 p-4 rounded-lg"
              >
                <h2 className="font-medium text-lg">{task.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
                <p className="text-sm mt-2">
                  <strong>Status:</strong> {task.status}
                </p>
              </div>
            ))}
          </section>
        ) : (
          <div className="mt-4">
            <DataTable
              columns={columns}
              data={tasks}
              onRowClick={(row) =>
                router.push(`/dashboard/jobs/${jobId}/tasks/${row.id}`)
              }
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TasksPage;
