/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TabFormBuilder, type TabConfig } from "@/components/shared/forms/TabFormBuilder";
import {
  instructorFormSchema,
  type InstructorFormData,
} from "@/lib/validators/instructor.validator";
import { IRELAND_COUNTIES } from "@/types/instructor.types";
import { driverService } from "@/services/driver/driver.service";
import { toast } from "sonner";

// ── Tab configurations ──
const TABS: TabConfig[] = [
  {
    id: "personal",
    label: "Personal",
    fields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "John", required: true },
      { name: "lastName", label: "Last Name", type: "text", placeholder: "Murphy", required: true },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "john@example.com",
        required: true,
      },
      { name: "phone", label: "Phone", type: "text", placeholder: "087 123 4567", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    ],
  },
  {
    id: "address",
    label: "Address",
    fields: [
      {
        name: "address",
        label: "Street Address",
        type: "text",
        placeholder: "123 Main Street",
        required: true,
      },
      { name: "city", label: "City/Town", type: "text", placeholder: "Dublin", required: true },
      {
        name: "county",
        label: "County",
        type: "select",
        options: IRELAND_COUNTIES.map((c) => ({ value: c, label: c })),
        required: true,
      },
      { name: "eircode", label: "Eircode", type: "text", placeholder: "D01 AB12", required: true },
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
        placeholder: "DL123456",
        required: true,
      },
      { name: "licenseExpiryDate", label: "License Expiry Date", type: "date", required: true },
      {
        name: "adiNumber",
        label: "ADI Number",
        type: "text",
        placeholder: "ADI 12345",
        required: true,
      },
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
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "Tell students about your teaching style...",
      },
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

interface AddInstructorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddInstructorModal({ open, onOpenChange, onSuccess }: AddInstructorModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset(DEFAULT_VALUES);
      setActiveTab("personal");
    }
  }, [open, form]);

  const getCurrentTabFields = (): (keyof InstructorFormData)[] => {
    const tab = TABS.find((t) => t.id === activeTab);
    return tab ? (tab.fields.map((f) => f.name) as (keyof InstructorFormData)[]) : [];
  };

  // ── Handle "Next" – validate current tab only ──
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

  // ── Submit final step ──
  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      await driverService.createDriver(data);
      toast.success("Instructor added successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add instructor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastTab = activeTab === TAB_IDS[TAB_IDS.length - 1];

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Instructor</DialogTitle>
          <DialogDescription>
            Fill in the instructor details. All fields marked with * are required.
          </DialogDescription>
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
          hideButtons={true} // ✅ Hide the default button row
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
              type="button" // ✅ Still type="button" – we'll handle submit manually
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting || form.formState.isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Instructor
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
