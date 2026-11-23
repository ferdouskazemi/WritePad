import type { HTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import type { PaperVariant } from './variants';
import './paper.css';

type PaperTag = 'div' | 'article' | 'section' | 'main' | 'aside';

export interface PaperProps extends HTMLAttributes<HTMLElement> {
  /** نوع کاغذ؛ پیش‌فرض «سوخته» */
  variant?: PaperVariant;
  /** کمی کج روی میز */
  tilt?: boolean;
  as?: PaperTag;
  children?: ReactNode;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');

export function Paper({ variant = 'burnt', tilt = false, as: Tag = 'div', className, children, ...rest }: PaperProps) {
  return (
    <Tag className={cx('paper', `paper--${variant}`, tilt && 'paper--tilt', className)} data-paper={variant} {...rest}>
      {children}
    </Tag>
  );
}

export function PaperTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cx('paper-title', className)} {...rest} />;
}

export function PaperSubtitle({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('paper-subtitle', className)} {...rest} />;
}

export function PaperDivider({ symbol = '✦' }: { symbol?: string }) {
  return (
    <div className="paper-divider" aria-hidden="true">
      {symbol}
    </div>
  );
}

/** بیت‌ها به صورت [مصراع اول، مصراع دوم] */
export function PaperPoem({ beyts, className }: { beyts: ReadonlyArray<readonly [ReactNode, ReactNode]>; className?: string }) {
  return (
    <div className={cx('paper-poem', className)}>
      {beyts.map(([a, b], i) => (
        <div className="paper-beyt" key={i}>
          <div className="paper-mesra">{a}</div>
          <div className="paper-mesra">{b}</div>
        </div>
      ))}
    </div>
  );
}

export function PaperQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <blockquote className="paper-quote">
      {children}
      {cite && <cite className="paper-quote-cite">{cite}</cite>}
    </blockquote>
  );
}

/** جای نوشتن یادداشت روی کاغذ */
export function PaperTextarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('paper-textarea', className)} dir="rtl" {...rest} />;
}
