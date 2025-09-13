
'use client';
import AuthForm from '@/components/auth/auth-form';
import { SurakshaJalLogo } from '@/components/icons';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <SurakshaJalLogo className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-primary font-headline">Suraksha Jal</h1>
          <p className="text-muted-foreground">
            Create an account to get started.
          </p>
        </div>
        <AuthForm initialTab="register" userType="user" />
         <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a health worker?{' '}
            <Link href="/health-worker/register" className="underline hover:text-primary">
                Register Here
            </Link>
        </p>
      </div>
    </div>
  );
}
