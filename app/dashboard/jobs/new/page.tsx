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
      alert(`Job created successfully with ID: ${jobId}`);
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below to create a new job.
          </p>
        </div>

        <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Job Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                required
              />
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Repeats */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Repeats
              </label>
              <Select value={repeats} onValueChange={setRepeats}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Employees (comma-separated) */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Assigned Employees (comma-separated)
              </label>
              <Input
                placeholder="e.g. Alice, Bob, Charlie"
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

            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Customer <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => setSelectedCustomer(value)}
                value={selectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Equipment (comma-separated) */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Selected Equipment (comma-separated)
              </label>
              <Input
                placeholder="e.g. Backhoe, Crane"
                value={selectedEquipment.join(", ")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Costs */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Costs
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 100.00"
                  value={costs}
                  onChange={(e) => setCosts(e.target.value)}
                />
              </div>

              {/* Charge */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Charge
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                />
              </div>

              {/* Taxes */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Taxes
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15.00"
                  value={taxes}
                  onChange={(e) => setTaxes(e.target.value)}
                />
              </div>

              {/* Expenses */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Expenses
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 25.00"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Job */}
            <Button onClick={handleSaveJob} className="w-full">
              Save Job
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
