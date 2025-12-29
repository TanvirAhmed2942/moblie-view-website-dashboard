"use client";
import AnalyticsLayout from "@/components/analytics/AnalyticsLayout";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      // Check localStorage as fallback
      const token = localStorage.getItem("MobileViewAdmin");
      if (!token) {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="">
      <AnalyticsLayout />
    </div>
  );
}
