
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language | null;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations[Language]) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && translations[storedLanguage]) {
      setLanguageState(storedLanguage);
    } else {
      // If no language is stored, we don't set one,
      // allowing the language selector to appear.
      setLanguageState(null);
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
    // Default to english if language is not set, but use the selected one if it is.
    const langKey = language || 'en';
    return translations[langKey][key] || (translations.en[key] as string) || String(key);
  };
  
  if (!isMounted) {
    // While hydrating, don't render anything to avoid mismatches
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
