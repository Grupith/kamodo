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

  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { href: string; label: string }[]
  >([]);

  // 1. Always render children + a fallback breadcrumb first
  // 2. Then fetch the real breadcrumb data in an effect
  useEffect(() => {
    let isMounted = true;

    const getBreadcrumbItems = async () => {
      const paths = pathname.split("/").filter(Boolean);
      const items = await Promise.all(
        paths.map(async (path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          let label = path.charAt(0).toUpperCase() + path.slice(1);

          // For job routes
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* 
              1. If breadcrumbItems is empty, 
                 show some placeholder or skeleton. 
              2. Otherwise, render the real breadcrumb. 
            */}
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
        {/* Children render immediately, even if breadcrumb fetch is still in progress */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
