'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations[Language]) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && translations[storedLanguage]) {
      setLanguageState(storedLanguage);
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
    }
  };
  
  const t = (key: keyof Translations[Language]): string => {
    return translations[language][key] || (translations.en[key] as string) || String(key);
  };
  
  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
