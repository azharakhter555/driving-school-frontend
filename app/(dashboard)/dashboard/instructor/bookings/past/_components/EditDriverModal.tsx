"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TabFormBuilder, type TabConfig } from "@/components/shared/forms/TabFormBuilder";
import {
  instructorFormSchema,
  type InstructorFormData,
} from "@/lib/validators/instructor.validator";
import { driverService } from "@/services/driver/driver.service";
import { toast } from "sonner";
import { IRELAND_COUNTIES } from "@/types/instructor.types";
import type { Instructor } from "@/types/instructor.types";

// ── Tab configurations ──
const TABS: TabConfig[] = [
  {
    id: "personal",
    label: "Personal",
    fields: [
      { name: "firstName", label: "First Name", type: "text", required: true },
      { name: "lastName", label: "Last Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    ],
  },
  {
    id: "address",
    label: "Address",
    fields: [
      { name: "address", label: "Street Address", type: "text", required: true },
      { name: "city", label: "City/Town", type: "text", required: true },
      {
        name: "county",
        label: "County",
        type: "select",
        options: IRELAND_COUNTIES.map((c) => ({ value: c, label: c })),
        required: true,
      },
      { name: "eircode", label: "Eircode", type: "text", required: true },
    ],
  },
  {
    id: "license",
    label: "License & ADI",
    fields: [
      {
        name: "drivingLicenseNumber",
        label: "Driving License Number",
        type: "text",
        required: true,
      },
      { name: "licenseExpiryDate", label: "License Expiry Date", type: "date", required: true },
      { name: "adiNumber", label: "ADI Number", type: "text", required: true },
      { name: "adiExpiryDate", label: "ADI Expiry Date", type: "date", required: true },
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    fields: [
      {
        name: "transmission",
        label: "Transmission",
        type: "select",
        options: [
          { value: "manual", label: "Manual" },
          { value: "automatic", label: "Automatic" },
          { value: "both", label: "Both" },
        ],
        required: true,
      },
      {
        name: "hourlyRate",
        label: "Hourly Rate (€)",
        type: "number",
        min: 30,
        max: 100,
        required: true,
      },
      {
        name: "yearsOfExperience",
        label: "Years of Experience",
        type: "number",
        min: 0,
        max: 50,
        required: true,
      },
      { name: "bio", label: "Bio", type: "textarea" },
    ],
  },
];

// ── Strict tab IDs ──
const TAB_IDS = ["personal", "address", "license", "teaching"] as const;
type TabId = (typeof TAB_IDS)[number];

// ── Default values ──
const DEFAULT_VALUES: InstructorFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  city: "",
  county: "Dublin",
  eircode: "",
  drivingLicenseNumber: "",
  licenseExpiryDate: "",
  adiNumber: "",
  adiExpiryDate: "",
  transmission: "manual",
  hourlyRate: 50,
  yearsOfExperience: 0,
  bio: "",
  role: "instructor",
  isActive: true,
  emailVerified: false,
  avatarUrl: "",
  rating: 0,
  isApproved: false,
  approvalStatus: "pending",
  profileComplete: false,
};

interface EditDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Instructor | null;
  onSuccess: () => void;
}

export function EditDriverModal({ open, onOpenChange, driver, onSuccess }: EditDriverModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  useEffect(() => {
    if (driver) {
      form.reset({
        firstName: driver.firstName || "",
        lastName: driver.lastName || "",
        email: driver.email || "",
        phone: driver.phone || "",
        dateOfBirth: driver.dateOfBirth || "",
        address: driver.address || "",
        city: driver.city || "",
        county: driver.county || "Dublin",
        eircode: driver.eircode || "",
        drivingLicenseNumber: driver.drivingLicenseNumber || "",
        licenseExpiryDate: driver.licenseExpiryDate || "",
        adiNumber: driver.adiNumber || "",
        adiExpiryDate: driver.adiExpiryDate || "",
        transmission: driver.transmission || "manual",
        hourlyRate: Number(driver.hourlyRate) || 50,
        yearsOfExperience: Number(driver.yearsOfExperience) || 0,
        bio: driver.bio || "",
      });
      setActiveTab("personal");
    }
  }, [driver, form]);

  const getCurrentTabFields = (): (keyof InstructorFormData)[] => {
    const tab = TABS.find((t) => t.id === activeTab);
    return tab ? (tab.fields.map((f) => f.name) as (keyof InstructorFormData)[]) : [];
  };

  const handleNext = async () => {
    const fields = getCurrentTabFields();
    const isValid = await form.trigger(fields);
    if (!isValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    const idx = TAB_IDS.indexOf(activeTab);
    if (idx === -1 || idx === TAB_IDS.length - 1) return;
    const nextTab = TAB_IDS[idx + 1];
    if (nextTab) setActiveTab(nextTab);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!driver) return;
    setIsSubmitting(true);
    try {
      await driverService.updateDriver(driver.id, data as InstructorFormData);
      toast.success("Instructor updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastTab = activeTab === TAB_IDS[TAB_IDS.length - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Instructor</DialogTitle>
          <DialogDescription>Update the instructor's details.</DialogDescription>
        </DialogHeader>

        <TabFormBuilder
          schema={instructorFormSchema}
          defaultValues={form.getValues()}
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
          onSubmit={isLastTab ? handleSubmit : () => {}}
          submitLabel=""
          cancelLabel=""
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting || form.formState.isSubmitting}
          form={form}
          hideButtons={true} // ✅ Always hide default buttons
        />

        {/* ── Custom buttons placed OUTSIDE the TabFormBuilder ── */}
        <div className="flex gap-2 justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {!isLastTab ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting || form.formState.isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Instructor
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
