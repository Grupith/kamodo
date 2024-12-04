"use client";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import DashboardMockup from "../public/images/dashboard-mockup.svg";
import DashboardMockupDark from "../public/images/dashboard-mockup-dark.svg";
import DarkModeToggle from "./components/DarkModeToggle";
import Checkmark from "./components/Checkmark";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gray-50 text-black dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow fixed w-full z-10 dark:bg-gray-900 dark:text-white">
        <nav className="container mx-auto flex items-center justify-between md:justify-around py-3 px-6">
          <a href="#">
            <div className="flex align-middle space-x-1">
              {/* Logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xl font-semibold">Kamodo</div>
            </div>
          </a>
          <div className="hidden md:flex space-x-6 font-medium items-center">
            <a href="#about" className="hover:text-green-600 transition-all">
              About
            </a>
            <a href="#features" className="hover:text-green-600 transition-all">
              Features
            </a>
            <a href="#pricing" className="hover:text-green-600 transition-all">
              Pricing
            </a>
            <a href="#contact" className="hover:text-green-600 transition-all">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button className="bg-green-700 text-white px-6 py-2 rounded-md shadow-lg transition-all hover:shadow-xl hidden md:block hover:scale-105">
                Sign In
              </button>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800 focus:outline-none dark:text-gray-100"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg dark:bg-gray-900">
            <a
              href="#about"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              About
            </a>
            <a
              href="#features"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Pricing
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Contact
            </a>
            <div>
              <button
                onClick={closeMenu}
                className="w-full bg-blue-600 text-white px-4 py-2"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 bg-cover bg-center flex items-start pt-32 sm:mb-60 justify-center h-screen text-center shadow-sm dark:bg-gray-900 dark:text-white">
        <div className="p-6 py-4 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4 dark:text-gray-100">
            Simplify Your Business with{" "}
            <span className="text-green-700 pt-4">Kamodo</span>
          </h1>
          <p className="text-xl md:text-2xl font-normal text-gray-600 mb-6 mt-4 dark:text-gray-400">
            Manage Customers, Employees, Jobs, and More—All in One Place
          </p>
          <button className="bg-green-700 text-white px-6 py-3 mb-10 shadow-lg rounded-md text-lg transition-all hover:shadow-xl hover:scale-105">
            Get Started for Free
          </button>
          <Image
            src={DashboardMockup}
            alt={"Dashboard mockup light"}
            className="my-10 shadow-md rounded-lg dark:shadow-none dark:hidden"
          />
          <Image
            src={DashboardMockupDark}
            alt={"Dashboard mockup dark"}
            className="my-10 shadow-md rounded-lg hidden dark:shadow-md dark:block"
          />
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-white sm:py-20 dark:bg-gray-900">
        <div className="max-w-screen-xl px-20 pt-10 md:pt-32 pb-10 mt-10 mx-auto">
          {/* Container for Flex Layout */}
          <div className="flex flex-col lg:flex-row items-start">
            {/* Left Side: Heading, Paragraph, and List */}
            <div className="w-full lg:w-2/3 lg:pr-8">
              <h2 className="text-4xl font-bold text-center lg:text-left mb-6 dark:text-gray-100">
                Why use Kamodo?
              </h2>
              <p className="max-w-2xl mb-6 text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
                Disorganized? Starting a Small Business? Let us do the hard work
                and manage your business within one app.
              </p>
              <ul className="max-w-2xl space-y-4 text-gray-800 text-lg list-inside dark:text-gray-300">
                <li className="flex items-center">
                  <Checkmark />
                  Manage Your Customers
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Create and Track Jobs
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Add Tasks for Each Job and Monitor Progress
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Manage Your Employees and Assign Them To Jobs
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Track and Assign Equipment
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Create Invoices for Jobs
                </li>
              </ul>
            </div>

            {/* Right Side: Card */}
            <div className="w-full lg:w-1/3 lg:pl-8 mt-10 lg:mt-0">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-md px-6 py-10">
                <p className="text-gray-900 mb-4 font-semibold md:text-xl lg:text-xl dark:text-gray-200">
                  The Benefit
                </p>
                <p className="text-gray-800 font-normal md:text-md lg:text-md dark:text-gray-400">
                  Employees waiting on a text for a customers address? Save time
                  and assign them to your job with ready to go tasks to
                  complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="py-10 sm:mt-2 dark:bg-gray-900 dark:text-white"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature Items */}
            <FeatureItem
              icon="👥"
              title="Customer Management"
              features={[
                "Store customer contact information",
                "View job history for each customer",
              ]}
            />
            <FeatureItem
              icon="👨‍💼"
              title="Employee Management"
              features={[
                "Store employee information",
                "Adjust roles of employees",
              ]}
            />
            <FeatureItem
              icon="🗓️"
              title="Job Tracking"
              features={[
                "Create jobs with assigned dates",
                "Assign jobs to employees",
                "Track job status",
                "Create recurring jobs",
              ]}
            />
            <FeatureItem
              icon="📝"
              title="Job Task Assignment"
              features={[
                "Assign tasks to employees",
                "Upload photos to tasks",
                "View task status",
              ]}
            />
            <FeatureItem
              icon="⚙️"
              title="Equipment Management"
              features={[
                "Track all equipment",
                "Adjust equipment data",
                "Assign equipment to jobs",
              ]}
            />
            <FeatureItem
              icon="🔔"
              title="Real-Time Updates"
              features={[
                "Sync job and task updates",
                "Push notifications for changes",
              ]}
            />
            <FeatureItem
              icon="📱"
              title="Mobile-First Design"
              features={[
                "Responsive design for mobile users",
                "Simple, clean UI",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-gray-100 py-20 dark:bg-gray-800 dark:text-gray-100"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Pricing Plans
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-6 space-y-6 md:space-y-0">
            {/* Pricing Cards */}
            <PricingCard
              plan="Free"
              price="Free"
              features={[
                "Up to 2 employees",
                "10 customers",
                "5 jobs limit",
                "10 tasks per job",
                "No file uploads",
              ]}
            />
            <PricingCard
              plan="Pro"
              price="$29/month"
              features={[
                "Up to 5 employees",
                "Unlimited customers",
                "Unlimited jobs",
                "Unlimited tasks",
                "Upload images/files",
                "Equipment tracking",
              ]}
            />
            <PricingCard
              plan="Premium"
              price="$79/month"
              features={[
                "Up to 25 employees",
                "All Pro features",
                "Sync with Google/Outlook",
                "Quotes/invoicing tracking",
                "Income/expenses tracking",
                "Dedicated email support",
              ]}
            />
            <PricingCard
              plan="Enterprise"
              price="$299/month"
              features={[
                "Unlimited employees",
                "All Premium features",
                "Customer payments via Stripe",
                "White-label branding",
                "Priority support",
                "Onboarding assistance",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-100">
            © {new Date().getFullYear()} Kamodo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  features: string[];
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, features }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <ul className="list-disc list-inside text-black dark:text-gray-200 space-y-2">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
);

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features }) => (
  <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow w-full md:w-1/4 dark:bg-gray-900">
    <h3 className="text-2xl font-semibold mb-4 text-green-700">{plan} Plan</h3>
    <p className="text-4xl font-bold mb-6">{price}</p>
    <ul className=" text-gray-900  dark:text-gray-200 space-y-4 py-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Checkmark />
          <span className="text-gray-900 dark:text-gray-200">{feature}</span>
        </li>
      ))}
    </ul>
    <button className="bg-green-700 text-white px-4 py-2 rounded-md w-full">
      Choose Plan
    </button>
  </div>
);

export default Home;
