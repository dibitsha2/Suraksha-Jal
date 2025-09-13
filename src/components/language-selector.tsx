
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurakshaJalLogo } from '@/components/icons';
import { languages } from '@/lib/translations';


export default function LanguageSelector() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // If language is already set, redirect to dashboard
    if (language) {
      router.push('/auth');
    }
  }, [language, router]);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    router.push('/auth');
  };
  
  // While checking for language, show nothing to avoid flash
  if (language) {
      return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
            <SurakshaJalLogo className="w-16 h-16 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            Suraksha Jal
          </CardTitle>
          <p className="text-muted-foreground">Select Your Language</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {languages.slice(0, 4).map((lang) => ( // Show top 4 for initial selection
              <Button
                key={lang.code}
                variant="outline"
                size="lg"
                className="text-lg h-14"
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
