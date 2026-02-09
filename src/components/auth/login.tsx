"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/authSlice";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useLoginMutation } from '../../features/auth/authApi';
import { RTKError } from '../../utils/type';
import { Checkbox } from "../ui/checkbox";
import { loginFormType } from "./auth.types";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [showPassword, setShowPassword] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [Login, { isLoading }] = useLoginMutation();

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




  useEffect(() => {
    const token = localStorage.getItem('MobileViewAdmin');

    if (token) {
      router.replace('/');
    }
  }, [router]);




  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Initial states
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
      });

      gsap.set(logoRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.8,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 15,
      });

      gsap.set(formRef.current, {
        opacity: 0,
        y: 30,
      });

      // Animation sequence
      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          logoRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
    },
    { scope: cardRef }
  );

  const dispatch = useAppDispatch();

  const onSubmit = async (data: loginFormType) => {
    const email = data.email.trim();
    const password = data.password.trim();

    try {
      const result = await Login({ email, password }).unwrap();
      console.log("Login successful:", result);
      if (result.statusCode === 200) {
        // Dispatch setUser to update Redux state and storage
        dispatch(
          setUser({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken || "",
          })
        );

        toast.success(result.message || "Login successful!");
        // Redirect to callbackUrl if it exists, otherwise to dashboard
        router.replace(callbackUrl || "/");
      }
    } catch (error: unknown) {
      const err = error as RTKError;
      toast.error(err?.data?.message || "Login failed. Please try again.");
    }
  };


  return (
    <Card
      ref={cardRef}
      className="w-full max-w-xl bg-white/60 backdrop-blur-[2px] shadow-2xl border border-white/50 rounded-4xl p-8"
    >
      <CardHeader className="text-center space-y-4 pb-6 px-0">
        <div ref={logoRef}>
          <Image
            src="/auth/logo.png"
            alt="logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <div ref={titleRef} className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">Welcome!</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            to your Admin Dashboard.
          </h2>
        </div>
        <p ref={subtitleRef} className="text-sm text-gray-600 font-normal pt-2">
          Please sign in to access your admin dashboard and manage your platform
          securely
        </p>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
                placeholder="Enter your password"
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
