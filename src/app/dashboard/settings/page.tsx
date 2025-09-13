
'use client';

import { useState } from 'react';
import { Languages, MapPin, Search } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { languages } from '@/lib/translations';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('languageSettings')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Language Settings</CardTitle>
          <CardDescription>Choose the language for the application interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a language..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <RadioGroup value={language ?? 'auto'} onValueChange={(value) => setLanguage(value as any)}>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="lang-auto" />
                  <Label htmlFor="lang-auto" className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Auto-detect based on location</span>
                  </Label>
                </div>
              {filteredLanguages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                  <Label htmlFor={`lang-${lang.code}`} className="text-lg">
                    {lang.name}
                  </Label>
                </div>
              ))}
               {filteredLanguages.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No languages found.</p>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
