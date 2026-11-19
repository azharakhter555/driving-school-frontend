// app/(dashboard)/dashboard/student/settings/page.tsx
import { SettingsPage } from "@/components/shared/settings/SettingsPage";

const MOCK_STUDENT = {
  id: "student-456",
  firstName: "Sarah",
  lastName: "O'Brien",
  email: "sarah@example.com",
  role: "student" as const,
};

export default function StudentSettingsPage() {
  return <SettingsPage user={MOCK_STUDENT} />;
}