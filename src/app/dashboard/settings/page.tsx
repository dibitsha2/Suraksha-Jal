

'use client';

import { useState, useMemo } from 'react';
import { Languages, Search } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { languages } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    toast({
        title: 'Language Updated',
        description: `The application language has been set to ${languages.find(l => l.code === langCode)?.name}.`,
    });
  }

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) {
        return languages;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return languages.filter(lang => 
        lang.name.toLowerCase().includes(lowercasedQuery) || 
        lang.code.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Language Settings</h1>
        </div>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                 <Languages className="h-6 w-6 text-primary" />
                 <CardTitle className="font-headline text-2xl">Select Language</CardTitle>
            </div>
          <CardDescription>Choose your preferred language for the application.</CardDescription>
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

          <RadioGroup 
            value={language || 'en'} 
            onValueChange={handleLanguageChange}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredLanguages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2">
                <RadioGroupItem value={lang.code} id={lang.code} />
                <Label htmlFor={lang.code}>{lang.name}</Label>
              </div>
            ))}
          </RadioGroup>
          {filteredLanguages.length === 0 && (
            <div className="text-center text-muted-foreground col-span-full">
              No languages found for "{searchQuery}".
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
