"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { rehydrateAuth } from "@/redux/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("AuthInitializer - Starting rehydration...");
    // Rehydrate authentication state from localStorage
    dispatch(rehydrateAuth());
    console.log("AuthInitializer - Rehydration dispatched");
  }, [dispatch]);

  return null; // This component doesn't render anything
}
