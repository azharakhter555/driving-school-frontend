// app/(dashboard)/dashboard/admin/settings/page.tsx
import { SettingsPage } from "@/components/shared/settings/SettingsPage";

const MOCK_ADMIN = {
  id: "admin-123",
  firstName: "Admin",
  lastName: "User",
  email: "admin@drivingschool.com",
  role: "admin" as const,
};

export default function AdminSettingsPage() {
  return <SettingsPage user={MOCK_ADMIN} />;
}