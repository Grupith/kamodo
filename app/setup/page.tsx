"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

function Setup() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      alert("Error trying to sign out");
    }
  };
  return (
    <ProtectedRoute>
      <nav>
        <button
          onClick={handleSignOut}
          className="bg-green-600 px-3 rounded-sm"
        >
          Sign Out
        </button>
      </nav>
      <h1 className="text-center">Setup page</h1>
    </ProtectedRoute>
  );
}

export default Setup;
