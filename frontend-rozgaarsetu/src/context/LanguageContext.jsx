import { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'

    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
