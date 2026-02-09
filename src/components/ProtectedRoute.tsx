"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { rehydrateAuth } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  // Consider these paths as public
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-email',
    '/auth/reset-password',
    '/unauthorized'
  ];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    const checkAuth = async () => {
      // 1. If we're on a public path, we don't need to block rendering
      if (isPublicPath) {
        setIsChecking(false);
        // But if we have a token and are on login/register, redirect to dashboard
        const token = localStorage.getItem("MobileViewAdmin") || localStorage.getItem("accessToken");
        if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
          router.replace("/");
        }
        return;
      }

      // 2. Try to rehydrate if not authenticated
      if (!isAuthenticated) {
        dispatch(rehydrateAuth());
      }

      // 3. Check for token access
      const token = localStorage.getItem("MobileViewAdmin") || localStorage.getItem("accessToken");

      if (!token) {
        // No token and not a public path? Go to login
        router.replace("/auth/login");
      } else {
        // Token exists, assume authenticated for now (rehydrateAuth will handle the rest)
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, isPublicPath, pathname, router, dispatch]);

  if (isChecking && !isPublicPath) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="relative flex flex-col items-center">
          {/* Outer Ring */}
          <div className="w-24 h-24 rounded-full border-[3px] border-purple-100 border-t-purple-600 animate-spin"></div>

          {/* Interior Logo or Icon Placeholder */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-600 rounded-lg animate-pulse"></div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Verifying Session
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return <>{children}</>;
}

