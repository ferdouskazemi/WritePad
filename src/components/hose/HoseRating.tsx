"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseRatingProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  label: string;
  value?: number;
  name?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseRating({
  label,
  value,
  name,
  disabled = false,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseRatingProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { value?: number | string }>(null);

  useEffect(() => {
    loadHoseScript("rating").then(() => setLoaded(true));
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
      const val = Number(el.value);
      if (!isNaN(val)) onChange?.(val);
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
    <hose-rating
      ref={ref}
      label={label}
      value={value}
      name={name}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    />
  );
}
