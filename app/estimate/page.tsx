import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import Estimator from '@/components/Estimator';

export const metadata: Metadata = { title: 'Get your ballpark price | Light Up Texas Installs' };
export const dynamic = 'force-dynamic';

export default async function EstimatePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const demo = !process.env.GOOGLE_SERVER_KEY;
  return (
    <div style={{ minHeight: '100vh', background: '#F6F3EC' }}>
      <SiteHeader variant="estimate" />
      <Estimator startZip={sp.zip || ''} demo={demo} />
    </div>
  );
}
