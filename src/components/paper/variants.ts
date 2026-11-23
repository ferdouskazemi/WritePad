export const PAPER_VARIANTS = [
  { id: 'burnt',     label: 'سوخته',          hint: 'کاغذ کهنه با لبه‌های سوخته و اخگر' },
  { id: 'parchment', label: 'پوستی',          hint: 'پوست آهوی کهن، گرم و لکه‌دار' },
  { id: 'torn',      label: 'برگِ کنده',       hint: 'برگی پاره از دفتر، با چسب کاغذی' },
  { id: 'lined',     label: 'دفتر خط‌دار',     hint: 'خط‌های آبی، حاشیهٔ قرمز، سوراخ صحافی' },
  { id: 'tazhib',    label: 'تذهیب',          hint: 'جدول طلا و لاجورد بر کاغذ زرافشان' },
  { id: 'folded',    label: 'نامهٔ تاخورده',   hint: 'جای تا، حلقهٔ قهوه و تمبر' },
  { id: 'kraft',     label: 'کاهی',           hint: 'کاغذ کاهی با ذرات و دوخت دور' },
  { id: 'lajvard',   label: 'لاجورد و طلا',    hint: 'مرکب طلایی بر شب لاجوردی' },
  { id: 'golbarg',   label: 'گلبرگ',          hint: 'آبرنگ صورتی و یاسی با لبهٔ نرم' },
  { id: 'papyrus',   label: 'پاپیروس',        hint: 'الیاف درهم و لبه‌های ناهموار' },
  { id: 'washi',     label: 'دست‌ساز',         hint: 'کاغذ الیافی سفید با مهر سرخ' },
] as const;

export type PaperVariant = (typeof PAPER_VARIANTS)[number]['id'];
