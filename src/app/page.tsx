
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
import Image from 'next/image';


export default function WelcomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showPortals, setShowPortals] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // In a real app, you might check a custom claim or database record for role
        if (user.email?.includes('worker')) { // Simple check for demo
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-white">
        <Image
            src="https://picsum.photos/seed/water/1920/1080"
            alt="Clean water"
            data-ai-hint="clean water"
            fill
            className="object-cover -z-10 brightness-50"
        />
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <SurakshaJalLogo className="w-20 h-20 text-white" />
        <h1 className="text-4xl font-bold text-white font-headline">Suraksha Jal</h1>
        <p className="text-white/80 max-w-md">
          Your partner in preventing waterborne diseases. Choose your portal to continue.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-8">
        <Card className="hover:shadow-lg transition-shadow bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="items-center text-center">
            <User className="h-12 w-12 text-white" />
            <CardTitle className="text-2xl font-headline text-white">User Portal</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/80 mb-6">Access health tools, symptom checkers, and safety tips.</p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/auth/login">Enter User Portal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="items-center text-center">
            <BriefcaseMedical className="h-12 w-12 text-white" />
            <CardTitle className="text-2xl font-headline text-white">Health Worker Portal</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/80 mb-6">Submit outbreak reports and access professional resources.</p>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/health-worker/login">Enter Health Worker Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
