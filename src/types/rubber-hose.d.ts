import * as React from "react";

declare global {
  interface RubberHoseGlobal {
    now: number;
    calm: boolean;
    hash: (x: number) => number;
  }

  interface Window {
    RubberHose?: RubberHoseGlobal;
  }
}

type HoseElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hose-button": HoseElementProps & {
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        line?: string;
      };
      "hose-toggle": HoseElementProps & {
        label: string;
        checked?: boolean;
        name?: string;
        value?: string;
        disabled?: boolean;
        line?: string;
      };
      "hose-slider": HoseElementProps & {
        label: string;
        value?: number | string;
        min?: number | string;
        max?: number | string;
        step?: number | string;
        name?: string;
        disabled?: boolean;
        line?: string;
      };
      "hose-checkbox": HoseElementProps & {
        checked?: boolean;
        name?: string;
        value?: string;
        disabled?: boolean;
        line?: string;
      };
      "hose-radio": HoseElementProps & {
        label: string;
        name?: string;
        value?: string;
        disabled?: boolean;
        line?: string;
      };
      "hose-input": HoseElementProps & {
        label: string;
        placeholder?: string;
        value?: string;
        name?: string;
        type?: "text" | "email" | "search" | "url" | "tel" | "password";
        maxlength?: number | string;
        disabled?: boolean;
        line?: string;
      };
      "hose-tabs": HoseElementProps & {
        label: string;
        selected?: number;
        disabled?: boolean;
        line?: string;
      };
      "hose-progress": HoseElementProps & {
        label: string;
        demo?: boolean;
        disabled?: boolean;
        line?: string;
      };
      "hose-rating": HoseElementProps & {
        label: string;
        value?: number | string;
        name?: string;
        disabled?: boolean;
        line?: string;
      };
      "hose-toast": HoseElementProps & {
        duration?: number | string;
        stay?: boolean;
        line?: string;
      };
      "hose-tooltip": HoseElementProps & {
        text: string;
        label?: string;
        line?: string;
      };
    }
  }
}

export {};
