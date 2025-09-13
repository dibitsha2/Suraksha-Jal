
'use client';
import AuthForm from '@/components/auth/auth-form';
import { SurakshaJalLogo } from '@/components/icons';
import { HeartPulse } from 'lucide-react';

export default function HealthWorkerLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <SurakshaJalLogo className="w-20 h-20 text-primary" />
            <HeartPulse className="absolute -bottom-2 -right-2 h-8 w-8 text-destructive bg-background rounded-full p-1" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline">Suraksha Jal</h1>
          <p className="text-muted-foreground">
            Health Worker Portal
          </p>
        </div>
        <AuthForm initialTab="login" userType="health-worker" />
      </div>
    </div>
  );
}
