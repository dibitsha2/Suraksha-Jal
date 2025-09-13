
'use client';

import { SurakshaJalLogo } from '@/components/icons';
import HealthWorkerAuthForm from '../_components/health-worker-auth-form';

export default function HealthWorkerLoginPage() {
  return (
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <SurakshaJalLogo className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-primary font-headline">Suraksha Jal</h1>
          <p className="text-muted-foreground">
            Health Worker Portal
          </p>
        </div>
        <HealthWorkerAuthForm initialTab="login" />
      </div>
  );
}
