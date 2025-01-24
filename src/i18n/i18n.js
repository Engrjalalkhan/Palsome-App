import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import {
  en,
  fr,
  hi,
  fa,
  ar,
  es,
  ur,
  zh,
  zh_Hant,
  vi,
  th,
  pt,
  nn,
  nl,
  ko,
  it,
  id,
  de,
} from "./translations";

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  fr: {
    translation: fr,
  },
  fa: {
    translation: fa,
  },
  ar: {
    translation: ar,
  },
  es: {
    translation: es,
  },
  ur: {
    translation: ur,
  },
  zh: {
    translation: zh,
  },
  zh_Hant: {
    translation: zh_Hant,
  },
  vi: {
    translation: vi,
  },
  th: {
    translation: th,
  },
  pt: {
    translation: pt,
  },
  nn: {
    translation: nn,
  },
  nl: {
    translation: nl,
  },
  ko: {
    translation: ko,
  },
  it: {
    translation: it,
  },
  id: {
    translation: id,
  },
  de: {
    translation: de,
  },
};

i18next.use(initReactI18next).init({
  debug: false,
  lng: "en",
  compatibilityJSON: "v3",
  //language to use if translation in user language is not available
  fallbackLng: "en",
  resources,
});

export default i18next;
