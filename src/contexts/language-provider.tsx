
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language | null;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations[Language]) => string;
  effectiveLanguage: Language;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [effectiveLanguage, setEffectiveLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language | null;
    if (storedLanguage && translations[storedLanguage]) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState(null);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (language && translations[language]) {
      setEffectiveLanguage(language);
    } else {
      setEffectiveLanguage('en');
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    if (translations[lang as Language]) {
      localStorage.setItem('language', lang);
      setLanguageState(lang as Language);
    }
  };
  
  const t = (key: keyof Translations[Language]): string => {
    return translations[effectiveLanguage]?.[key] || (translations.en[key] as string) || String(key);
  };
  
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, effectiveLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
