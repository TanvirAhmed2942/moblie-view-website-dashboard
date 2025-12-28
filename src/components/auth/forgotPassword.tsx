"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useEmailForgotPasswordMutation } from '../../features/auth/authApi';
import { forgetPasswordFormType } from "./auth.types";

export default function ForgotPassword() {
  const router = useRouter();
  const [forgotPassword, { isLoading: isLoadingEmail }] = useEmailForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordFormType>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: forgetPasswordFormType) => {
    try {
      const response = await forgotPassword({ email: data.email.trim() }).unwrap();
      console.log("Forgot password response:", response);
      router.push(`/auth/verify-email?email=${data.email.trim()}`);
      toast.success(response.message || 'Verification code sent to your email');
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error?.data?.message || 'Failed to send verification code. Please try again.');
    }

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
              placeholder="Email"
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
            disabled={isLoadingEmail}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6"
          >
            {isLoadingEmail ? "Sending..." : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="text-purple-600 hover:text-purple-600 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </form>

      </CardContent>
    </Card>
  );
}
