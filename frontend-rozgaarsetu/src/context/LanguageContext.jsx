import { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang === 'hi' || storedLang === 'en') {
            setLanguage(storedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    /**
     * Translate a key.
     * Falls back to English if the key is missing in the current language,
     * and finally falls back to the key itself — so no null/undefined crashes.
     */
    const t = (key) => {
        return translations?.[language]?.[key]
            ?? translations?.['en']?.[key]
            ?? key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
