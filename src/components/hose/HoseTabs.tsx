"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseTabItem {
  value: string;
  label: string;
}

export interface HoseTabsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  label: string;
  tabs: HoseTabItem[];
  selectedIndex?: number;
  disabled?: boolean;
  onChange?: (detail: { index: number; value: string; label: string }) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseTabs({
  label,
  tabs,
  selectedIndex = 0,
  disabled = false,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseTabsProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { selected?: number }>(null);

  useEffect(() => {
    loadHoseScript("tabs").then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (ref.current && selectedIndex !== undefined) {
      ref.current.selected = selectedIndex;
    }
  }, [selectedIndex, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        index: number;
        value: string;
        label: string;
      }>;
      if (customEvent.detail) {
        onChange?.(customEvent.detail);
      }
    };

    const handleLine = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      if (customEvent.detail?.text) {
        onHoseLine?.(customEvent.detail.text);
      }
    };

    el.addEventListener("change", handleChange);
    el.addEventListener("hose:line", handleLine);

    return () => {
      el.removeEventListener("change", handleChange);
      el.removeEventListener("hose:line", handleLine);
    };
  }, [onChange, onHoseLine, loaded]);

  return (
    <hose-tabs
      ref={ref}
      label={label}
      selected={selectedIndex}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    >
      {tabs.slice(0, 6).map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </hose-tabs>
  );
}
