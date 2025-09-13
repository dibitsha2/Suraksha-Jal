

'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { languages } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    toast({
        title: 'Language Updated',
        description: `The application language has been set to ${languages.find(l => l.code === langCode)?.name}.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Settings</h1>
        </div>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                 <Languages className="h-6 w-6 text-primary" />
                 <CardTitle className="font-headline text-2xl">Language</CardTitle>
            </div>
          <CardDescription>Choose your preferred language for the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={language || 'en'} 
            onValueChange={handleLanguageChange}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="font-semibold">Auto-detect</Label>
            </div>
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2">
                <RadioGroupItem value={lang.code} id={lang.code} />
                <Label htmlFor={lang.code}>{lang.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
