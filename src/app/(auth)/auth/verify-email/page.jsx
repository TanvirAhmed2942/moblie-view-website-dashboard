import VerifyEmail from '@/components/auth/verifyEmail';
import { Suspense } from 'react';

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

export default page;
