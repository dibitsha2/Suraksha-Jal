'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, User, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SurakshaJalLogo } from '@/components/icons';
import { useLanguage } from '@/hooks/use-language';

export default function WelcomePage() {
  const router = useRouter();
  const { setLanguage } = useLanguage();

  const handlePortalSelection = (portal: 'user' | 'health-worker') => {
    // Set a default language if none is selected, before moving to auth
    setLanguage('en'); 
    if (portal === 'user') {
      router.push('/auth');
    } else {
      router.push('/dashboard-health-worker');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="items-center text-center">
          <SurakshaJalLogo className="w-16 h-16 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold font-headline text-primary">
            Welcome to Suraksha Jal
          </CardTitle>
          <CardDescription>
            Your partner in preventing waterborne diseases. Please select your portal to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handlePortalSelection('user')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">User Portal</CardTitle>
              <User className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Access health tools, check symptoms, and get information.</p>
            </CardContent>
          </Card>
           <Card
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handlePortalSelection('health-worker')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Health Worker</CardTitle>
              <Stethoscope className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Submit reports and manage public health data.</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
