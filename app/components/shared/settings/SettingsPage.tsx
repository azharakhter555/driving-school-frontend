// components/shared/settings/SettingsPage.tsx
"use client";

import { useState } from "react";
import { User, MapPin, Bell, CreditCard, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileForm } from "./ProfileForm";

interface SettingsPageProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    role: "admin" | "instructor" | "student";
  };
}

// ✅ Different tabs based on role
const getTabsByRole = (role: string) => {
  const commonTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  if (role === "instructor") {
    return [
      ...commonTabs,
      { id: "locations", label: "Teaching Locations", icon: MapPin },
      { id: "payment", label: "Payment Account", icon: CreditCard },
      { id: "buffer", label: "Buffer Time", icon: Clock },
    ];
  }

  if (role === "admin") {
    return [
      ...commonTabs,
      { id: "notifications", label: "System Notifications", icon: Bell },
    ];
  }

  return commonTabs; // student
};

export function SettingsPage({ user }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = getTabsByRole(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-6">
        <nav className="w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          <div className="border rounded-lg p-6 bg-card">
            {activeTab === "profile" && <ProfileForm user={user} />}
            {activeTab === "security" && (
              <div className="text-muted-foreground text-center py-12">
                Security settings coming soon
              </div>
            )}
            {activeTab === "locations" && (
              <div className="text-muted-foreground text-center py-12">
                Teaching locations coming soon
              </div>
            )}
            {activeTab === "payment" && (
              <div className="text-muted-foreground text-center py-12">
                Payment account coming soon
              </div>
            )}
            {activeTab === "buffer" && (
              <div className="text-muted-foreground text-center py-12">
                Buffer time settings coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}