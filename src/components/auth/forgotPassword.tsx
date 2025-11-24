"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { forgetPasswordFormType } from "./auth.types";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordFormType>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: forgetPasswordFormType) => {
    setIsLoading(true);

    // Simple form submission - just log the data
    console.log("Forgot password email:", data.email.trim());

    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/verify-email");
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
          <CardTitle className="text-4xl font-bold text-gray-900">
            Forgot your password?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 font-normal pt-2">
          Enter the email address associated with your account. We&apos;ll send
          you an verification code to your email.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">
              Email Address *
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6"
          >
            {isLoading ? "Sending..." : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
