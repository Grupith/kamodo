"use client";
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import DashboardMockup from "../public/images/dashboard-mockup.svg";
import DashboardMockupDark from "../public/images/dashboard-mockup-dark.svg";
import DarkModeToggle from "./components/DarkModeToggle";
import Checkmark from "./components/Checkmark";
import { motion } from "motion/react";
import Check from "../public/images/check.png";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-gray-50 text-black dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow fixed w-full z-10 dark:bg-gray-900 dark:text-white">
        <motion.nav
          initial={{ opacity: 0, y: 2 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto flex items-center justify-between md:justify-around py-3 px-6"
        >
          <a href="#">
            <div className="flex space-x-1 items-center">
              <Image alt="logo placeholder" src={Check} className="w-7 h-7" />
              <motion.div className="text-2xl font-bold">Kamodo</motion.div>
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
              <button className="bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition-all hover:shadow-xl hidden md:block hover:scale-105">
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
        </motion.nav>
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
                className="w-full bg-green-600 text-white px-4 py-2"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 bg-cover bg-center flex items-start pt-32 sm:mb-60 justify-center h-screen text-center shadow-sm dark:bg-gray-900 dark:text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-6 py-4 rounded-lg"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4 dark:text-gray-100">
            Organize Your Business with{" "}
            <span className="text-green-700 pt-4">Kamodo</span>
          </h1>
          <p className="text-xl md:text-2xl font-normal text-gray-600 mb-6 mt-4 dark:text-gray-400">
            Manage Customers, Employees, Jobs, and More—All in One Place
          </p>
          <button className="bg-green-700 text-white px-10 py-2.5 mb-10 shadow-lg rounded-md text-lg transition-all hover:shadow-xl hover:scale-105">
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
        </motion.div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-white sm:py-12 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-screen-xl px-10 pt-10 md:pt-32 pb-10 mt-10 mx-auto"
        >
          {/* Container for Flex Layout */}
          <div className="flex flex-col lg:flex-row items-start">
            {/* Left Side: Heading, Paragraph, and List */}
            <div className="w-full lg:w-2/3 lg:pr-8">
              <h2 className="text-4xl font-bold text-center lg:text-left mb-6 dark:text-gray-100">
                Why use Kamodo?
              </h2>
              <p className="max-w-2xl mb-6 text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
                Confused with other CRMS? Starting a Small Business? Let us do
                the hard work and manage your business with ease.
              </p>
              <ul className="max-w-xl space-y-4 text-gray-800 bg-gray-200 shadow-sm rounded-md p-4 py-6 text-lg list-inside dark:text-gray-300 dark:bg-gray-800">
                <li className="flex items-center">
                  <Checkmark />
                  Manage your customers
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Create and track jobs
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Add tasks for each job and monitor progress
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Manage your employees and assign them to jobs
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Track and assign equipment
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  Create and send out invoices for jobs
                </li>
              </ul>
            </div>

            {/* Right Side: Card */}
            <div className="w-full lg:w-1/3 lg:pl-8 mt-10 lg:mt-0">
              <div className="bg-gray-200 dark:bg-gray-800 shadow-sm rounded-md px-6 py-10">
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
        </motion.div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="py-10 sm:mt-2 dark:bg-gray-900 dark:text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-10"
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Items */}
            <FeatureItem
              Icon={UserGroupIcon}
              title="Customer Management"
              features={[
                "Store customer contact information",
                "View job history for each customer",
                "Add notes to customers profile",
              ]}
            />
            <FeatureItem
              Icon={BriefcaseIcon}
              title="Employee Management"
              features={[
                "Store employee information",
                "Track employee progress",
                "Adjust roles of employees",
              ]}
            />
            <FeatureItem
              Icon={CalendarIcon}
              title="Job Tracking"
              features={[
                "Create jobs with assigned dates",
                "Setup recurring jobs",
                "Assign employees to jobs",
                "Employees only view the jobs they are assigned to",
                "Track job status",
              ]}
            />
            <FeatureItem
              Icon={ClipboardDocumentListIcon}
              title="Job Task Assignment"
              features={[
                "Create tasks for employees to complete",
                "Get notifed when tasks completed",
                "Upload photos to tasks",
                "View task status",
              ]}
            />
            <FeatureItem
              Icon={Cog6ToothIcon}
              title="Equipment Management"
              features={[
                "Track all equipment",
                "Equipment page with history, info, etc.",
                "Assign equipment to jobs",
              ]}
            />
            <FeatureItem
              Icon={BellAlertIcon}
              title="Real-Time Updates"
              features={[
                "Sync job and task updates",
                "Push notifications for changes",
              ]}
            />
            <FeatureItem
              Icon={DevicePhoneMobileIcon}
              title="Mobile-First Design"
              features={[
                "Responsive design for mobile users",
                "Simple, clean UI",
              ]}
            />
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}

      <section
        id="pricing"
        className="bg-gray-100 pt-10 pb-20 dark:bg-gray-800 dark:text-gray-100"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Pricing Plans
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-start md:space-x-6 space-y-6 md:space-y-0">
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
        </motion.div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-gray-50 py-20 dark:bg-gray-900 dark:text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 max-w-screen-lg"
        >
          <h2 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400">
            Get in Touch
          </h2>
          <p className="text-center text-lg mb-12 text-gray-700 dark:text-gray-300">
            {`We'd love to hear from you! Fill out the form below and we'll get
            back to you shortly.`}
          </p>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 sm:p-12">
            <form className="space-y-8">
              {/* Name Field */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="absolute -top-3 left-3 text-sm bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="absolute -top-3 left-3 text-sm bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <label
                  htmlFor="message"
                  className=" absolute -top-3 left-3 text-sm bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-tr from-green-700 to-green-800 text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </motion.div>
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
  Icon: React.ElementType;
  title: string;
  features: string[];
}

const FeatureItem: React.FC<FeatureItemProps> = ({ Icon, title, features }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow dark:bg-gray-800 dark:text-white">
    <div className="mb-4">
      <Icon className="h-12 w-12 text-green-600" />
    </div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            {feature}
          </span>
        </li>
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
    <h3 className="text-2xl font-semibold mb-2 text-green-700">{plan} Plan</h3>
    <p className="text-3xl font-bold mb-2">{price}</p>
    <hr />
    <ul className=" text-gray-900  dark:text-gray-400 space-y-4 py-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Checkmark />
          <span className="text-gray-900 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <button className="bg-green-700 text-white px-4 py-2 shadow-sm rounded-md w-full">
      Choose Plan
    </button>
  </div>
);

export default Home;
