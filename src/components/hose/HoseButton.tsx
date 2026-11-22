"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseButtonProps extends React.HTMLAttributes<HTMLElement> {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onHoseLine?: (text: string) => void;
  children?: React.ReactNode;
}

export function HoseButton({
  type = "button",
  disabled = false,
  onHoseLine,
  onClick,
  children,
  className = "",
  style,
  ...rest
}: HoseButtonProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    loadHoseScript("button").then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onHoseLine) return;

    const handleLine = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      if (customEvent.detail?.text) {
        onHoseLine(customEvent.detail.text);
      }
    };

    el.addEventListener("hose:line", handleLine);
    return () => el.removeEventListener("hose:line", handleLine);
  }, [onHoseLine, loaded]);

  return (
    <hose-button
      ref={ref}
      type={type}
      disabled={disabled || !loaded}
      onClick={onClick}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </hose-button>
  );
}
