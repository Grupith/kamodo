"use client";
import React, { useEffect, useState } from "react";
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
import DarkModeToggle from "../components/DarkModeToggle";
import Checkmark from "../components/Checkmark";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { handleGoogleLogin, signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Kamodo from "../public/images/kamodo.png";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (user) {
      console.log(
        `${user.displayName} already is logged in, navigate to dashboard...`
      );
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLoginClick = async () => {
    await handleGoogleLogin({
      onLoginSuccess: (newUser, companyId) => {
        if (newUser || !companyId) {
          router.push("/setup"); // Redirect to setup page for new users
        } else {
          router.push("/dashboard"); // Redirect to dashboard for existing users
        }
      },
      onError: (message) => {
        console.error("Login error:", message);
        alert("Failed to log in: " + message); // Optional: Show error alert
      },
    });
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.log("Error trying to sign out", error);
    }
  };

  // Variants for Framer Motion
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <div className="bg-gray-50 text-black dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 dark:text-white fixed w-full z-10 shadow-sm">
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="container mx-auto flex items-center justify-between md:justify-around py-3 px-6"
          >
            <Link href="#">
              <div className="flex space-x-1 items-center cursor-pointer">
                <div className="flex justify-center ">
                  <Image
                    src={Kamodo}
                    alt="Kamodo Logo"
                    width={150}
                    height={150}
                    priority={true}
                    className="dark:invert w-10 h-10 mr-1 rounded-lg" // Inverts colors in dark mode if needed
                  />
                </div>
                <div className="text-2xl font-bold">Kamodo</div>
              </div>
            </Link>
            <div className="hidden md:flex space-x-6 font-medium items-center">
              <a href="#about" className="hover:text-green-600 transition-all">
                About
              </a>
              <a
                href="#features"
                className="hover:text-green-600 transition-all"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-green-600 transition-all"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="hover:text-green-600 transition-all"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <DarkModeToggle />
                {!user ? (
                  <button
                    onClick={handleLoginClick}
                    className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-2 rounded-md shadow-md transition-transform hover:shadow-xl hidden md:block hover:scale-105"
                  >
                    Login
                  </button>
                ) : (
                  <Link href="/dashboard">
                    <button className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-2 rounded-md shadow-md transition-transform hover:shadow-xl hidden md:block hover:scale-105">
                      Go to Dashboard
                    </button>
                  </Link>
                )}
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
            <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
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
                {!user ? (
                  <button
                    onClick={() => {
                      handleLoginClick();
                      closeMenu();
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="flex items-start pt-32 justify-center h-screen text-center dark:text-white bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUpVariants}
            viewport={{ once: true }}
            className="p-6 py-4 rounded-lg max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-gray-100 mb-4">
              Organize Your Business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400">
                Kamodo
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-normal text-gray-600 mb-8 mt-4 dark:text-gray-300">
              Manage Customers, Employees, Jobs, and More—All in One Place
            </p>
            <Link href="/login">
              <button className="bg-green-600 dark:bg-green-800 text-white px-10 py-4 mb-10 shadow-lg rounded-md text-lg transition-transform hover:shadow-xl hover:scale-105">
                Get Started for Free
              </button>
            </Link>
            <div className="flex justify-center">
              <Image
                src={DashboardMockup}
                alt="Dashboard Preview"
                width={550}
                height={550}
                priority={true}
                fetchPriority="high"
                className="my-10 shadow-md rounded-md dark:hidden"
              />
              <Image
                src={DashboardMockupDark}
                alt="Dashboard Preview"
                width={550}
                height={550}
                priority={true}
                fetchPriority="high"
                className="my-10 shadow-md rounded-md hidden dark:block"
              />
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-white sm:py-12 dark:bg-gray-900">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUpVariants}
            viewport={{ once: true }}
            className="max-w-screen-xl px-10 pt-32 pb-10 mt-2 mx-auto"
          >
            <div className="flex flex-col lg:flex-row items-start">
              {/* Left Side */}
              <div className="w-full lg:w-2/3 lg:pr-8">
                <h2 className="text-4xl font-bold text-center lg:text-left mb-6 dark:text-gray-100">
                  Easy Small Business Management
                </h2>
                <p className="max-w-2xl text-center md:text-start font-normal mb-8 py-3 text-gray-900 md:text-lg dark:text-gray-200">
                  Overwhelmed by CRMs? Kamodo makes business management simple
                  and stress-free.
                </p>
                <ul className="max-w-xl space-y-4 text-gray-800 bg-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-6 text-lg list-inside dark:text-gray-300 dark:bg-gray-800">
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

              {/* Right Side */}
              <div className="w-full lg:w-1/3 lg:pl-8 mt-10 lg:mt-0">
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md px-6 py-10">
                  <p className="text-gray-900 mb-4 font-semibold md:text-xl lg:text-xl dark:text-gray-200">
                    Why Choose Kamodo?
                  </p>
                  <p className="text-gray-800 font-normal md:text-md lg:text-md dark:text-gray-400">
                    Eliminate confusion and save time. Assign employees to jobs
                    with clear tasks and keep your business running smoothly—no
                    delays, no guesswork.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-10 dark:bg-gray-900 dark:text-white scroll-mt-16"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUpVariants}
            viewport={{ once: true }}
            className="container mx-auto px-10"
          >
            <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  "Equipment info and history",
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
                features={["Responsive for all devices", "Clean and simple UI"]}
              />
            </div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="bg-gray-100 pb-10 px-4 lg:px-0 md:mx-0 dark:bg-gray-800 dark:text-gray-100 scroll-mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="container mx-auto px-6"
          >
            <h2 className="text-4xl font-bold text-center py-12">
              Pricing Plans
            </h2>
            {/* Instead of multiple flex wrappers, use a grid */}
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
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gray-50 py-20 dark:bg-gray-900">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUpVariants}
            viewport={{ once: true }}
            className="container mx-auto px-6 max-w-screen-lg"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">
              Get in Touch
            </h2>
            <p className="text-center text-lg mb-12 text-gray-600 dark:text-gray-400">
              We’d love to hear from you. Fill out the form below, and we’ll get
              back to you as soon as possible.
            </p>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-6 md:p-10">
              <form className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-md font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="mt-1 p-3 block w-full rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="mt-1 p-3 block w-full rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="blocktext-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Your Message"
                    required
                    className="mt-1 p-3 block w-full rounded-lg border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-green-500 focus:border-green-500 sm:text-sm resize-none"
                  ></textarea>
                </div>
                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-block px-6 py-3 font-medium text-white bg-gradient-to-r from-green-500 to-teal-400 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transform transition-all focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
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
    </>
  );
};

interface FeatureItemProps {
  Icon: React.ElementType;
  title: string;
  features: string[];
}

const FeatureItem: React.FC<FeatureItemProps> = ({ Icon, title, features }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="bg-white border border-gray-200 dark:border-gray-700 p-6 rounded-md shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] dark:bg-gray-800 dark:text-white"
  >
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
  </motion.div>
);

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
  bio: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  features,
  bio,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="flex flex-col bg-white p-8 rounded-md shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] border dark:border-gray-700/95 dark:bg-gray-900 h-full"
  >
    {/* Inner container to manage spacing and alignment */}
    <div className="flex flex-col flex-grow">
      <h3 className="text-4xl text-center font-medium mb-2 text-black dark:text-white">
        {plan}
      </h3>
      <p className="text-md text-center py-2 pb-6 text-gray-800 dark:text-gray-300">
        {bio}
      </p>
      <p className="text-5xl text-center font-bold mb-1 text-black dark:text-white">
        {price}
        <span className="text-lg font-normal text-gray-600 dark:text-gray-500">
          /month
        </span>
      </p>
      <ul className="text-gray-900 dark:text-gray-400 space-y-4 py-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Checkmark />
            <span className="text-gray-900 dark:text-gray-300 ml-2">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
    {/* Button at the bottom */}
    <button className="mt-auto bg-green-600 dark:bg-green-800 text-white px-4 py-2 shadow-sm rounded-md w-full transition-transform hover:shadow-md hover:scale-105">
      Choose Plan
    </button>
  </motion.div>
);

export default LandingPage;
