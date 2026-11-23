import { Noto_Nastaliq_Urdu, Noto_Naskh_Arabic } from 'next/font/google';

export const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-nastaliq',
  display: 'swap',
});

export const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-naskh',
  display: 'swap',
});
