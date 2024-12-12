import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

const alertStyles = {
  success:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400 dark:border-green-700",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-400 dark:border-red-700",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-400 dark:border-yellow-700",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-400 dark:border-blue-700",
};

const alertIcons = {
  success: <CheckCircleIcon className="w-6 h-6" />,
  danger: <ExclamationCircleIcon className="w-6 h-6" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6" />,
  info: <InformationCircleIcon className="w-6 h-6" />,
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`flex items-center justify-between p-4 rounded-md shadow-lg border space-x-4 text-sm ${alertStyles[type]}`}
    role="alert"
  >
    {/* Icon */}
    <div>{alertIcons[type]}</div>

    {/* Message */}
    <div className="flex-grow">{message}</div>

    {/* Close Button */}
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
    >
      <XMarkIcon className="w-5 h-5" />
    </button>
  </motion.div>
);

export default Alert;
