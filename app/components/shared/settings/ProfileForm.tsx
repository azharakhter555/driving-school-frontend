// app/(dashboard)/dashboard/instructor/settings/_components/ProfileForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
   const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
    },
  });



  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (url: string) => {
    await fetch("/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ avatarUrl: url }),
    });
  };

  const handleAvatarRemove = async () => {
    await fetch("/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ avatarUrl: null }),
    });
    toast.success("Profile picture removed");
  };

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex justify-center p-6 border rounded-lg bg-muted/30">
        <AvatarUpload
          currentUrl={user.avatarUrl}
          userName={`${user.firstName} ${user.lastName}`}
          onUploadComplete={handleAvatarUpload}
          onRemove={handleAvatarRemove}
          size="lg"
        />
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+353 87 123 4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Tell us about yourself..."
            {...register("bio")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}