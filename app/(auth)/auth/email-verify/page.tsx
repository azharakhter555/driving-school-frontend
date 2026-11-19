"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth/auth.services";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  // If email is already verified, redirect to dashboard
  useEffect(() => {
    if (user?.emailVerified) {
      router.push("/dashboard/student/bookings");
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authService.resendVerification(user?.email || "");
      toast.success("Verification email resent! Check your inbox.");
    } catch {
      toast.error("Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <Card className="max-w-md w-full shadow-lg border-border">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We&apos;ve sent a verification link to <br />
            <span className="font-medium text-primary">{user?.email || "your email"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Click the link in the email to verify your account and access the dashboard.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>

            <Link href="/dashboard" className="w-full">
              <Button variant="ghost" className="w-full">
                I&apos;ll verify later
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
