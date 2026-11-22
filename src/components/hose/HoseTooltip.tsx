"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseTooltipProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  label?: string;
  onHoseLine?: (text: string) => void;
  children?: React.ReactNode;
}

export function HoseTooltip({
  text,
  label = "Help",
  onHoseLine,
  children,
  className = "",
  style,
  ...rest
}: HoseTooltipProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    loadHoseScript("tooltip").then(() => setLoaded(true));
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
    <hose-tooltip
      ref={ref}
      text={text}
      label={label}
      className={`inline-block ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </hose-tooltip>
  );
}
