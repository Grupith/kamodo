"use client";
import React from "react";
import { motion } from "framer-motion";

const PricingPage = () => {
  interface PricingCardProps {
    plan: string;
    bio: string;
    price: string;
    features: string[];
  }

  const PricingCard: React.FC<PricingCardProps> = ({
    plan,
    bio,
    price,
    features,
  }) => (
    <div className="flex flex-col justify-between bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
      <div>
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
          {plan}
        </h3>
        <p className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-300">
          {bio}
        </p>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-base lg:text-lg text-gray-600 dark:text-gray-300 ml-1">
            /mo
          </span>
        </div>
        <ul className="mt-6 space-y-2">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center text-sm lg:text-base text-gray-700 dark:text-gray-200"
            >
              <svg
                className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293l-8.997 8.997a1 1 0 01-1.414 0L3.293 10.59a1 1 0 111.414-1.414l3.585 3.585 8.297-8.297a1 1 0 011.414 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <a
          href="#"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
        >
          Get Started
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Heading */}
      <header className="py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-bold tracking-tight"
        >
          Pricing
        </motion.h1>
      </header>

      {/* Pricing Cards */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-stretch">
            <PricingCard
              plan="Free"
              bio="Essential tools to keep your business on track—for free."
              price="$0"
              features={[
                "Up to 3 employees",
                "20 customers",
                "20 jobs limit",
                "20 tasks per job",
              ]}
            />
            <PricingCard
              plan="Starter"
              bio="Upgrade to the essentials and take control of your business operations."
              price="$29"
              features={[
                "Up to 6 employees",
                "Unlimited customers",
                "Unlimited jobs",
                "Unlimited tasks",
                "Upload images/files",
                "Equipment tracking",
                "In-app messaging",
              ]}
            />
            <PricingCard
              plan="Pro"
              bio="Powerful financial tools to manage invoices, quotes, and track growth with ease."
              price="$99"
              features={[
                "Up to 30 employees",
                "All Starter features",
                "Sync with Google/Outlook",
                "Quotes/invoicing tracking",
                "Income/expenses tracking",
                "Dedicated email support",
              ]}
            />
            <PricingCard
              plan="Enterprise"
              bio="Designed for larger organizations needing advanced tools and premium care."
              price="$399"
              features={[
                "Unlimited employees",
                "All Pro features",
                "Customer payments via Stripe",
                "White-label branding",
                "Priority support",
                "Onboarding assistance",
              ]}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PricingPage;
