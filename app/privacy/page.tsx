import SiteHeader from '@/components/SiteHeader';
import { SITE } from '@/config/site';

export const metadata = { title: 'Privacy policy | Light Up Texas Installs' };

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <SiteHeader variant="estimate" />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', lineHeight: 1.65 }}>
        <h1 className="est-h1">Privacy policy</h1>
        <p>[PRIVACY POLICY TO BE PROVIDED BY {SITE.name.toUpperCase()} BEFORE LAUNCH]</p>
        <p>Summary of what this site collects: the ZIP code, first name, phone number, email and home address you enter in the estimate form, your answers to the estimate questions, and which ad or link brought you here. It is used to prepare your estimate and contact you about it.</p>
      </main>
    </div>
  );
}
