/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { Instructor } from "@/types/instructor.types";

interface DriverViewProps {
  instructor: Instructor;
}

export function DriverView({ instructor }: DriverViewProps) {
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "PPP");
    } catch {
      return date;
    }
  };

  // Safe number formatter
  const formatNumber = (value: any): string => {
    const num = Number(value);
    return isNaN(num) ? "N/A" : num.toFixed(2);
  };

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    active: "bg-green-100 text-green-800 border-green-300",
    suspended: "bg-orange-100 text-orange-800 border-orange-300",
    inactive: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const approvalStatus = instructor.approvalStatus || "pending";
  const statusBadgeColor = statusColors[approvalStatus] || statusColors["pending"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {instructor.firstName} {instructor.lastName}
          </h2>
          <p className="text-muted-foreground">{instructor.email}</p>
        </div>
        <Badge className={statusBadgeColor}>
          {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
        </Badge>
      </div>

      <Separator />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">First Name</p>
            <p className="font-medium">{instructor.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Name</p>
            <p className="font-medium">{instructor.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{formatDate(instructor.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{instructor.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{instructor.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Street Address</p>
            <p className="font-medium">{instructor.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">City/Town</p>
            <p className="font-medium">{instructor.city || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">County</p>
            <p className="font-medium">{instructor.county || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Eircode</p>
            <p className="font-medium">{instructor.eircode || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* License & ADI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">License & ADI</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Driving License Number</p>
            <p className="font-medium">{instructor.drivingLicenseNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">License Expiry</p>
            <p className="font-medium">{formatDate(instructor.licenseExpiryDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ADI Number</p>
            <p className="font-medium">{instructor.adiNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ADI Expiry</p>
            <p className="font-medium">{formatDate(instructor.adiExpiryDate)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teaching Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Transmission</p>
            <p className="font-medium capitalize">{instructor.transmission || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hourly Rate (€)</p>
            <p className="font-medium">€{formatNumber(instructor.hourlyRate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Years of Experience</p>
            <p className="font-medium">{Number(instructor.yearsOfExperience) || 0}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="font-medium">{instructor.bio || "No bio provided"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Approval Status</p>
            <Badge className={statusBadgeColor}>
              {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <Badge variant={instructor.isApproved ? "default" : "secondary"}>
              {instructor.isApproved ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
