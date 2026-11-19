'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth/auth.services';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailTokenPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { setUser, user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        await authService.verifyEmail(token);
        // Update user in context to reflect emailVerified: true
        if (user) {
          setUser({ ...user, emailVerified: true });
        } else {
          // If user context is empty, we might need to re-fetch user data
          // Or rely on the fact that the backend will set verified flag and we can redirect.
        }
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => router.push("/dashboard/student/bookings"), 2000);
      } catch {
        setStatus('error');
        toast.error('Invalid or expired verification link.');
      }
    };
    verify();
  }, [token, router, setUser, user]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full shadow-lg border-border text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">Verifying your email...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full shadow-lg border-border text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-foreground">✅ Email Verified!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your email has been successfully verified. You will be redirected to the dashboard shortly.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full shadow-lg border-border text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-foreground">❌ Verification Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The verification link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/email-verify">
            <Button className="w-full">Resend verification email</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}