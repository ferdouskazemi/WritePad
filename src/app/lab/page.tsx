"use client";

import React, { useState, useRef, useEffect } from "react";
import { FilmFrame } from "@/components/paper/FilmFrame";
import {
  HoseButton,
  HoseToggle,
  HoseSlider,
  HoseCheckbox,
  HoseRadio,
  HoseInput,
  HoseTabs,
  HoseProgress,
  HoseProgressRef,
  HoseRating,
  HoseToast,
  HoseToastRef,
  HoseTooltip,
} from "@/components/hose";

const THEMES = [
  { id: "cream", label: "Cream (Default)" },
  { id: "newsprint", label: "Newsprint" },
  { id: "kraft", label: "Kraft" },
  { id: "sepia", label: "Sepia reel" },
  { id: "night", label: "Night reel" },
] as const;

export default function LabPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("cream");
  const [filmEnabled, setFilmEnabled] = useState(true);
  const [lastSpeech, setLastSpeech] = useState<string>(
    "Welcome to the Rubber Hose laboratory!"
  );
  const [frameTransform, setFrameTransform] = useState<string>("");
  const [sliderVal, setSliderVal] = useState(42);
  const [inputVal, setInputVal] = useState("Write Pad");
  const [radioVal, setRadioVal] = useState("rich");
  const [ratingVal, setRatingVal] = useState(4);
  const [progressVal, setProgressVal] = useState(0.35);
  const [checkboxVal, setCheckboxVal] = useState(true);

  const toastRef = useRef<HoseToastRef>(null);
  const progressRef = useRef<HoseProgressRef>(null);

  // Apply theme to html data-theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleLine = (text: string) => {
    setLastSpeech(text);
  };

  return (
    <FilmFrame enabled={filmEnabled} onWobbleChange={setFrameTransform}>
      <div
        className="min-h-screen py-8 px-4 sm:px-8 max-w-6xl mx-auto transition-colors duration-200"
        style={{
          transform: frameTransform,
          willChange: "transform",
        }}
      >
        {/* Header card */}
        <header className="ink-card p-6 mb-8 bg-[var(--theme-cream)] text-[var(--theme-ink)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif">
                Write Pad — Laboratory
              </h1>
              <p className="text-sm mt-1 opacity-80">
                Phase 1: 1930s Paper World &amp; 11 Living Cartoon Controls
              </p>
            </div>

            {/* Speech bubble */}
            <div className="relative bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] px-4 py-2 rounded-xl border-2 border-[var(--theme-border)] shadow-sm max-w-md text-center">
              <span className="text-xs uppercase tracking-wider font-bold block opacity-70">
                Spoken line (hose:line)
              </span>
              <p className="text-sm font-medium italic mt-0.5">
                &ldquo;{lastSpeech}&rdquo;
              </p>
            </div>
          </div>

          {/* Theme & Film Bar */}
          <div className="mt-6 pt-4 border-t-2 border-[var(--theme-ink-faint)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold mr-1">Theme:</span>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCurrentTheme(t.id)}
                  className={`px-3 py-1 text-sm rounded-full border-2 font-medium transition-all ${
                    currentTheme === t.id
                      ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)] shadow-sm"
                      : "border-[var(--theme-border)] bg-[var(--theme-paper)] hover:opacity-90"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Film effect:</span>
              <button
                type="button"
                onClick={() => setFilmEnabled((v) => !v)}
                className={`px-3 py-1 text-sm rounded-full border-2 font-medium ${
                  filmEnabled
                    ? "border-green-800 bg-green-100 text-green-900"
                    : "border-gray-500 bg-gray-200 text-gray-800"
                }`}
              >
                {filmEnabled ? "Film ON" : "Film OFF"}
              </button>
            </div>
          </div>
        </header>

        {/* Pashto & Persian Typography Test Card */}
        <section className="ink-card p-5 mb-8 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)]">
          <h2 className="text-lg font-bold mb-2">Typography &amp; Script Verification</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div dir="ltr" className="p-3 rounded border border-[var(--theme-border)]">
              <div className="text-xs font-semibold opacity-70 mb-1">LTR (English Stack)</div>
              <p className="font-serif">
                Literata serif: Write Pad notepad with 1930s living cartoon aesthetic.
              </p>
              <p className="text-xs opacity-60 mt-1">Font: Literata, system-ui</p>
            </div>
            <div dir="rtl" className="p-3 rounded border border-[var(--theme-border)]">
              <div className="text-xs font-semibold opacity-70 mb-1">RTL (Pashto &amp; Dari)</div>
              <p className="font-serif text-base">
                Write Pad دفتر یادداشت ټ ډ ړ ږ ښ ګ ڼ ۍ ې 123 ۱۲۳
              </p>
              <p className="text-xs opacity-60 mt-1">Font: Noto Naskh Arabic / Vazirmatn</p>
            </div>
          </div>
        </section>

        {/* Grid of all 11 Rubber Hose Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. HoseButton */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">1. &lt;hose-button&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Click to bop the dome</p>
            </div>
            <div className="my-4">
              <HoseButton
                onHoseLine={handleLine}
                onClick={() => handleLine("BOP! Pressed the button!")}
              >
                Save Note
              </HoseButton>
            </div>
            <span className="text-xs opacity-60">Button: Dome with grin</span>
          </div>

          {/* 2. HoseToggle */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">2. &lt;hose-toggle&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Lightbulb switch</p>
            </div>
            <div className="my-4">
              <HoseToggle
                label="Film switch"
                checked={filmEnabled}
                onChange={(checked) => {
                  setFilmEnabled(checked);
                  handleLine(`Lightbulb clicked! Checked: ${checked}`);
                }}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">Status: {filmEnabled ? "ON" : "OFF"}</span>
          </div>

          {/* 3. HoseSlider */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">3. &lt;hose-slider&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Trombone slide</p>
            </div>
            <div className="my-4 w-full flex justify-center">
              <HoseSlider
                label="Font size"
                value={sliderVal}
                min={12}
                max={48}
                step={1}
                onChange={(v) => setSliderVal(v)}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">Value: {sliderVal} px</span>
          </div>

          {/* 4. HoseCheckbox */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">4. &lt;hose-checkbox&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Ink slapping checkmark</p>
            </div>
            <div className="my-4">
              <HoseCheckbox
                checked={checkboxVal}
                onChange={(checked) => {
                  setCheckboxVal(checked);
                  handleLine(`Checkbox changed: ${checked}`);
                }}
                onHoseLine={handleLine}
              >
                Persian Digits
              </HoseCheckbox>
            </div>
            <span className="text-xs opacity-60">
              State: {checkboxVal ? "Checked" : "Unchecked"}
            </span>
          </div>

          {/* 5. HoseRadio */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">5. &lt;hose-radio&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Awake &amp; sleeping faces</p>
            </div>
            <div className="my-2">
              <HoseRadio
                label="Editor Mode"
                value={radioVal}
                options={[
                  { value: "rich", label: "Rich Text" },
                  { value: "markdown", label: "Markdown" },
                  { value: "split", label: "Split View" },
                ]}
                onChange={(val) => {
                  setRadioVal(val);
                  handleLine(`Selected editor mode: ${val}`);
                }}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">Active: {radioVal}</span>
          </div>

          {/* 6. HoseInput */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">6. &lt;hose-input&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Fountain pen dancing on caret</p>
            </div>
            <div className="my-4 w-full flex justify-center">
              <HoseInput
                label="Note Title"
                placeholder="Rename note..."
                value={inputVal}
                onInput={(v) => setInputVal(v)}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60 truncate max-w-[200px]">
              Text: &ldquo;{inputVal}&rdquo;
            </span>
          </div>

          {/* 7. HoseTabs */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">7. &lt;hose-tabs&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Folder tabs with kick legs</p>
            </div>
            <div className="my-4">
              <HoseTabs
                label="Settings Panels"
                tabs={[
                  { value: "look", label: "Look" },
                  { value: "text", label: "Text" },
                  { value: "lang", label: "Lang" },
                ]}
                selectedIndex={0}
                onChange={(d) => handleLine(`Tab switched to: ${d.label}`)}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">2 to 4 settings tabs</span>
          </div>

          {/* 8. HoseProgress */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">8. &lt;hose-progress&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Sweating thermometer</p>
            </div>
            <div className="my-4 flex flex-col items-center gap-2">
              <HoseProgress
                ref={progressRef}
                label="Sync progress"
                value={progressVal}
                onDone={() => handleLine("PHEW! Progress complete!")}
                onHoseLine={handleLine}
              />
              <button
                type="button"
                onClick={() => {
                  const next = progressVal >= 1 ? 0 : Number((progressVal + 0.35).toFixed(2));
                  setProgressVal(next);
                  progressRef.current?.set(next);
                }}
                className="mt-2 px-3 py-1 text-xs border border-[var(--theme-border)] rounded-full hover:bg-[var(--theme-cream)]"
              >
                Advance progress ({Math.round(progressVal * 100)}%)
              </button>
            </div>
            <span className="text-xs opacity-60">Thermometer bar</span>
          </div>

          {/* 9. HoseRating */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">9. &lt;hose-rating&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Laughing chorus-line stars</p>
            </div>
            <div className="my-4">
              <HoseRating
                label="Note importance"
                value={ratingVal}
                onChange={(score) => {
                  setRatingVal(score);
                  handleLine(`Rated ${score} stars!`);
                }}
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">Stars: {ratingVal} / 5</span>
          </div>

          {/* 10. HoseToast */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">10. &lt;hose-toast&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Toaster popping messages</p>
            </div>
            <div className="my-4 flex flex-col items-center gap-2">
              <HoseToast ref={toastRef} stay onHoseLine={handleLine} />
              <button
                type="button"
                onClick={() => {
                  toastRef.current?.show("Note saved to cloud!", "Saved!");
                  handleLine("DING! Fresh toast popped!");
                }}
                className="px-3 py-1 text-xs border border-[var(--theme-border)] rounded-full hover:bg-[var(--theme-cream)] font-semibold"
              >
                Pop Toast!
              </button>
            </div>
            <span className="text-xs opacity-60">Toast notification</span>
          </div>

          {/* 11. HoseTooltip */}
          <div className="ink-card p-5 bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] flex flex-col items-center justify-between text-center">
            <div>
              <h3 className="font-bold text-base">11. &lt;hose-tooltip&gt;</h3>
              <p className="text-xs opacity-75 mt-0.5">Bird with balloon hint</p>
            </div>
            <div className="my-4">
              <HoseTooltip
                text="1930s cartoon paper notepad!"
                label="Tip"
                onHoseLine={handleLine}
              />
            </div>
            <span className="text-xs opacity-60">Hover, focus, or tap</span>
          </div>
        </div>
      </div>
    </FilmFrame>
  );
}
