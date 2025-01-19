"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { createJob } from "@/firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
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
  CircleDollarSign,
  ClipboardPen,
  Clock,
  Hammer,
  UserPlus,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import type { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import StatusSelector from "@/components/StatusSelector";
import { MultiSelectField } from "@/components/MultiSelectField";

interface Customer {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  // Add other fields as necessary
}

const CreateJob = () => {
  const { user } = useAuth();
  const { id: companyId } = useCompany(); // Get the companyId from CompanyContext
  const router = useRouter();
  const { toast } = useToast();

  // State for form fields
  const [jobName, setJobName] = useState("");
  const [repeats, setRepeats] = useState("no");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [costs, setCosts] = useState("");
  const [charge, setCharge] = useState("");
  const [taxes, setTaxes] = useState("");
  const [expenses, setExpenses] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  // Set date range state for the job
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [totalDays, setTotalDays] = useState<number>(0);

  // Extract start/end from dateRange
  const startDate = dateRange?.from;
  const endDate = dateRange?.to;

  // Fetch Employees for the multi-select
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyId) {
        console.log("No companyId available, skipping fetch.");
        return;
      }

      try {
        console.log("Fetching employees for companyId:", companyId);
        const employeesRef = collection(
          db,
          "companies",
          companyId,
          "employees"
        );
        const snapshot = await getDocs(employeesRef);
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Employee[];

        console.log("Fetched employee list:", employeeList);
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [companyId]);

  // Log the updated state
  useEffect(() => {
    console.log("Updated employees in state:", employees);
  }, [employees]);

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

  // Calculate total days when dateRange changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Inclusive count of days
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;

      setTotalDays(days);
    } else {
      setTotalDays(0);
    }
  }, [dateRange]);

  // Handle form submission
  const handleSaveJob = async () => {
    if (!jobName || !selectedCustomers || !startDate || !endDate) {
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
      description,
      repeats,
      assignedEmployees: selectedEmployees,
      assignedCustomers: selectedCustomers,
      costs: parseFloat(costs) || 0,
      charge: parseFloat(charge) || 0,
      taxes: parseFloat(taxes) || 0,
      expenses: parseFloat(expenses) || 0,
      status,
      createdBy: user?.uid,
      createdAt: new Date().toISOString(),
      startDate: dateRange?.from ? dateRange.from.toISOString() : null,
      endDate: dateRange?.to ? dateRange.to.toISOString() : null,
      totalDays,
    };

    try {
      const jobId = await createJob(companyId, jobData);
      console.log(jobId, "Job created in database", jobData);
      toast({
        title: "Job Created Successfully!",
        description: "View your job on the jobs page",
        variant: "success",
      });
      router.push(`/dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  const employeeOptions = employees.map((employee) => ({
    value: employee.id, // or another unique identifier
    label: employee.name, // or any other field you'd like to display
  }));
  const customerOptions = customers.map((employee) => ({
    value: employee.id, // or another unique identifier
    label: employee.name, // or any other field you'd like to display
  }));

  return (
    <div className="sm:py-4 bg-background min-h-screen">
      <div className="max-w-4xl md:px-6">
        <div className="my-4">
          <h1 className="text-2xl font-bold tracking-tight">Create Job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below to create a new job.
          </p>
        </div>

        {/* Basic Information Section */}

        <Card className="mt-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md shadow-sm p-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex pb-2 marker:placeholder:*:flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
              <ClipboardPen className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
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
                className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
              />
            </div>
            {/* Date & Time Section */}
            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
              <Clock className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Date & Time
              <span className="text-sm text-muted-foreground dark:text-muted-foreground ml-2">
                ({totalDays} {totalDays === 1 ? "day" : "days"})
              </span>
            </CardTitle>
            {/* Date Range Picker */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Date Range <span className="text-red-500">*</span>
              </label>
              <DatePickerWithRange
                dateRange={dateRange}
                onDateChange={setDateRange}
                className="mt-2"
              />
            </div>
            <div className="flex justify-start space-x-10">
              {/* Repeats */}
              <div className="sm:w-1/6">
                <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Repeat
                </label>
                <Select value={repeats} onValueChange={setRepeats}>
                  <SelectTrigger className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800">
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
              <div className="w-2/5">
                <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Status
                </label>
                <StatusSelector
                  value={status}
                  onChange={(newStatus) => setStatus(newStatus)}
                />
              </div>
            </div>
            {/* Assigned Employees Section */}
            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
              <UserPlus className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Assign Employees
            </CardTitle>
            {/* Select Employees */}
            <div>
              <MultiSelectField
                label="Select Employees"
                description="Choose employees for the job."
                options={employeeOptions}
                value={selectedEmployees}
                onChange={setSelectedEmployees}
              />
            </div>
            {/* Display selected employees */}
            <div className="flex flex-wrap gap-2">
              {selectedEmployees.map((employeeId) => {
                const employee = employees.find((e) => e.id === employeeId);
                return (
                  <div
                    key={employeeId}
                    className="flex justify-center items-center border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 py-1 px-2 text-xs rounded-md"
                  >
                    {employee?.name}
                    <X
                      className="w-4 h-4 ml-1 cursor-pointer"
                      onClick={() =>
                        setSelectedEmployees((prev) =>
                          prev.filter((id) => id !== employeeId)
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Customer Section */}

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
              <UserPlus className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Assign a Customer
            </CardTitle>
            {/* Select customer for job */}
            <div>
              <MultiSelectField
                label="Select Customer"
                description="Choose customers for the job."
                options={customerOptions}
                value={selectedCustomers}
                onChange={setSelectedCustomers}
              />

              <div className="flex flex-wrap gap-2">
                {selectedCustomers.map((customerId) => {
                  const customer = customers.find((c) => c.id === customerId);
                  return (
                    <div
                      key={customerId}
                      className="flex justify-center items-center border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 py-1 px-2 mt-2 text-xs rounded-md"
                    >
                      {customer?.name}
                      <X
                        className="w-4 h-4 ml-1 cursor-pointer"
                        onClick={() =>
                          setSelectedCustomers((prev) =>
                            prev.filter((id) => id !== customerId)
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Equipment Section */}

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
              <Hammer className="w-5 h-5 mr-2 text-zinc-700 dark:text-zinc-300" />
              Choose Equipment
            </CardTitle>
            {/* Select equipment for job */}
            <p>{"(Coming-soon)"}</p>

            {/* Costs, Charge, Taxes, Expenses */}

            <CardTitle className="py-2 flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-400 dark:border-zinc-700">
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
                  className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
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
                  className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
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
                  className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
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
                  className="mt-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800"
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
