"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext"; // Import your custom AuthContext
import { db } from "@/firebase/firebase"; // Import your Firestore instance
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Users,
  Briefcase,
  PenTool,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Placeholder data for teams and navigation links
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: Briefcase,
    },
    {
      title: "Equipment",
      url: "/dashboard/equipment",
      icon: PenTool,
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: PenTool,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth(); // Access the user and loading state
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreUser = userDocSnap.data();
            const newUserData = {
              name: firestoreUser.name || user.displayName || "Anonymous",
              email: firestoreUser.email || user.email || "No email",
              avatar:
                firestoreUser.avatar || user.photoURL || "/default-avatar.png",
            };
            if (
              JSON.stringify(newUserData) !== JSON.stringify(userData) // Avoid unnecessary updates
            ) {
              setUserData(newUserData);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (!loading) {
      fetchUser();
    }
  }, [user, loading, userData]);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border border-[var(--border) dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData ? (
          <NavUser
            user={{
              displayName: userData.name,
              email: userData.email,
              avatar: userData.avatar || "",
            }}
          />
        ) : (
          <div className="flex justify-center items-center animate-pulse">
            <p>Loading user data...</p>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
