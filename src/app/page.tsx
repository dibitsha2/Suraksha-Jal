
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import LanguageSelector from '@/components/language-selector';
import { auth } from '@/lib/firebase';
import { Loader2, User, HeartPulse } from 'lucide-react';
import { SurakshaJalLogo } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showPortalSelection, setShowPortalSelection] = useState(false);

  useEffect(() => {
    if (!language) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // A user is logged in, check their role and redirect
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const userProfile = allProfiles[user.email!];
        
        if (userProfile && userProfile.isHealthWorker) {
          router.replace('/dashboard-health-worker');
        } else {
          router.replace('/dashboard');
        }
      } else {
        // No user logged in, show portal selection
        setShowPortalSelection(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [language, router]);

  if (!language) {
    return <LanguageSelector />;
  }
  
  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (showPortalSelection) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="items-center text-center">
                <SurakshaJalLogo className="w-16 h-16 text-primary mb-2" />
              <CardTitle className="text-3xl font-bold font-headline text-primary">
                Suraksha Jal
              </CardTitle>
              <p className="text-muted-foreground">Select Your Portal</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button variant="outline" size="lg" className="text-lg h-20 flex-col gap-2" asChild>
                <Link href="/auth/login">
                    <User className="h-6 w-6" />
                    <span>User Portal</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg h-20 flex-col gap-2" asChild>
                <Link href="/health-worker/login">
                    <HeartPulse className="h-6 w-6" />
                    <span>Health Worker Portal</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }

  // Fallback loader while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
