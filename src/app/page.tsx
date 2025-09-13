
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import LanguageSelector from '@/components/language-selector';
import { auth } from '@/lib/firebase';
import { Loader2, User, BriefcaseMedical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SurakshaJalLogo } from '@/components/icons';
import Link from 'next/link';


export default function WelcomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showPortals, setShowPortals] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
        const userProfile = allProfiles[user.email!];
        if (userProfile?.role === 'health-worker') {
            router.replace('/dashboard-health-worker');
        } else {
            router.replace('/dashboard');
        }
      } else {
        if (language) {
           setShowPortals(true);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [language, router]);
  
  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!language) {
    return <LanguageSelector />;
  }
  
  if (showPortals) {
    return <PortalSelectionPage />;
  }

  // Fallback loader while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}


function PortalSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <SurakshaJalLogo className="w-20 h-20 text-primary" />
        <h1 className="text-4xl font-bold text-primary font-headline">Suraksha Jal</h1>
        <p className="text-muted-foreground max-w-md">
          Your partner in preventing waterborne diseases. Choose your portal to continue.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <User className="h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline">User Portal</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">Access health tools, symptom checkers, and safety tips.</p>
            <Button asChild size="lg">
              <Link href="/auth/login">Enter User Portal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="items-center text-center">
            <BriefcaseMedical className="h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline">Health Worker Portal</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">Submit outbreak reports and access professional resources.</p>
            <Button asChild size="lg" variant="outline">
              <Link href="/health-worker/login">Enter Health Worker Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
