"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseToastRef {
  show: (longMessage: string, shortDrawnMessage?: string) => void;
  hide: () => void;
}

export interface HoseToastProps extends React.HTMLAttributes<HTMLElement> {
  duration?: number;
  stay?: boolean;
  onHoseLine?: (text: string) => void;
}

export const HoseToast = forwardRef<HoseToastRef, HoseToastProps>(
  function HoseToast(
    { duration = 3.6, stay = false, onHoseLine, className = "", style, ...rest },
    ref
  ) {
    const [loaded, setLoaded] = useState(false);
    const elementRef = useRef<
      HTMLElement & {
        show?: (longMsg: string, shortMsg?: string) => void;
        hide?: () => void;
      }
    >(null);

    useEffect(() => {
      loadHoseScript("toast").then(() => setLoaded(true));
    }, []);

    useImperativeHandle(ref, () => ({
      show: (longMsg: string, shortMsg?: string) => {
        elementRef.current?.show?.(longMsg, shortMsg);
      },
      hide: () => {
        elementRef.current?.hide?.();
      },
    }));

    useEffect(() => {
      const el = elementRef.current;
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
      <hose-toast
        ref={elementRef}
        duration={duration}
        stay={stay ? true : undefined}
        className={`inline-block ${className}`}
        style={style}
        {...rest}
      />
    );
  }
);
