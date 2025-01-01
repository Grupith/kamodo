"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <div className="py-10 sm:py-16 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8">
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="user"
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full"
                      priority
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user?.displayName || "No User Name Available"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "Email not specified"}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">
                    Phone Number
                  </span>
                  <span>{user?.phoneNumber ?? "N/A"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">
                    Address
                  </span>
                  <span>Not Provided</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">
                    Joined At
                  </span>
                  <span>Unknown</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Security Settings Card */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Password</span>
                <Button variant="link" className="text-sm">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Two-factor Auth</span>
                <Button variant="link" className="text-sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Checkbox
                id="email-notifications"
                defaultChecked
                aria-label="Email Notifications"
              />
              <Checkbox id="sms-notifications" aria-label="SMS Notifications" />
              <Checkbox
                id="push-notifications"
                defaultChecked
                aria-label="Browser Push Notifications"
              />
            </CardContent>
          </Card>

          {/* Privacy Settings Card */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Review and adjust your privacy preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Profile Visibility</span>
                <Button variant="link" className="text-sm">
                  Edit
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Search Visibility</span>
                <Button variant="link" className="text-sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card className="bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Access advanced account actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">
                Deactivate Account
              </Button>
              <Button variant="outline" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountSettings;
