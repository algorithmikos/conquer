import "../i18n.ts";
import i18n from "../i18n.ts";
import moment from "moment";
import "../utils/ar-cl";
import "../utils/tr";
import "moment/locale/en-gb";
import { useEffect } from "react";
import { useUtilsStore } from "../store.ts";

const useAppLang = () => {
  const { lang } = useUtilsStore((state) => state);

  // Hook to listen for localStorage changes
  useEffect(() => {
    lang && i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    // const htmlElement = document.querySelector("html");
    switch (i18n.language) {
      case "tr":
        moment.updateLocale("tr", { week: { dow: 0 } });
        break;
      case "ar":
        moment.updateLocale("ar-cl", { week: { dow: 0 } });
        break;
      case "en":
        moment.updateLocale("en-gb", { week: { dow: 0 } });
        break;
    }
  }, [i18n.language]);
};

export default useAppLang;
