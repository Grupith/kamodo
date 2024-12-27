"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchEmployeeById, deleteEmployeeById } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useModal } from "@/contexts/ModalContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  title?: string;
  employmentType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export default function EmployeeProfilePage() {
  const { employeeId } = useParams();
  const router = useRouter();
  const company = useCompany();
  const { openModal, closeModal } = useModal();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployee = async () => {
      try {
        if (employeeId && company?.id) {
          const data = await fetchEmployeeById(
            company.id,
            Array.isArray(employeeId) ? employeeId[0] : employeeId
          );
          setEmployee(data as Employee | null);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && company) {
      getEmployee();
    }
  }, [employeeId, company]);

  const handleDelete = () => {
    openModal(
      <>
        <p>
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                if (company?.id && employeeId) {
                  await deleteEmployeeById(
                    company.id,
                    Array.isArray(employeeId) ? employeeId[0] : employeeId
                  );
                  console.log("Employee deleted successfully");
                  closeModal();
                  router.push("/dashboard/employees");
                }
              } catch (error) {
                console.error("Failed to delete employee:", error);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </>,
      "Confirm Deletion"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-200 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="border dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src="/placeholder-avatar.png"
                  alt={employee.name}
                />
                <AvatarFallback>{employee.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {employee.title || "No Title"}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800"
            >
              Employee ID: {employee.id}
            </Badge>
          </CardContent>
        </Card>

        <Separator />

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card className="border dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Personal details of the employee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Email: {employee.email || "Not Available"}</p>
              <p>Phone: {employee.phone || "Not Available"}</p>
              <p>Birth Date: {employee.birthDate || "Not Available"}</p>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="border dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Position Details</CardTitle>
              <CardDescription>Role and employment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Title: {employee.title || "Not Available"}</p>
              <p>
                Employment Type: {employee.employmentType || "Not Available"}
              </p>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Details for emergency purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Contact Name: {employee.emergencyContactName || "Not Available"}
              </p>
              <p>
                Contact Phone:{" "}
                {employee.emergencyContactPhone || "Not Available"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Employees
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Employee
          </Button>
        </div>
      </div>
    </div>
  );
}
