import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/i18n/locales/en";
import es from "@/i18n/locales/es";
import fr from "@/i18n/locales/fr";
import { getSystemLanguage } from "@/utils/preferences";

const i18n = createInstance();

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      es: { translation: es }
    },
    lng: getSystemLanguage(),
    fallbackLng: "fr",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
