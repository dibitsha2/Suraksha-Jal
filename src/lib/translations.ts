

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'brx', name: 'बोड़ो (Bodo)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ks', name: 'कश्मीरी (Kashmiri)' },
  { code: 'kok', name: 'कोंकणी (Konkani)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)' },
  { code: 'sd', name: 'सिन्धी (Sindhi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ur', name: 'اردو (Urdu)' },
];

const generateTranslations = () => {
    const translations: any = {};
    const englishFallbacks = {
        dashboard: 'Dashboard',
        symptomChecker: 'Symptom Checker',
        reports: 'Local Reports',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        welcome: 'Welcome',
        checkSymptomsPrompt: 'Feeling unwell? Check your symptoms now.',
        getStarted: 'Get Started',
        casesLast30Days: 'Cases in last 30 days',
        precautions: 'Precautions',
        medicationSuggester: 'Medication Suggester',
        healthReminders: 'Health Reminders',
        reminders: 'Reminders',
        medicineChecker: 'Medicine Checker',
        waterQuality: 'Water Quality',
        aiChat: 'AI Chat',
        emergencyContacts: 'Emergency Contacts',
    };

    for (const lang of languages) {
        translations[lang.code] = { ...englishFallbacks };
    }
    
    // Add specific known translations
    translations.hi = {
        ...translations.hi,
        dashboard: 'डैशबोर्ड',
        symptomChecker: 'लक्षण परीक्षक',
        reports: 'स्थानीय रिपोर्ट',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        welcome: 'स्वागत है',
        checkSymptomsPrompt: 'अस्वस्थ महसूस कर रहे हैं? अभी अपने लक्षणों की जाँच करें।',
        getStarted: 'शुरू हो जाओ',
        casesLast30Days: 'पिछले 30 दिनों में मामले',
        precautions: 'सावधानियां',
        medicationSuggester: 'दवाइयाँ सुझाएँ',
        healthReminders: 'स्वास्थ्य अनुस्मारक',
        reminders: 'अनुस्मारक',
        medicineChecker: 'दवा परीक्षक',
        waterQuality: 'पानी की गुणवत्ता',
        aiChat: 'एआई चैट',
        emergencyContacts: 'आपातकालीन संपर्क',
    };
    translations.bn = {
        ...translations.bn,
        dashboard: 'ড্যাশবোর্ড',
        symptomChecker: 'লক্ষণ পরীক্ষক',
        reports: 'স্থানীয় প্রতিবেদন',
        profile: 'প্রোফাইল',
        settings: 'সেটিংস',
        logout: 'লগ আউট',
        welcome: 'স্বাগতম',
        checkSymptomsPrompt: 'অসুস্থ বোধ করছেন? এখনই আপনার লক্ষণগুলি পরীক্ষা করুন।',
        getStarted: 'এবার শুরু করা যাক',
        casesLast30Days: 'গত ৩০ দিনে কেস',
        precautions: 'সতর্কতা',
        medicationSuggester: 'ঔষধের পরামর্শ',
        healthReminders: 'স্বাস্থ্য অনুস্মারক',
        reminders: 'অনুস্মারক',
        medicineChecker: 'ঔষধ পরীক্ষক',
        waterQuality: 'জলর গুণগত মান',
        aiChat: 'এআই চ্যাট',
        emergencyContacts: 'জরুরী যোগাযোগ',
    };
    translations.as = {
        ...translations.as,
        dashboard: 'ডেশ্বৰ্ড',
        symptomChecker: 'ৰোগৰ লক্ষণ পৰীক্ষক',
        reports: 'স্থানীয় প্ৰতিবেদন',
        profile: 'প্ৰফাইল',
        settings: 'ছেটিংছ',
        logout: 'লগ আউট',
        welcome: 'স্বাগতম',
        checkSymptomsPrompt: 'অসুস্থ অনুভৱ কৰিছে নেকি? এতিয়াই আপোনাৰ লক্ষণবোৰ পৰীক্ষা কৰক।',
        getStarted: 'আৰম্ভ কৰক',
        casesLast30Days: 'যোৱa ৩০ দিনত গোচৰ',
        precautions: 'সতৰ্কতামূলক ব্যৱস্থা',
        medicationSuggester: 'ঔষধৰ পৰামৰ্শ',
        healthReminders: 'স্বাস্থ্য স্মাৰক',
        reminders: 'স্মাৰক',
        medicineChecker: 'ঔষধ পৰীক্ষক',
        waterQuality: 'পানীৰ গুণগত মান',
        aiChat: 'এআই চেট',
        emergencyContacts: 'জৰুৰীকালীন যোগাযোগ',
    };

    return translations;
}

export const translations = generateTranslations();

export type Translations = typeof translations;
export type Language = keyof Translations;
