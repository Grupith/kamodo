import { motion } from "framer-motion";
import Switcher from "./Switcher";

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
      className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
    >
      {/* Header */}
      <div className="mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {company?.name || "No Company Name Available"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {company?.businessType || "Business type not specified"}
        </p>
      </div>

      {/* Company Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Number of Employees:
          </span>
          <span className="text-gray-800 dark:text-white">
            {company?.numberOfEmployees ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Website:
          </span>
          <a
            href={company?.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {company?.website || "Not Provided"}
          </a>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            State:
          </span>
          <span className="text-gray-800 dark:text-white">
            {company?.state || "Not Specified"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Created At:
          </span>
          <span className="text-gray-800 dark:text-white">
            {company?.createdAt
              ? new Date(company.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
        </div>
        <Switcher />
      </div>
    </motion.div>
  );
};

export default CompanyCard;
