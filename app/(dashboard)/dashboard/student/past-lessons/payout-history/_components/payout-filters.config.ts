// app/dashboard/admin/drivers/payout-history/_components/payout-filters.config.ts
import { IRELAND_COUNTIES } from "@/types/instructor.types";
import type { FilterConfig } from "@/types/filter";

export const payoutFilters: FilterConfig[] = [
  {
    id: "search",
    label: "Search Payouts",
    type: "text",
    placeholder: "Search by name, email, or reference...",
    width: "full",
    defaultValue: "",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "All Statuses", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Paid", value: "paid" },
      { label: "Failed", value: "failed" },
    ],
    defaultValue: "all",
    section: "Payment",
    width: "half",
  },
  {
    id: "method",
    label: "Payment Method",
    type: "select",
    options: [
      { label: "All Methods", value: "all" },
      { label: "Bank Transfer", value: "bank_transfer" },
      { label: "PayPal", value: "paypal" },
      { label: "Stripe", value: "stripe" },
      { label: "Manual", value: "manual" },
    ],
    defaultValue: "all",
    section: "Payment",
    width: "half",
  },
  {
    id: "county",
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
    id: "netAmount",
    label: "Min. Net Payout (€)",
    type: "number",
    operator: "gte",
    defaultValue: 0,
    props: { min: 0 },
    section: "Amounts",
    width: "half",
  },
  {
    id: "grossAmount",
    label: "Min. Gross (€)",
    type: "number",
    operator: "gte",
    defaultValue: 0,
    props: { min: 0 },
    section: "Amounts",
    width: "half",
  },
  {
    id: "periodStart",
    label: "Payout Period",
    type: "date-range",
    section: "Date Filters",
    width: "full",
    defaultValue: { from: undefined, to: undefined },
  },
];
