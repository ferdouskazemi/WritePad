import { PaperPlayground } from '@/components/paper/PaperPlayground';
import { PaperMotes } from '@/components/paper';

export const metadata = { title: 'کاغذها' };

export default function PaperDemoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #2a1a0f 0%, #140c07 65%, #070402 100%)',
      }}
    >
      <PaperMotes />
      <PaperPlayground />
    </main>
  );
}
