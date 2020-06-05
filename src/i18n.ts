import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

const en = {
    translation: {
        home: "Home",
        creator: "Creator",
        landing: "Landing",
    },
}

const ru = {
    translation: {
        home: "Домой",
        creator: "Упаковщик",
        landing: "Промо",
    },
}

const resources = {
    en,
    ru,
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'subdomain'],
        },
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
