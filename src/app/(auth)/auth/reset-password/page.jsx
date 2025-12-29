import ResetPassword from "@/components/auth/resetPassword";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}

export default page;
