import React from "react";
import { motion } from "framer-motion";

const JobProgressChart = () => {
  return (
    <>
      <motion.div className="md:col-span-2 w-full rounded-lg shadow-lg p-4 md:p-6 transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Job Progress
            </h5>
            <svg
              data-popover-target="chart-info"
              data-popover-placement="bottom"
              className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
            </svg>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* To Do */}
            <div className="bg-orange-100 dark:bg-gray-600 rounded-lg p-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-orange-200 dark:bg-gray-500 text-orange-600 dark:text-orange-300 flex items-center justify-center">
                12
              </div>
              <p className="mt-2 text-sm text-orange-600 dark:text-orange-300 font-medium">
                To Do
              </p>
            </div>
            {/* In Progress */}
            <div className="bg-teal-100 dark:bg-gray-600 rounded-lg p-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-200 dark:bg-gray-500 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                23
              </div>
              <p className="mt-2 text-sm text-teal-600 dark:text-teal-300 font-medium">
                In Progress
              </p>
            </div>
            {/* Done */}
            <div className="bg-blue-100 dark:bg-gray-600 rounded-lg p-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-200 dark:bg-gray-500 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                64
              </div>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-300 font-medium">
                Done
              </p>
            </div>
          </div>

          <button
            data-collapse-toggle="more-details"
            type="button"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 font-medium flex items-center"
          >
            Show more details
            <svg
              className="w-4 h-4 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l4 4 4-4"
              />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-gray-200 dark:border-gray-700 mt-5 flex justify-between">
          <button
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 flex items-center"
            type="button"
          >
            Last 7 days
            <svg
              className="w-3 h-3 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l4 4 4-4"
              />
            </svg>
          </button>
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 font-medium"
          >
            Progress Report
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default JobProgressChart;
