'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
];

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('settings')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Language Settings</CardTitle>
          <CardDescription>Choose the language for the application interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={language} onValueChange={(value) => setLanguage(value as any)}>
            <div className="space-y-4">
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                  <Label htmlFor={`lang-${lang.code}`} className="text-lg">
                    {lang.name}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
