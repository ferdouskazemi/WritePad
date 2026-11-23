'use client';

import { useState } from 'react';
import { Paper, PaperTitle, PaperSubtitle, PaperDivider, PaperPoem, PaperTextarea } from './Paper';
import { PaperCardSelector } from './PaperCardSelector';
import { PAPER_VARIANTS, type PaperVariant } from './variants';

const POEM = [
  ['من به سرچشمهٔ خورشید نه خود بردم راه', <>ذره‌ای بودم و <span className="paper-accent">مهرِ تو</span> مرا بالا بُرد</>],
  ['من خسی بی‌سر و پایم که به سیل افتادم', <>او که می‌رفت مرا هم به دلِ <span className="paper-accent">دریا</span> بُرد</>],
] as const;

/** نمونهٔ یادداشت: انتخاب کاغذ و نوشتن روی آن */
export function PaperPlayground() {
  const [variant, setVariant] = useState<PaperVariant>('burnt');
  const [title, setTitle] = useState('ذره و خورشید');
  const [note, setNote] = useState('');
  const current = PAPER_VARIANTS.find((v) => v.id === variant);

  return (
    <div dir="rtl" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 16px 80px' }}>
      <PaperCardSelector value={variant} onChange={setVariant} className="mb-10" />

      <Paper variant={variant} as="article">
        <PaperTitle>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="عنوان"
            style={{ all: 'inherit', display: 'block', width: '100%', margin: 0, textAlign: 'center' }}
          />
        </PaperTitle>
        <PaperSubtitle>{current?.hint}</PaperSubtitle>
        <PaperPoem beyts={POEM} />
        <PaperDivider />
        <PaperTextarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="اینجا بنویس…" />
      </Paper>
    </div>
  );
}
