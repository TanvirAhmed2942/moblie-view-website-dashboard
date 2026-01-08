'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Provider } from "react-redux";
import { store } from "../utils/store";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('MobileViewAdmin');

    if (!token) {
      router.replace('/auth/login');
    } else {
      setAuthorized(true);
    }

    setChecking(false);
  }, [router]);

  // 🔄 auth check চলাকালীন
  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // if (!authorized) {
  //   return ; // No UI flash
  // }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}