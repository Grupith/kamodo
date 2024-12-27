import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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
      <Card className="border border-[var(--border)] bg-card dark:bg-zinc-900 text-card-foreground">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {company?.name || "No Company Name Available"}
          </CardTitle>
          <CardDescription>
            {company?.businessType || "Business type not specified"}
          </CardDescription>
        </CardHeader>

        {/* Company Details */}
        <CardContent className="space-y-4">
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

          {/* Control Panel */}
          <div className="bg-outline p-4 rounded-md border border-[var(--border)] dark:bg-zinc-800">
            <h3 className="font-semibold text-lg mb-1">Control Panel</h3>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Notifications</Label>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">
                  Enable analytics
                </Label>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">
                  Beta user feature
                </Label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompanyCard;
