'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, KeyRound, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { authService } from '@/services/auth/auth.services'; // ✅ import
import { ApiErrorClass } from '@/services/http/errors'; // ✅ for error handling

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    const toastId = toast.loading('Sending reset link...');

    try {
      // ✅ Actual API call
      await authService.forgotPassword(data.email);

      toast.success('Reset link sent to your email!', { id: toastId });
      setEmailSent(true);
    } catch (error) {
      // ✅ Handle errors gracefully
      if (error instanceof ApiErrorClass) {
        if (error.isStatus(400)) {
          toast.error('Invalid email address. Please try again.', { id: toastId });
        } else if (error.isNetworkError()) {
          toast.error('Network error. Please check your connection.', { id: toastId });
        } else {
          toast.error(error.message || 'Something went wrong.', { id: toastId });
        }
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state (unchanged)
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
            <p className="text-muted-foreground mt-2">
              We&apos;ve sent a password reset link to <br />
              <span className="text-primary font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Resend link
              </Button>
              <Link href="/auth/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Forgot password?</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            No worries. Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send reset link
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Back to login
              </Link>
            </p>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-xs text-muted-foreground">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to home
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          We&apos;ll send a secure link to reset your password.
        </p>
      </div>
    </div>
  );
}