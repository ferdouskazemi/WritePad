"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseInputProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onInput" | "onChange"> {
  label: string;
  placeholder?: string;
  value?: string;
  name?: string;
  type?: "text" | "email" | "search" | "url" | "tel" | "password";
  maxLength?: number;
  disabled?: boolean;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onHoseLine?: (text: string) => void;
}

export function HoseInput({
  label,
  placeholder,
  value,
  name,
  type = "text",
  maxLength,
  disabled = false,
  onInput,
  onChange,
  onHoseLine,
  className = "",
  style,
  ...rest
}: HoseInputProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement & { value?: string }>(null);

  useEffect(() => {
    loadHoseScript("input").then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = () => {
      onInput?.(el.value || "");
    };

    const handleChange = () => {
      onChange?.(el.value || "");
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
    <hose-input
      ref={ref}
      label={label}
      placeholder={placeholder}
      name={name}
      type={type}
      maxlength={maxLength}
      disabled={disabled || !loaded}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    />
  );
}
