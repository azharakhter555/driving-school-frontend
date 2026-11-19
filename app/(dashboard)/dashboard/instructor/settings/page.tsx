// app/(dashboard)/dashboard/instructor/settings/page.tsx
import { SettingsPage } from "@/components/shared/settings/SettingsPage";

// Mock user - replace with API call
const MOCK_INSTRUCTOR = {
  id: "5221d19a-71e6-4b62-ab0b-39586c8fac13",
  firstName: "John",
  lastName: "Murphy",
  email: "john.murphy@example.com",
  phone: "+353871234567",
  avatarUrl: undefined,
  bio: "Experienced driving instructor with 10+ years of teaching.",
  role: "instructor" as const,
};

export default function InstructorSettingsPage() {
  return <SettingsPage user={MOCK_INSTRUCTOR} />;
}