"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import enMessages from "../../../messages/en.json";
import faMessages from "../../../messages/fa.json";
import psMessages from "../../../messages/ps.json";

export type Locale = "en" | "fa" | "ps";

const messageMap: Record<Locale, Record<string, unknown>> = {
  en: enMessages,
  fa: faMessages,
  ps: psMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dir: "ltr" | "rtl";
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("writepad_locale") as Locale;
    if (saved === "en" || saved === "fa" || saved === "ps") return saved;
    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("fa")) return "fa";
      if (browserLang.startsWith("ps")) return "ps";
    }
  } catch {
    // fallback
  }
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    const direction = locale === "en" ? "ltr" : "rtl";
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("writepad_locale", newLocale);
    const direction = newLocale === "en" ? "ltr" : "rtl";
    document.documentElement.dir = direction;
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (path: string): string => {
      const parts = path.split(".");
      let current: unknown = messageMap[locale];

      for (const part of parts) {
        if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          // Fallback to English
          let fallback: unknown = messageMap.en;
          for (const fPart of parts) {
            if (fallback && typeof fallback === "object" && fPart in (fallback as Record<string, unknown>)) {
              fallback = (fallback as Record<string, unknown>)[fPart];
            } else {
              return path;
            }
          }
          return typeof fallback === "string" ? fallback : path;
        }
      }

      return typeof current === "string" ? current : path;
    },
    [locale]
  );

  const dir: "ltr" | "rtl" = locale === "en" ? "ltr" : "rtl";

  return (
    <I18nContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
