
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import LanguageSelector from '@/components/language-selector';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  
  useEffect(() => {
    if (language) {
       router.replace('/auth');
    }
  }, [language, router]);

  if (!language) {
    return <LanguageSelector />;
  }

  // This will show a loader while the redirect is happening
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
