
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HealthWorkerAuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard-health-worker/login');
  }, [router]);

  return null;
}
