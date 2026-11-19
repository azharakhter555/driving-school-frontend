// components/navigation/sidebar/Sidebar.tsx

"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { SidebarItem } from "./SidebarItem";
import { SidebarToggle } from "@/components/shared/SidebarToggle";
// import { NavLink } from "@/components/shared/NavLink";
// // import { UserProfile } from "@/components/shared/UserProfile";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { getNavigationByRole, type UserRole } from "@/config/navigation"; // 👈 Import the function
// import { Settings, HelpCircle } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  userRole?: string;
}

export function Sidebar({ className, userRole = "student" }: SidebarProps) {
  const { open, toggle } = useSidebar();
  
  // 👇 USE THE FUNCTION HERE
  const validRoles: UserRole[] = ["admin", "instructor", "student"];
  const role = validRoles.includes(userRole as UserRole) ? userRole as UserRole : "student";
  const navigation = getNavigationByRole(role);

  const handleLogout = () => {
    console.log("Logout logic here");
  };

  return (
    <>
      {/* Overlay - only shows on mobile when sidebar is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
          suppressHydrationWarning
        />
      )}
      
      <aside
        className={cn(
          // Base styles
          "bg-background border-r h-screen flex flex-col",
          "transition-all duration-300",
          
          // Mobile styles (below md)
          "fixed left-0 top-0 z-50",
          open ? "translate-x-0" : "-translate-x-full",
          open ? "w-64" : "w-64",
          
          // Desktop styles (md and above)
          "md:sticky md:top-0",
          "md:translate-x-0",
          open ? "md:w-64" : "md:w-16",
          
          className
        )}
        aria-label="Main navigation sidebar"
        suppressHydrationWarning
      >
        {/* HEADER */}
        <div className={cn(
          "h-16 flex items-center",
          open ? "justify-between px-4" : "flex-col justify-center mt-7",
        )}>
          <Logo size={open ? "md" : "sm"} showText={false} variant="auto" 
            className={!open ? "justify-center w-full mb-3" : ""} 
          />
          <SidebarToggle />
          {!open && <div className="w-8 h-px bg-border my-1 mt-6" />}
        </div>

        {/* NAVIGATION - Using the navigation array from getNavigationByRole */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {navigation.map((item) => (
            <SidebarItem 
              key={item.title} 
              item={item} 
              sidebarOpen={open} 
              toggleSidebar={toggle} 
            />
          ))}
        </nav>

        {/* FOOTER - Settings link uses dynamic role */}
        <div className="border-t p-3 space-y-2">
          {/* <NavLink 
            href={`/dashboard/${userRole}/settings`}  // 👈 Dynamic role in URL
            icon={<Settings size={18} />} 
            label="Settings" 
            sidebarOpen={open} 
          />
          <NavLink 
            href="/dashboard/help" 
            icon={<HelpCircle size={18} />} 
            label="Help" 
            sidebarOpen={open} 
          /> */}
          {/* <UserProfile sidebarOpen={open} /> */}
          <LogoutButton onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
}