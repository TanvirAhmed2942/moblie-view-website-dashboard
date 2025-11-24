"use client";

import { useCrossTabLogout } from "@/hooks/useCrossTabLogout";

export default function CrossTabLogoutHandler() {
  useCrossTabLogout();
  return null; // This component doesn't render anything
}
