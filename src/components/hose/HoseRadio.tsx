"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseRadioOption {
  value: string;
  label: string;
}

export interface HoseRadioProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  label: string;
  name?: string;
  value?: string;
  options: HoseRadioOption[];
  disabled?: boolean;
  onChange?: (value: string) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseRadio({
  label,
  name,
  value,
  options,
  disabled = false,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseRadioProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { value?: string }>(null);

  useEffect(() => {
    loadHoseScript("radio").then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (ref.current && value !== undefined) {
      ref.current.value = value;
    }
  }, [value, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = () => {
      if (el.value !== undefined) {
        onChange?.(el.value);
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
    <hose-radio
      ref={ref}
      label={label}
      name={name}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          selected={value === opt.value ? true : undefined}
        >
          {opt.label}
        </option>
      ))}
    </hose-radio>
  );
}
