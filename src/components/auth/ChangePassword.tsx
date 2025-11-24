"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useChangePasswordMutation } from "@/redux/Apis/authApi";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { success, error } = useToast();
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordForm>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
    setApiError(""); // Clear previous errors

    try {
      const response = await changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (response.success && response.statusCode === 200) {
        success(response.message || "Password changed successfully");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        router.push("/auth/login");
      } else {
        const errorMessage = response.message || "Password change failed";
        setApiError(errorMessage);
        error(errorMessage);
      }
    } catch (err: unknown) {
      let errorMessage = "Password change failed. Please try again.";

      // Handle API error response
      const errorData = err as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData.data) {
        const { message, errorMessages } = errorData.data;

        if (message) {
          errorMessage = message;
        } else if (errorMessages && errorMessages.length > 0) {
          errorMessage = errorMessages[0].message || errorMessage;
        }
      }

      setApiError(errorMessage);
      error(errorMessage);
    }
  };
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
            <p className="text-sm text-red-600">{apiError}</p>
            <HiOutlineEmojiSad className="text-red-500" />
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                {...register("oldPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  onChange: () => {
                    if (apiError) setApiError(""); // Clear error when user starts typing
                  },
                })}
                className={`pr-10 ${
                  errors.oldPassword ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password (min 8 characters)"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  onChange: () => {
                    if (apiError) setApiError(""); // Clear error when user starts typing
                  },
                })}
                className={`pr-10 ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => {
                    const newPassword = watch("newPassword");
                    return value === newPassword || "Passwords do not match";
                  },
                  onChange: () => {
                    if (apiError) setApiError(""); // Clear error when user starts typing
                  },
                })}
                className={`pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
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
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-black/70 hover:bg-black text-white hover:text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
