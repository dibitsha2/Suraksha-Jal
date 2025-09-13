
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HealthWorkerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/health-worker/login');
  }, [router]);

  return null;
}
