"use client";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import DashboardMockup from "../public/images/dashboard-mockup.svg";
import DashboardMockupDark from "../public/images/dashboard-mockup-dark.svg";
import DarkModeToggle from "./components/DarkModeToggle";

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
            <div className="text-2xl font-semibold cursor-pointer">Kamodo</div>
          </a>
          <div className="hidden md:flex space-x-6 font-medium items-center">
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#contact" className="hover:text-blue-600">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md hidden md:block">
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
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 dark:text-gray-100">
            Simplify Your Business with Kamodo
          </h1>
          <p className="text-xl md:text-2xl text-black mb-6 dark:text-gray-300">
            All-In-One Solution for Small Business Management
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg transition-all hover:shadow-md">
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

      {/* Features Section */}
      <section
        id="features"
        className="py-20 sm:mt-72 dark:bg-gray-900 dark:text-white"
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
    <h3 className="text-2xl font-semibold mb-4 text-blue-600">{plan} Plan</h3>
    <p className="text-4xl font-bold mb-6">{price}</p>
    <ul className="list-disc list-inside text-gray-900 space-y-2 mb-6 dark:text-gray-200">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
      Choose Plan
    </button>
  </div>
);

export default Home;
