"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { loginFormType } from "./auth.types";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormType>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: loginFormType) => {
    setIsLoading(true);

    // Simple form submission - just log the data
    console.log("Login form data:", {
      email: data.email.trim(),
      password: data.password.trim(),
      remember: data.remember,
    });

    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-xl bg-white/60 backdrop-blur-[2px] shadow-2xl border border-white/50 rounded-4xl p-8">
      <CardHeader className="text-center space-y-4 pb-6 px-0">
        <Image
          src="/auth/logo.png"
          alt="logo"
          width={120}
          height={120}
          className="mx-auto"
        />
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">Welcome!</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            to your Admin Dashboard.
          </h2>
        </div>
        <p className="text-sm text-gray-600 font-normal pt-2">
          Please sign in to access your admin dashboard and manage your platform
          securely
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder=""
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="h-11 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900 font-medium">
              Password*
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="h-11 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                {...register("remember", { required: false })}
              />
              <Label htmlFor="remember" className="text-sm text-gray-900">
                Remember me
              </Label>
            </div>
            <Button
              variant="link"
              className="px-0 text-sm text-red-500 hover:text-red-600 cursor-pointer underline"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot Password?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md py-6"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
