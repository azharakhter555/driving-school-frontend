'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, KeyRound, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/services/auth/auth.services';

// Password validation (same as signup)
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/\d/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }
    // Optional: call backend to validate token before showing form
    // For now, assume token is present and we'll validate on submission.
    setIsTokenValid(true);
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Missing reset token.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successfully!', { id: toastId });
      setIsSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (error) {
      toast.error('Invalid or expired reset link.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <KeyRound className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
            <p className="text-muted-foreground mt-2">
              The password reset link is invalid or has expired.
            </p>
            <div className="mt-6">
              <Link href="/forgot-password">
                <Button className="w-full">Request new link</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Password Reset!</h2>
            <p className="text-muted-foreground mt-2">
              Your password has been successfully reset. You will be redirected to login.
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
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
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Set new password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Create a strong password for your account.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">New password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Confirm password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Resetting...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}