"use client";
import AnalyticsLayout from "@/components/analytics/AnalyticsLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('MobileViewAdmin');

    if (!token) {
      router.replace('/auth/login');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // ⛔ Token check শেষ না হওয়া পর্যন্ত কিছুই দেখাবে না
  if (checkingAuth) {
    return null; // বা spinner
  }



  return (
    <div className="">
      <AnalyticsLayout />
    </div>
  );
}
