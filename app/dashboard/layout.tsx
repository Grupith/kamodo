"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { fetchJobDetails } from "@/utils/fetchJobDetails";
import { useCompany } from "@/contexts/CompanyContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { id: companyId } = useCompany();

  // State for breadcrumbs
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { href: string; label: string }[]
  >([]);

  // State to track whether the sidebar is expanded or collapsed
  const [defaultOpen, setDefaultOpen] = useState<boolean | null>(null);

  // Fetch breadcrumb items
  useEffect(() => {
    let isMounted = true;

    const getBreadcrumbItems = async () => {
      const paths = pathname.split("/").filter(Boolean);
      const items = await Promise.all(
        paths.map(async (path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          let label = path.charAt(0).toUpperCase() + path.slice(1);

          // Handle dynamic route for job details
          if (index > 0 && paths[index - 1] === "jobs" && companyId) {
            try {
              const jobId = paths[index];
              const jobData = await fetchJobDetails(companyId, jobId);
              label = jobData?.jobName || label;
            } catch (error) {
              console.error("Error fetching job details:", error);
            }
          }

          return { href, label };
        })
      );
      if (isMounted) setBreadcrumbItems(items);
    };

    getBreadcrumbItems();
    return () => {
      isMounted = false;
    };
  }, [pathname, companyId]);

  // Read sidebar state from cookies after the component mounts
  useEffect(() => {
    if (typeof document === "undefined") return;

    const match = document.cookie.match(/sidebar:state=(true|false)/);
    const openState = match ? match[1] === "true" : true; // Default to open if no cookie
    setDefaultOpen(openState);
  }, []);

  // Render nothing until the defaultOpen state is determined
  if (defaultOpen === null) {
    return null; // Optional: Render a skeleton or loading state
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.length === 0 ? (
                  <BreadcrumbPage>Loading...</BreadcrumbPage>
                ) : (
                  breadcrumbItems.map((item, index) => (
                    <React.Fragment key={item.href}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbItems.length - 1 ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href}>
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
