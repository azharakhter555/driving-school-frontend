// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { useSidebar } from "@/hooks/useSidebar";
import { TopNavbar } from "@/components/shared/TopNavbar/TopNavbar";
import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { DashboardFooter } from "@/components/shared/DashboardFooter";
import { Home } from "lucide-react";
import { navigation } from "@/config";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { footerLinks } from "@/config"; 
import { useAuth } from "@/context/AuthContext";            // ✅ added
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute"; // ✅ added

// ============================================================================
// TEMPORARY: Default user role for development
// Later replace with actual auth context/hook
// Example: const { user } = useAuth(); -> userRole = user?.role || "admin";
// ============================================================================
function MainContent({ children }: { children: React.ReactNode }) {
  const { open, toggle } = useSidebar();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const breadcrumbItems = useBreadcrumb();
    const { user } = useAuth(); // ✅ get the actual user
 
  return (
    <div className={`
     flex-1 flex flex-col h-full overflow-hidden
      ${open ? 'md:ml-0' : 'md:ml-0'}
    `}>
      {/* Top Section with Enhanced Navbar */}
      <div className="bg-card sticky top-0 z-40 flex-shrink-0">
        <TopNavbar 
          items={navigation}
          variant="default"
          position="left"
          mobileBreakpoint="lg"
          showSearch={true}
          showNotifications={true}
          showSettings={true}
          showUserMenu={true}
          userName={user?.firstName + ' ' + user?.lastName || 'User'}
          userEmail={user?.email || ''}
          rightSidebarOpen={rightSidebarOpen}
          onRightSidebarToggle={setRightSidebarOpen}
          onMenuClick={toggle}
          isSidebarOpen={open}
        />
        
        {/* Breadcrumb */}
        <div className="px-6 py-2 flex items-center text-sm">
          <Home size={14} className="mr-2 text-muted-foreground" />
          <Breadcrumb 
            items={breadcrumbItems}
            homeIcon={false}
            variant="default"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <DashboardFooter 
        companyName="Your Company"
        links={footerLinks}
        variant="default"
        className="flex-shrink-0"
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
  return (
    <ProtectedRoute>
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden bg-background">
        {/* Pass default admin role for now */}
        <Sidebar userRole={user?.role || 'student'}/>
        <MainContent>{children}</MainContent>
      </div>
      </SidebarProvider>
      </ProtectedRoute>
  );
}