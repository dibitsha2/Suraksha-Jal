
'use client';
import Link from 'next/link';
import AuthForm from '@/components/auth/auth-form';
import { SurakshaJalLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

export default function HealthWorkerLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <SurakshaJalLogo className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-primary font-headline">Health Worker Portal</h1>
          <p className="text-muted-foreground">
            Official login for health and community workers.
          </p>
        </div>
        <AuthForm initialTab="login" userType="health-worker" />

        <Separator className="my-6" />

        <div className="text-center">
            <p className="mb-4 text-muted-foreground">Not a health worker?</p>
            <Button asChild variant="outline">
                <Link href="/auth/login">
                    <User className="mr-2 h-4 w-4" />
                    Go to User Portal
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
