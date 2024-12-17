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
      className="max-w-lg mx-auto bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg rounded-lg p-6"
    >
      {/* Header */}
      <div className="mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {company?.name || "No Company Name Available"}
        </h2>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
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
            href={
              company?.website
                ? company.website.startsWith("http")
                  ? company.website
                  : `https://${company.website}`
                : "#"
            }
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
        {/* control panel */}
        <section className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-md p-4">
          <h3 className="font-semibold text-xl mb-2 text-gray-600 dark:text-gray-50">
            Control Panel
          </h3>
          <hr className="mb-4" />
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between space-x-2">
              <p className="text-gray-700 dark:text-gray-200">Notifications</p>
              <Switcher />
            </div>

            <div className="flex justify-between space-x-2">
              <p className="text-gray-700 dark:text-gray-200">
                Enable analytics.
              </p>
              <Switcher />
            </div>

            <div className="flex justify-between space-x-2">
              <p className="text-gray-700 dark:text-gray-200">
                Beta user feature
              </p>
              <Switcher />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
