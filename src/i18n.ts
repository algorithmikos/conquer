import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ar } from "./utils/translations/ar";
import { tr } from "./utils/translations/tr";
import { en } from "./utils/translations/en";

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

i18n
  .use(initReactI18next) // passing the i18n instance to react-i18next
  .init({
    resources,
    lng: "en", // Set the default language
    interpolation: {
      escapeValue: false, // React already escapes HTML
    },
  });

export default i18n;
