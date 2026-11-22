"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { loadHoseScript } from "./scriptLoader";

export interface HoseProgressRef {
  set: (progress: number, immediate?: boolean) => void;
  reset: () => void;
}

export interface HoseProgressProps extends React.HTMLAttributes<HTMLElement> {
  label: string;
  demo?: boolean;
  value?: number; // 0 to 1
  disabled?: boolean;
  onDone?: () => void;
  onHoseLine?: (text: string) => void;
}

export const HoseProgress = forwardRef<HoseProgressRef, HoseProgressProps>(
  function HoseProgress(
    {
      label,
      demo = false,
      value,
      disabled = false,
      onDone,
      onHoseLine,
      className = "",
      style,
      ...rest
    },
    ref
  ) {
    const [loaded, setLoaded] = useState(false);
    const elementRef = useRef<
      HTMLElement & {
        set?: (n: number, immediate?: boolean) => void;
        reset?: () => void;
      }
    >(null);

    useEffect(() => {
      loadHoseScript("progress").then(() => setLoaded(true));
    }, []);

    useImperativeHandle(ref, () => ({
      set: (p: number, immediate?: boolean) => {
        elementRef.current?.set?.(p, immediate);
      },
      reset: () => {
        elementRef.current?.reset?.();
      },
    }));

    useEffect(() => {
      if (value !== undefined && elementRef.current?.set) {
        elementRef.current.set(value);
      }
    }, [value, loaded]);

    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      const handleDone = () => {
        onDone?.();
      };

      const handleLine = (e: Event) => {
        const customEvent = e as CustomEvent<{ text: string }>;
        if (customEvent.detail?.text) {
          onHoseLine?.(customEvent.detail.text);
        }
      };

      el.addEventListener("hose:done", handleDone);
      el.addEventListener("hose:line", handleLine);

      return () => {
        el.removeEventListener("hose:done", handleDone);
        el.removeEventListener("hose:line", handleLine);
      };
    }, [onDone, onHoseLine, loaded]);

    return (
      <hose-progress
        ref={elementRef}
        label={label}
        demo={demo ? true : undefined}
        disabled={disabled || !loaded}
        className={`inline-block ${className}`}
        style={style}
        {...rest}
      />
    );
  }
);
