"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { fetchEquipmentById, deleteEquipmentById } from "@/firebase/firestore";
import { useCompany } from "@/contexts/CompanyContext";
import { useModal } from "@/contexts/ModalContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Equipment {
  id: string;
  name: string;
  type?: string;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  notes?: string;
  status?: string;
}

export default function EquipmentProfilePage() {
  const { equipmentId } = useParams();
  const router = useRouter();
  const company = useCompany();
  const { openModal, closeModal } = useModal();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEquipment = async () => {
      try {
        if (equipmentId && company?.id) {
          const data = await fetchEquipmentById(
            company.id,
            Array.isArray(equipmentId) ? equipmentId[0] : equipmentId
          );
          setEquipment(data as Equipment | null);
        }
      } catch (error) {
        console.error("Failed to fetch equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId && company) {
      getEquipment();
    }
  }, [equipmentId, company]);

  const handleDelete = () => {
    openModal(
      <>
        <p>
          Are you sure you want to delete this equipment? This action cannot be
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
                if (company?.id && equipmentId) {
                  await deleteEquipmentById(
                    company.id,
                    Array.isArray(equipmentId) ? equipmentId[0] : equipmentId
                  );
                  console.log("Equipment deleted successfully");
                  closeModal();
                  router.push("/dashboard/equipment");
                }
              } catch (error) {
                console.error("Failed to delete equipment:", error);
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
        <Skeleton className="w-1/2 h-10" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Equipment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-md border bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {equipment.name}
            </CardTitle>
            <CardDescription>{equipment.type || "N/A"}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Badge className="bg-secondary text-secondary-foreground">
              Serial: {equipment.serialNumber || "N/A"}
            </Badge>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-md">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Location:</strong> {equipment.location || "N/A"}
              </p>
              <p>
                <strong>Purchase Date:</strong>{" "}
                {equipment.purchaseDate || "N/A"}
              </p>
              <p>
                <strong>Warranty Expiration:</strong>{" "}
                {equipment.warrantyExpiration || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {equipment.status || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-md">
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Location" defaultValue={equipment.location} />
              <Input placeholder="Status" defaultValue={equipment.status} />
              <Input
                placeholder="Warranty Expiration"
                defaultValue={equipment.warrantyExpiration}
              />
            </CardContent>
          </Card>

          <Card className="bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-md">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this equipment..."
                defaultValue={equipment.notes}
              />
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Equipment
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
