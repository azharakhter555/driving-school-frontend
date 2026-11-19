// _components/instructor-filters.config.ts
import { IRELAND_COUNTIES } from "@/types/instructor.types";
import type { FilterConfig } from "@/types/filter";

export const driverFilters: FilterConfig[] = [
  {
    id: "search", // → ?search=akhter
    label: "Search Instructors",
    type: "text",
    placeholder: "Search by name, email, or ADI number...",
    width: "full",
    defaultValue: "",
  },
  {
    id: "approvalStatus", // was: "status"
    label: "Status",
    type: "select",
    options: [
      { label: "All Statuses", value: "all" },
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Suspended", value: "suspended" },
      { label: "Inactive", value: "inactive" },
    ],
    defaultValue: "all",
    section: "Status",
    width: "half",
  },
  {
    id: "county", // same
    label: "County",
    type: "select",
    options: [
      { label: "All Counties", value: "all" },
      ...IRELAND_COUNTIES.map((c) => ({ label: c, value: c })),
    ],
    defaultValue: "all",
    section: "Location",
    width: "half",
  },
  {
    id: "transmission", // same
    label: "Transmission",
    type: "select",
    options: [
      { label: "All", value: "all" },
      { label: "Manual", value: "manual" },
      { label: "Automatic", value: "automatic" },
      { label: "Both", value: "both" },
    ],
    defaultValue: "all",
    section: "Teaching",
    width: "half",
  },
  {
    id: "isApproved", // ← match the backend key AND the entity property
    label: "Approved",
    type: "select",
    options: [
      { label: "All", value: "all" },
      { label: "Approved", value: "true" },
      { label: "Not Approved", value: "false" },
    ],
    defaultValue: "all",
    section: "Status",
    width: "half",
  },
  {
    id: "yearsOfExperience", // was: "minExperience"
    label: "Min. Years Experience",
    type: "number",
    operator: "gte", // → ?yearsOfExperience=$gte:5
    defaultValue: 0,
    props: { min: 0, max: 50 },
    section: "Teaching",
    width: "half",
  },
  {
    id: "rating", // was: "minRating"
    label: "Minimum Rating",
    type: "rating",
    operator: "gte", // → ?rating=$gte:4
    defaultValue: 0,
    props: { max: 5, showValue: true },
    section: "Teaching",
    width: "half",
  },
  {
    id: "createdAt", // was: "dateRange"
    label: "Registration Date",
    type: "date-range", // → ?createdAt=$gte:...&createdAt=$lte:...
    section: "Date Filters",
    width: "full",
    defaultValue: { from: undefined, to: undefined },
  },
];
