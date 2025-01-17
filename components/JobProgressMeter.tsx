import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartNoAxesCombined } from "lucide-react";

const JobProgressMeter: React.FC = () => {
  return (
    <Card className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border mt-2">
      <CardHeader className="flex flex-row items-center justify-between space-x-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center mb-0.5">
            <ChartNoAxesCombined className="w-6 h-6 mr-2 text-blue-600" />
            Job Progress
          </CardTitle>
          <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Track the progress of the current job.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <span className="text-sm mb-0.5 font-semibold">Current</span>
        <Progress value={33} className="my-0.5" />
      </CardContent>
    </Card>
  );
};

export default JobProgressMeter;
