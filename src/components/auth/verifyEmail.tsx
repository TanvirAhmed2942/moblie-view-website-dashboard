"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple form submission - just log the data
    console.log("Verification code:", otp);

    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/reset-password");
    }, 1000);
  };

  const handleResendOtp = () => {
    setIsResending(true);

    // Simple resend - just log
    console.log("Resending verification code...");

    // Simulate loading
    setTimeout(() => {
      setIsResending(false);
      setOtp(""); // Clear OTP input
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
            Verify code
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 font-normal pt-2">
          An authentication code has been sent to your email.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2 ">
                <InputOTPSlot
                  index={0}
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                />
                <InputOTPSlot
                  index={1}
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                />
                <InputOTPSlot
                  index={2}
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                />
                <InputOTPSlot
                  index={3}
                  className="w-10 h-10 border-2 border-gray-300 rounded-md"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.length !== 4}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-6"
          >
            {isLoading ? "Verifying..." : "Verified"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <p className="text-center text-gray-600">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-red-500 hover:text-red-600 cursor-pointer underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
