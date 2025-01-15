"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext"; // Import the CompanyContext hook
import { createJob } from "@/firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Import your Firestore configuration
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BookPlus,
  CircleDollarSign,
  Clock,
  Hammer,
  UserPlus,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Customer {
  id: string;
  name: string;
}

const CreateJob = () => {
  const { user } = useAuth();
  const { id: companyId } = useCompany(); // Get the companyId from CompanyContext
  const router = useRouter();

  const [jobName, setJobName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [repeats, setRepeats] = useState("no");
  const [assignedEmployees, setAssignedEmployees] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [costs, setCosts] = useState("");
  const [charge, setCharge] = useState("");
  const [taxes, setTaxes] = useState("");
  const [expenses, setExpenses] = useState("");
  const [status, setStatus] = useState("active");
  const { toast } = useToast();

  // Fetch customers for the select
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!companyId) return;

      try {
        const customersRef = collection(
          db,
          "companies",
          companyId,
          "customers"
        );
        const snapshot = await getDocs(customersRef);
        const customerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Customer[];
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [companyId]);

  // Handle form submission
  const handleSaveJob = async () => {
    if (!jobName || !selectedCustomer || !startDate || !endDate) {
      alert(
        "Please fill out all required fields (Job Name, Customer, Start/End Dates)."
      );
      return;
    }

    if (!companyId) {
      alert("Company ID is missing. Please try again.");
      return;
    }

    const jobData = {
      jobName,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      repeats,
      assignedEmployees,
      selectedCustomer,
      selectedEquipment,
      costs: parseFloat(costs) || 0,
      charge: parseFloat(charge) || 0,
      taxes: parseFloat(taxes) || 0,
      expenses: parseFloat(expenses) || 0,
      status,
      createdBy: user?.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      const jobId = await createJob(companyId, jobData);
      console.log("Job created with ID:", jobId);
      toast({
        title: "Job Created Successfully!",
        description: "View your job on the jobs page",
        variant: "default",
      });
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="sm:py-4 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 lg:px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Add a new Job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below to create a new job.
          </p>
        </div>

        <Card className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md shadow-sm p-4 sm:p-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex py-2 marker:placeholder:*:flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <BookPlus className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Basic Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 mt-4">
            {/* Job Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Job Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                required
                className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <Textarea className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
            </div>

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Clock className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Date & Time
            </CardTitle>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  required
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-1/3"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  required
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-1/3"
                />
              </div>
            </div>

            <div className="flex justify-start space-x-10">
              {/* Repeats */}
              <div className="w-1/3">
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Frequency
                </label>
                <Select value={repeats} onValueChange={setRepeats}>
                  <SelectTrigger className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                    <SelectValue placeholder="Select repeat frequency" />
                  </SelectTrigger>
                  <SelectContent className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="w-1/3">
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                    <SelectValue placeholder="Select job status" />
                  </SelectTrigger>
                  <SelectContent className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                    <SelectItem value="active" className="cursor-pointer">
                      Active
                    </SelectItem>
                    <SelectItem value="pending" className="cursor-pointer">
                      Pending
                    </SelectItem>
                    <SelectItem value="completed" className="cursor-pointer">
                      Completed
                    </SelectItem>
                    <SelectItem value="inactive" className="cursor-pointer">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <UserPlus className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Assign Employees
            </CardTitle>
            {/* Assigned Employees */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select your employees for this job
              </label>
              <Input
                placeholder="e.g. Alice, Bob, Charlie"
                className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-1/2"
                value={assignedEmployees.join(", ")}
                onChange={(e) =>
                  setAssignedEmployees(
                    e.target.value
                      .split(",")
                      .map((emp) => emp.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <UserPlus className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Assign a Customer
            </CardTitle>
            {/* Customer Selection */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Customer <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={setSelectedCustomer}
                value={selectedCustomer}
              >
                <SelectTrigger className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-1/2">
                  <SelectValue placeholder="Select a Customer" />
                </SelectTrigger>
                <SelectContent className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id}
                      className="cursor-pointer"
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Hammer className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Choose Equipment
            </CardTitle>

            {/* Selected Equipment */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Selected Equipment (comma-separated)
              </label>
              <Input
                placeholder="e.g. Backhoe, Crane"
                value={selectedEquipment.join(", ")}
                className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-1/2"
                onChange={(e) =>
                  setSelectedEquipment(
                    e.target.value
                      .split(",")
                      .map((eq) => eq.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            {/* Costs, Charge, Taxes, Expenses */}

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <CircleDollarSign className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Financial
            </CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Costs
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 100.00"
                  value={costs}
                  onChange={(e) => setCosts(e.target.value)}
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Charge
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Taxes
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.00"
                  value={taxes}
                  onChange={(e) => setTaxes(e.target.value)}
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Expenses
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 25.00"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Save Job */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSaveJob}
                className="w-full sm:w-1/3"
                variant="default"
              >
                Save Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
