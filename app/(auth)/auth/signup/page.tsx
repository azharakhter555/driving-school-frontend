"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Chrome, Facebook, Instagram, Car, Shield, Star, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validators/auth";
import type { SignupFormValues } from "@/lib/validators/auth";
import { authService } from "@/services/auth/auth.services";
import { useAuth } from "@/context/AuthContext";
import { ApiErrorClass } from "@/services/http/errors";
import { httpClient } from "@/services/http/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { setUser, setToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    const toastId = toast.loading("Creating your account...");
    setIsLoading(true);

    try {
       const payload = {
      ...data,
      role: 'student' as const,
    };

      const result = await authService.signup(payload);
      console.log('result', result);
      const { accessToken, refreshToken, user } = result;
      console.log('accessToken', accessToken, 'refreshToken', refreshToken, 'user', user);



      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setToken(accessToken);
      setUser(user);

      httpClient.setAuthToken(accessToken);
      toast.success("Account created! Please verify your email to enjoy our full services thanks.", { id: toastId });
      router.push("/auth/email-verify");
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        if (error.isStatus(409)) {
          toast.error("Email already exists. Please log in.", { id: toastId });
        } else if (error.isStatus(400)) {
          const fieldError = error.getFieldError("email");
          toast.error(fieldError || "Invalid input. Please check your details.", { id: toastId });
        } else if (error.isNetworkError()) {
          toast.error("Network error. Please check your connection.", { id: toastId });
        } else {
          toast.error(error.message || "Something went wrong.", { id: toastId });
        }
      } else {
        toast.error("An unexpected error occurred.", { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE - Signup Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-12 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Create an account</h1>
            <p className="mt-2 text-muted-foreground">
              Start your driving journey with National Driving School
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">First name</label>
                <Input
                  placeholder="John"
                  className="mt-1.5"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Last name</label>
                <Input
                  placeholder="Doe"
                  className="mt-1.5"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="mt-1.5"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, number & special character
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full gap-2">
                <Chrome className="h-4 w-4" /> Google
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Facebook className="h-4 w-4" /> Facebook
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Instagram className="h-4 w-4" /> Instagram
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Branding / Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 to-secondary/80 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg text-center text-white">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
              <Car className="h-16 w-16" />
            </div>
          </div>

          <h2 className="text-4xl font-bold">Become a Confident Driver</h2>
          <p className="mt-4 text-white/90 text-lg">
            Join thousands of students who learned to drive with Ireland&lsquo;s most trusted driving school
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">RSA Approved</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">5★ 1,200+ Reviews</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">10k+ Students</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80">
            <span>Fully insured</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Expert instructors</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Nationwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}