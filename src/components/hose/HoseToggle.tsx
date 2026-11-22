"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseToggleProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  label: string;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseToggle({
  label,
  checked,
  name,
  disabled = false,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseToggleProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { checked?: boolean }>(null);

  useEffect(() => {
    loadHoseScript("toggle").then(() => setLoaded(true));
  }, []);

  // Sync checked attribute/property
  useEffect(() => {
    if (ref.current && checked !== undefined) {
      ref.current.checked = checked;
    }
  }, [checked, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = () => {
      onChange?.(!!el.checked);
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
    <hose-toggle
      ref={ref}
      label={label}
      name={name}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    />
  );
}
