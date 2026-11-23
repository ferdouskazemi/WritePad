# کاغذها — ۱۱ استایل کاغذ برای نوت‌پد (Next.js)

| نام | `variant` | حال‌وهوا |
|---|---|---|
| سوخته | `burnt` | کاغذ کهنه با لبه‌های سوخته و اخگرِ روشن |
| پوستی | `parchment` | پوست آهوی کهن، گرم و لکه‌دار |
| برگِ کنده | `torn` | برگی پاره از دفتر، با چسب کاغذی |
| دفتر خط‌دار | `lined` | خط‌های آبی، حاشیهٔ قرمز، سوراخ صحافی |
| تذهیب | `tazhib` | جدول طلا و لاجورد، شمسه و ترنج، کاغذ زرافشان |
| نامهٔ تاخورده | `folded` | جای تا، حلقهٔ قهوه و تمبر |
| کاهی | `kraft` | کاغذ کاهی با ذرات و دوخت دور |
| لاجورد و طلا | `lajvard` | مرکب طلایی بر شب لاجوردی |
| گلبرگ | `golbarg` | آبرنگ صورتی و یاسی با لبهٔ نرم |
| پاپیروس | `papyrus` | الیاف درهم و لبه‌های ناهموار |
| دست‌ساز | `washi` | کاغذ الیافی سفید با مهر سرخ |

برای دیدن همه، `preview.html` را باز کنید.

## نصب (App Router)

۱. پوشهٔ `components/paper` را در پروژه کپی کنید (کنار بقیهٔ کامپوننت‌ها).
۲. فایل `app/fonts.ts` را کپی کنید.
۳. در `app/layout.tsx` سه خط اضافه کنید (نمونه: `app/layout.example.tsx`):

```tsx
import { nastaliq, naskh } from './fonts';
import { PaperFilters } from '@/components/paper';

<html lang="fa" dir="rtl" className={`${nastaliq.variable} ${naskh.variable}`}>
  <body>
    <PaperFilters />
    {children}
  </body>
</html>
```

> `PaperFilters` فیلترهای SVG لبه‌های سوخته، موج‌دار و آبرنگی را می‌سازد. بدون آن، استایل‌های سوخته، پوستی، گلبرگ، پاپیروس و دست‌ساز لبهٔ صاف خواهند داشت.

اگر alias `@/` ندارید، مسیرها را نسبی کنید.

## استفاده در نوت‌پد

```tsx
'use client';
import { useState } from 'react';
import { Paper, PaperTitle, PaperTextarea, type PaperVariant } from '@/components/paper';

export function Note() {
  const [text, setText] = useState('');
  const [variant] = useState<PaperVariant>('tazhib');
  return (
    <Paper variant={variant}>
      <PaperTitle>یادداشت امروز</PaperTitle>
      <PaperTextarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اینجا بنویس…" />
    </Paper>
  );
}
```

برای ساختن منوی انتخاب کاغذ، از `PAPER_VARIANTS` استفاده کنید (نام فارسی و توضیح هر کاغذ در آن هست). نمونهٔ کامل با دکمه‌های انتخاب: `components/paper/PaperPlayground.tsx` و صفحهٔ `app/paper-demo/page.tsx`.

### کامپوننت‌ها

- `Paper` — خود کاغذ. ویژگی‌ها: `variant`، `tilt` (کمی کج)، `as` (`div` / `article` / `section` / …)
- `PaperTitle`، `PaperSubtitle` — عنوان نستعلیق و زیرعنوان
- `PaperPoem` — شعر دو‌ستونه؛ `beyts={[['مصراع اول', 'مصراع دوم'], …]}`. وقتی کاغذ باریک شود، خودکار زیر هم می‌آید.
- `PaperQuote`، `PaperDivider` — نقل‌قول و جداکنندهٔ ✦
- `PaperTextarea` — جای نوشتن، بی‌پس‌زمینه، با رنگ و فونت کاغذ
- `PaperMotes` — (اختیاری) ذرات طلایی شناور روی پس‌زمینهٔ تیره
- کلاس `paper-accent` روی هر `span` رنگ تأکید آن کاغذ را می‌دهد.

### شخصی‌سازی با متغیرهای CSS

```css
.my-note {
  --paper-ink: #222;          /* رنگ نوشته */
  --paper-accent: #a33;       /* رنگ تأکید و عنوان */
  --paper-line: 2.2rem;       /* فاصلهٔ خط‌های دفتر */
  --paper-pad-x: 32px;        /* حاشیهٔ افقی */
  --paper-backdrop: #fff;     /* رنگ پس‌زمینهٔ صفحه؛ داخل سوراخ‌های کاغذ دیده می‌شود */
}
```

`--paper-backdrop` را هم‌رنگ پس‌زمینهٔ برنامهٔ خودتان بگذارید تا سوراخ سوختگی و سوراخ‌های دفتر طبیعی دیده شوند.

## نکته‌ها

- `field-sizing: content` باعث می‌شود textarea با متن بلند شود و کاغذ هم پایین برود. در مرورگرهایی که پشتیبانی نمی‌کنند، textarea اسکرول می‌خورد.
- در دفتر خط‌دار، متن روی خط‌ها می‌نشیند؛ اگر فاصله‌ها را عوض کردید، مضرب `--paper-line` نگه دارید.
- کاغذهای سوخته و پوستی برای پس‌زمینهٔ تیره ساخته شده‌اند؛ دفتر خط‌دار و دست‌ساز روی پس‌زمینهٔ روشن هم زیبا هستند.
