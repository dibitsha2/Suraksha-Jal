
'use client';
import AuthForm from '@/components/auth/auth-form';
import { SurakshaJalLogo } from '@/components/icons';

export default function HealthWorkerRegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <SurakshaJalLogo className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-primary font-headline">Health Worker Portal</h1>
          <p className="text-muted-foreground">
            Register for an official account.
          </p>
        </div>
        <AuthForm initialTab="register" userType="health-worker" />
      </div>
    </div>
  );
}
