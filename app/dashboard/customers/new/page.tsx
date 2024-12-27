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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  notes: string;
  rating: number;
}

export default function AddCustomerPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>();
  const company = useCompany();
  const { user } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: CustomerFormData) => {
    const customerRef = company?.id;
    if (!customerRef || !user) {
      console.error("No company or user information available");
      return;
    }

    try {
      const customersRef = collection(
        db,
        "companies",
        customerRef,
        "customers"
      );
      await addDoc(customersRef, {
        ...data,
        createdAt: new Date(),
        createdBy: user.uid,
      });
      console.log("Customer added successfully");
      router.push("/dashboard/customers");
      reset();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-xl border-[var(--border)] bg-zinc-100 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-center">Add New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter customer name"
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
                placeholder="Enter customer email"
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
                placeholder="Enter customer phone"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter customer address"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("address")}
              />
            </div>

            {/* Organization */}
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Enter customer company"
                className="bg-white dark:bg-zinc-800 mt-1"
                {...register("organization")}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="bg-white dark:bg-zinc-800 mt-1"
                placeholder="Enter any additional notes"
                {...register("notes")}
              />
            </div>

            {/* Rating */}
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select
                onValueChange={(value) =>
                  register("rating").onChange({ target: { value } })
                }
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800 mt-1">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Rating</SelectItem>
                  <SelectItem value="1">⭐</SelectItem>
                  <SelectItem value="2">⭐⭐</SelectItem>
                  <SelectItem value="3">⭐⭐⭐</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" className="w-full mt-6">
                <CheckSquare className="mr-2 h-4 w-4" />
                Save Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
