import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PenTool as Tool,
  ClipboardList,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
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
    icon: Tool,
  },
  {
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: ClipboardList,
  },
];

export function NavMain() {
  const { isMobile, setOpenMobile } = useSidebar(); // Access sidebar context

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false); // Close sidebar on mobile
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url} passHref>
              <SidebarMenuButton tooltip={item.title} onClick={handleNavClick}>
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
