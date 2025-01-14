import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HardHat } from "lucide-react";
import { Separator } from "./ui/separator";

interface Company {
  name: string;
  numberOfEmployees?: number;
  website?: string;
  state?: string;
  businessType?: string;
  createdAt?: string; // Firebase Timestamp
}

const CompanyCard = ({ company }: { company: Company | null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border border-[var(--border)] bg-card bg-zinc-100 dark:bg-zinc-900 text-card-foreground">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="bg-orange-200 dark:bg-orange-700 p-2 rounded-md">
              <HardHat className="w-5 h-5 text-orange-500 dark:text-orange-300" />
            </div>
            <CardTitle className="text-lg font-semibold dark:text-zinc-300">
              {company?.name || "No Company Name Available"}
            </CardTitle>
          </div>
          <CardDescription className="text-zinc-500 font-medium">
            {company?.businessType || "Business type not specified"}
          </CardDescription>
        </CardHeader>
        <Separator />
        {/* Company Details */}
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">
              Number of Employees:
            </Label>
            <span>{company?.numberOfEmployees ?? "N/A"}</span>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Website:</Label>
            <a
              href={
                company?.website
                  ? company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {company?.website || "Not Provided"}
            </a>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">State:</Label>
            <span>{company?.state || "Not Specified"}</span>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Created At:</Label>
            <span>
              {company?.createdAt
                ? new Date(company.createdAt).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompanyCard;
