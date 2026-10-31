import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import './globals.css';
import UtmCapture from '@/components/UtmCapture';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Permanent Roofline Lighting in Abilene | Light Up Texas Installs',
  description:
    'Permanent, app-controlled roofline lighting for West Texas homes. Hidden by day, any color by night. Get a ballpark price in under 5 minutes.',
  openGraph: { images: ['/images/hero.jpg'] },
};

export const viewport: Viewport = { themeColor: '#141A1D' };

const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <UtmCapture />
        {PIXEL && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
        )}
      </body>
    </html>
  );
}
