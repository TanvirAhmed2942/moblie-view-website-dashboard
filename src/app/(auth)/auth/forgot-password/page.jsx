import ForgotPassword from "@/components/auth/forgotPassword";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}

export default page;
