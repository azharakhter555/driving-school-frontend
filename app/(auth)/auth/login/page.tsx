"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Chrome, Facebook, Instagram, Car, Shield, Star, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";
import { authService } from "@/services/auth/auth.services";
import { useAuth } from "@/context/AuthContext";
import { ApiErrorClass } from "@/services/http/errors";
import { httpClient } from "@/services/http/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { setUser, setToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const toastId = toast.loading("Logging in...");
    setIsLoading(true);

    try {
      const result = await authService.login(data);
      const { accessToken, refreshToken, user } = result;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth context
      setToken(accessToken);
      setUser(user);

      // Attach token to HTTP client for future requests
      httpClient.setAuthToken(accessToken);

      toast.success("Welcome back!", { id: toastId });

      console.log(user, "user.emailVerified");
      console.log(user.role, "user.role");

      // Redirect based on email verification status
      if (!user.emailVerified) {
        router.push("/auth/email-verify");
      } else {
        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/dashboard/admin/overview");
            break;
          case "instructor":
            router.push("/dashboard/instructor/overview");
            break;
          case "student":
            router.push("/dashboard/student/bookings");
            break;
          case "car-dealer":
            router.push("/dashboard/dealer/overview");
            break;
          default:
            router.push("/auth/login");
        }
      }
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        if (error.isStatus(401)) {
          toast.error("Invalid email or password. Please try again.", { id: toastId });
        } else if (error.isStatus(403)) {
          toast.error("Account is deactivated. Please contact support.", { id: toastId });
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
      {/* LEFT SIDE - Login Form */}
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
            <h1 className="text-3xl font-bold text-primary">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Login to continue your driving journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="mt-1.5"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
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
              <div className="mt-2 text-right">
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
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
            Don&lsquo;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Create one here
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Branding */}
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

          <h2 className="text-4xl font-bold">Your Driving Journey Starts Here</h2>
          <p className="mt-4 text-white/90 text-lg">
            Trusted by thousands of students across Ireland. Expert instructors, modern cars, and
            flexible schedules.
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

          <p className="mt-8 text-sm text-white/70">
            ✨ Join the #1 rated driving school in Dublin
          </p>
        </div>
      </div>
    </div>
  );
}
