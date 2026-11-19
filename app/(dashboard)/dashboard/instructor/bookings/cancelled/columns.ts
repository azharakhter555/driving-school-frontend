// app/dashboard/admin/Drivers/columns.tsx
"use client";

import { createColumns, CellRenderers, standardActions } from "@/lib/column-factory";
// import type { Driver } from "@/services/driver/driver.types";
import { formatCurrency } from "@/lib/utils";

export const DriverColumns = (
  onView?: (driver: any) => void,
  onEdit?: (driver: any) => void,
  onDelete?: (driver: any) => void
) => {
  const columns = createColumns<any>([
    // ── user relation (nested) ──
    { accessorKey: "user.firstName", header: "First Name" },
    { accessorKey: "user.lastName", header: "Last Name" },
    { accessorKey: "user.email", header: "Email" },

    // ── profile fields (top-level) ──
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (value: string) => value || "—",
    },
    {
      accessorKey: "county",
      header: "County",
      cell: (value: string) => value || "—",
    },
    {
      accessorKey: "adiNumber",
      header: "ADI Number",
      cell: (value: string) => value || "—",
    },
    {
      accessorKey: "transmission",
      header: "Transmission",
      cell: (value: string) =>
        CellRenderers.badge(value, {
          manual: "default",
          automatic: "secondary",
          both: "outline",
        })(value),
    },
    {
      accessorKey: "hourlyRate",
      header: "Rate",
      cell: (value: string | number) => {
        const n = typeof value === "number" ? value : parseFloat(value);
        return Number.isFinite(n) ? formatCurrency(n) : "—";
      },
    },
    {
      accessorKey: "yearsOfExperience",
      header: "Experience",
      cell: (value: number) => `${value} ${value === 1 ? "year" : "years"}`,
    },
    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: (value: string) =>
        CellRenderers.badge(value, {
          pending: "secondary",
          approved: "default",
          rejected: "destructive",
        })(value),
    },
    {
      accessorKey: "isApproved",
      header: "Verified",
      cell: (value: boolean) => CellRenderers.boolean(value),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: (value: string) => CellRenderers.date(value),
    },
  ]);

  if (onView || onEdit || onDelete) {
    columns.push(standardActions.withHandlers<any>(onView, onEdit, onDelete));
  }

  return columns;
};
