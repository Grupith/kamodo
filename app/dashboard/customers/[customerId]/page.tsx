"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchCustomerById, deleteCustomerById } from "@/firebase/firestore"; // Update paths
import { useCompany } from "@/contexts/CompanyContext";
import { useModal } from "@/contexts/ModalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  accountCreation?: string;
  notes?: string;
  orders?: number;
  totalSpent?: number;
}

export default function CustomerProfilePage() {
  const { customerId: id } = useParams();
  const company = useCompany();
  const { openModal, closeModal } = useModal();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (id && company?.id) {
        console.log("Fetching customer with:", {
          companyId: company.id,
          customerId: id,
        });
        try {
          const customerData = await fetchCustomerById(
            company.id as string,
            id as string
          );
          console.log("Fetched customer data:", customerData);
          setCustomer(customerData as Customer);
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [id, company?.id]);

  const handleDelete = () => {
    openModal(
      <>
        <p>
          Are you sure you want to delete this customer? This action cannot be
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
                if (company?.id && id) {
                  await deleteCustomerById(company.id, id as string);
                  closeModal();
                  router.push("/dashboard/customers");
                  console.log("Customer deleted successfully");
                }
              } catch (error) {
                console.error("Failed to delete customer:", error);
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
        <p>Loading customer data...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 shadow-md">
          <CardContent className="flex justify-between items-center w-full py-2 sm:py-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src="/placeholder-avatar.png"
                  alt={customer.name}
                />
                <AvatarFallback>{customer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <p className="text-muted-foreground">
                  {customer.company || "No Company"}
                </p>
              </div>
            </div>

            {/* Badge */}
            <Badge variant="outline">Customer ID: {customer.id}</Badge>
          </CardContent>
        </Card>

        <Separator />

        {/* Customer Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 shadow-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {customer.email || "N/A"}</p>
              <p>Phone: {customer.phone || "N/A"}</p>
              <p>Address: {customer.address || "N/A"}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 shadow-md">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Account Created: {customer.accountCreation || "N/A"}</p>
              <p>Orders: {customer.orders || 0}</p>
              <p>Total Spent: ${customer.totalSpent?.toFixed(2) || "0.00"}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800 shadow-md">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{customer.notes || "No additional notes."}</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Customer
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
