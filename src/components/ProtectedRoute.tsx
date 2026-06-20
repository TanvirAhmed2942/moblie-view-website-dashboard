"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { rehydrateAuth } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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
    if (isPublicPath) {
      const token = localStorage.getItem("MobileViewAdmin") || localStorage.getItem("accessToken");
      if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
        router.replace("/");
      }
      return;
    }

    if (!isAuthenticated) {
      dispatch(rehydrateAuth());
    }

    const token = localStorage.getItem("MobileViewAdmin") || localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isPublicPath, pathname, router, dispatch]);

  return <>{children}</>;
}

