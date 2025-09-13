
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language | 'auto' | null;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations[Language]) => string;
  effectiveLanguage: Language;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getLanguageFromLocation = (address: string): Language => {
    const lowerCaseAddress = address.toLowerCase();
    if (lowerCaseAddress.includes('bengal')) return 'bn';
    if (lowerCaseAddress.includes('assam')) return 'as';
    if (lowerCaseAddress.includes('india')) return 'hi';
    return 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language | 'auto' | null>(null);
  const [effectiveLanguage, setEffectiveLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language | 'auto' | null;
    if (storedLanguage && (translations[storedLanguage as Language] || storedLanguage === 'auto')) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState(null);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (language === 'auto') {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.address) {
            setEffectiveLanguage(getLanguageFromLocation(profile.address));
            return;
          }
        }
      } catch (e) {
         console.error("Could not determine language from location", e)
      }
      // Fallback to English if auto-detection fails
      setEffectiveLanguage('en');
    } else if (language && translations[language as Language]) {
      setEffectiveLanguage(language as Language);
    } else {
      // Fallback for null or invalid language
      setEffectiveLanguage('en');
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    if (translations[lang as Language] || lang === 'auto') {
      localStorage.setItem('language', lang);
      setLanguageState(lang as Language | 'auto');
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
