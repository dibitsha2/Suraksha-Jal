
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import LanguageSelector from '@/components/language-selector';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.replace('/dashboard');
      } else {
        if (language) {
          router.replace('/auth');
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [language, router]);

  if (!language) {
    return <LanguageSelector />;
  }

  // Fallback loader while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
