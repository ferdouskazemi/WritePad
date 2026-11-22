"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseCheckboxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  checked?: boolean;
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  onHoseLine?: (text: string) => void;
  children?: React.ReactNode;
}

export function HoseCheckbox({
  checked,
  name,
  value,
  disabled = false,
  onChange,
  onHoseLine,
  children,
  className = "",
  style,
  ...rest
}: HoseCheckboxProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { checked?: boolean }>(null);

  useEffect(() => {
    loadHoseScript("checkbox").then(() => setLoaded(true));
  }, []);

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
    <hose-checkbox
      ref={ref}
      name={name}
      value={value}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </hose-checkbox>
  );
}
