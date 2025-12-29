"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import { RTKError } from '../../utils/type';

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetPasswordQUery, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Re-validate confirmPassword when newPassword changes
  useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [newPassword, confirmPassword, trigger]);

  const onSubmit = async (data: ResetPasswordForm) => {

    // Simple form submission - just log the data
    console.log("Reset password data:", {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    try {
      const response = await resetPasswordQUery({ newPassword: data.newPassword.trim(), confirmPassword: data.confirmPassword.trim(), token: token }).unwrap();
      console.log("Reset password response:", response);
      toast.success(response.message || 'Password has been reset successfully');
      router.push('/auth/login');
    } catch (error: unknown) {
      const err = error as RTKError;
      toast.error(err?.data?.message || 'Failed to reset password. Please try again.');
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
            Set a password
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 font-normal pt-2">
          Your previous password has been reseted. Please set a new password for
          your account.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-900 font-medium">
              Create Password *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="new password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
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
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-gray-900 font-medium"
            >
              Re-enter Password *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => {
                    if (!value) return "Please confirm your password";
                    if (value !== newPassword) return "Passwords do not match";
                    return true;
                  },
                })}
                className={`h-11 bg-white border rounded-xl focus:ring-2 focus:ring-purple-500 pr-12 ${errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-purple-500"
                  }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              isLoading || newPassword !== confirmPassword || !newPassword
            }
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6"
          >
            {isLoading ? "Changing..." : "Change Password"}
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
