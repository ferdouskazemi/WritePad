"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseSliderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onInput" | "onChange"> {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  disabled?: boolean;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  name,
  disabled = false,
  onInput,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseSliderProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { value?: number | string }>(null);

  useEffect(() => {
    loadHoseScript("slider").then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (ref.current && value !== undefined) {
      ref.current.value = value;
    }
  }, [value, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = () => {
      const val = Number(el.value);
      if (!isNaN(val)) onInput?.(val);
    };

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

    el.addEventListener("input", handleInput);
    el.addEventListener("change", handleChange);
    el.addEventListener("hose:line", handleLine);

    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("change", handleChange);
      el.removeEventListener("hose:line", handleLine);
    };
  }, [onInput, onChange, onHoseLine, loaded]);

  return (
    <hose-slider
      ref={ref}
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      name={name}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    />
  );
}
