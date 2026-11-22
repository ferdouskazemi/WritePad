"use client";

import React, { useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n/I18nContext";
import {
  HoseTabs,
  HoseSlider,
  HoseCheckbox,
  HoseToggle,
  HoseRadio,
  HoseButton,
} from "@/components/hose";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  filmEnabled: boolean;
  onFilmToggle: (enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  filmEnabled,
  onFilmToggle,
}: SettingsModalProps) {
  const { t, locale, setLocale } = useI18n();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(18); // 1.8x
  const [wordCountEnabled, setWordCountEnabled] = useState(true);
  const [spellcheckEnabled, setSpellcheckEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[var(--theme-paper)] text-[var(--theme-ink)] border-3 border-[var(--theme-border)] rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--theme-border)] pb-3 mb-4">
          <h2 className="text-2xl font-black font-serif">{t("settings.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold text-sm flex items-center justify-center hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Rubber Hose Tabs (Folder Tabs with kick legs) */}
        <div className="mb-6 flex justify-center">
          <HoseTabs
            label="Settings Sections"
            tabs={[
              { value: "appearance", label: t("settings.appearance") },
              { value: "writing", label: t("settings.writing") },
              { value: "language", label: t("settings.language") },
              { value: "account", label: t("settings.account") },
            ]}
            selectedIndex={activeTabIdx}
            onChange={(d) => setActiveTabIdx(d.index)}
          />
        </div>

        {/* Tab 0: Appearance */}
        {activeTabIdx === 0 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <label className="text-xs font-bold block mb-2">{t("settings.theme")}</label>
              <div className="flex justify-center">
                <HoseRadio
                  label="Themes"
                  value={currentTheme}
                  options={[
                    { value: "cream", label: t("themes.cream") },
                    { value: "plain", label: t("themes.plain") },
                    { value: "newsprint", label: t("themes.newsprint") },
                    { value: "kraft", label: t("themes.kraft") },
                    { value: "sepia", label: t("themes.sepia") },
                    { value: "night", label: t("themes.night") },
                  ]}
                  onChange={(val) => onThemeChange(val)}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--theme-ink-faint)] flex items-center justify-between">
              <div>
                <span className="text-sm font-bold block">{t("settings.film")}</span>
                <span className="text-xs opacity-60">Grain, dust, and gate wobble</span>
              </div>
              <HoseToggle
                label="Film switch"
                checked={filmEnabled && currentTheme !== "plain"}
                disabled={currentTheme === "plain"}
                onChange={(c) => onFilmToggle(c)}
              />
            </div>
          </div>
        )}

        {/* Tab 1: Writing */}
        {activeTabIdx === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{t("settings.fontSize")}</span>
                <span>{fontSize} px</span>
              </div>
              <div className="w-full flex justify-center">
                <HoseSlider
                  label="Font Size"
                  value={fontSize}
                  min={14}
                  max={36}
                  step={1}
                  onChange={(v) => {
                    setFontSize(v);
                    document.documentElement.style.setProperty("--custom-font-size", `${v}px`);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{t("settings.lineHeight")}</span>
                <span>{(lineHeight / 10).toFixed(1)}</span>
              </div>
              <div className="w-full flex justify-center">
                <HoseSlider
                  label="Line Height"
                  value={lineHeight}
                  min={13}
                  max={24}
                  step={1}
                  onChange={(v) => setLineHeight(v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--theme-ink-faint)]">
              <HoseCheckbox
                checked={wordCountEnabled}
                onChange={(c) => setWordCountEnabled(c)}
              >
                {t("settings.wordCount")}
              </HoseCheckbox>

              <HoseCheckbox
                checked={spellcheckEnabled}
                onChange={(c) => setSpellcheckEnabled(c)}
              >
                {t("settings.spellcheck")}
              </HoseCheckbox>
            </div>
          </div>
        )}

        {/* Tab 2: Language */}
        {activeTabIdx === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs opacity-75">
              Select your interface language. The layout will mirror for Dari and Pashto (RTL).
            </p>
            <div className="flex justify-center my-4">
              <HoseRadio
                label="Interface Language"
                value={locale}
                options={[
                  { value: "en", label: t("locales.en") },
                  { value: "fa", label: t("locales.fa") },
                  { value: "ps", label: t("locales.ps") },
                ]}
                onChange={(v) => setLocale(v as Locale)}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Account */}
        {activeTabIdx === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs opacity-75">
              Notes are saved on this device first. Sign in with Google to sync them seamlessly across all your phones and laptops.
            </p>
            <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-cream)] text-center">
              <span className="text-xs uppercase tracking-wider font-bold opacity-60 block mb-1">
                Local-first Storage
              </span>
              <p className="text-sm font-semibold">IndexedDB (Dexie) Active</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t-2 border-[var(--theme-border)] flex justify-end">
          <div className="inline-block scale-90">
            <HoseButton onClick={onClose}>{t("trash.close")}</HoseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
