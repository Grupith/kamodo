"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  title: string;
  employmentType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export default function AddEmployeePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>();
  const company = useCompany();
  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: EmployeeFormData) => {
    const companyRef = company?.id;
    if (!companyRef || !user) {
      console.error("No company or user information available");
      return;
    }

    const sanitizedData = {
      ...data,
      employmentType: data.employmentType || "Not Specified",
      createdAt: new Date(),
      createdBy: user.uid,
    };

    console.log("Submitting Employee Data:", sanitizedData);

    try {
      const employeesRef = collection(db, "companies", companyRef, "employees");
      await addDoc(employeesRef, sanitizedData);
      console.log("Employee added successfully");
      router.push("/dashboard/employees");
      reset();
    } catch (error) {
      console.error("Error adding Employee:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-xl border-[var(--border)] bg-zinc-100 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-center">Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter employee name"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter employee email"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter employee phone"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("birthDate", {
                  required: "Birth date is required",
                })}
              />
              {errors.birthDate && (
                <p className="text-destructive text-sm mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter employee title"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("title")}
              />
            </div>

            {/* Employment Type */}
            <div>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                onValueChange={(value) =>
                  register("employmentType").onChange({ target: { value } })
                }
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800 mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emergency Contact Name */}
            <div>
              <Label htmlFor="emergencyContactName">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                placeholder="Enter emergency contact name"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("emergencyContactName")}
              />
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="Enter emergency contact phone"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("emergencyContactPhone")}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" className="w-full mt-6">
                <CheckSquare className="mr-2 h-4 w-4" />
                Save Employee
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
