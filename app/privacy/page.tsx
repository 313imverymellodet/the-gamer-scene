import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — The Gamer Scene',
  description: 'Privacy Policy for The Gamer Scene — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '2px solid var(--ink)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        zIndex: 100,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--serif)',
          fontWeight: 900,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          textDecoration: 'none',
        }}>
          THE GAMER SCENE
        </Link>
        <Link href="/" style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
          textDecoration: 'none',
        }}>
          ← Back to Issue
        </Link>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          background: 'var(--ink)',
          color: 'var(--bg)',
          padding: '3px 8px',
          display: 'inline-block',
          marginBottom: '20px',
        }}>
          Legal
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}>
          Privacy Policy
        </h1>

        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.78rem',
          color: 'var(--ink-faint)',
          letterSpacing: '0.04em',
          margin: '0 0 48px',
          borderBottom: '1px solid var(--rule)',
          paddingBottom: '20px',
        }}>
          Last updated: April 21, 2026
        </p>

        <div className="article-body" style={{ fontFamily: 'var(--serif)', fontSize: '1rem', lineHeight: 1.75 }}>

          <p>The Gamer Scene ("we," "us," or "our") operates thegamerscene.news. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.</p>

          <h2>Information We Collect</h2>

          <h3>Automatically Collected Data</h3>
          <p>When you visit our site, certain information is collected automatically through third-party services:</p>
          <ul>
            <li><strong>Google Analytics (GA4)</strong> — collects anonymized data including pages visited, time on site, device type, and general geographic location. This data is used to understand how readers use the site. IP addresses are anonymized.</li>
            <li><strong>Vercel Analytics</strong> — collects performance data such as page load times and Core Web Vitals. No personally identifiable information is stored.</li>
            <li><strong>Google AdSense &amp; Ezoic</strong> — our advertising partners may use cookies to serve relevant ads based on your browsing behavior. See the Advertising section below for more detail.</li>
          </ul>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Newsletter subscription</strong> — if you subscribe to our Substack newsletter, your email address is collected and managed by Substack, Inc. Their privacy policy governs that data: <a href="https://substack.com/privacy" target="_blank" rel="noopener noreferrer">substack.com/privacy</a>.</li>
            <li><strong>Email contact</strong> — if you email us directly, we retain that correspondence to respond to you. We do not share your email address with third parties.</li>
          </ul>

          <h2>Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Functionality</strong> — storing your reading preferences (e.g., tab state) in localStorage. No personal data is stored.</li>
            <li><strong>Analytics</strong> — Google Analytics uses cookies to distinguish unique visits.</li>
            <li><strong>Advertising</strong> — AdSense and Ezoic use cookies to serve and measure ads. You can opt out via the Google Ad Settings page or your browser's cookie controls.</li>
            <li><strong>Consent management</strong> — Ezoic's GatekeeperConsent CMP manages cookie consent in applicable jurisdictions.</li>
          </ul>

          <h2>Advertising</h2>
          <p>The Gamer Scene displays advertisements served by Google AdSense and Ezoic. These services may use cookies and web beacons to collect data about your visits to this and other websites in order to provide relevant advertisements.</p>
          <p>You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> or <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</p>

          <h2>How We Use Information</h2>
          <ul>
            <li>To understand how readers engage with our content and improve the publication</li>
            <li>To deliver and measure advertising</li>
            <li>To respond to inquiries you send us</li>
            <li>To send the newsletter to subscribers who have opted in</li>
          </ul>

          <h2>Data Retention</h2>
          <p>Analytics data is retained per the default settings of the respective platforms (26 months for Google Analytics). Email correspondence is retained for as long as relevant. You may request deletion of any data we hold about you by contacting us.</p>

          <h2>Third-Party Links</h2>
          <p>Our articles may contain links to external websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies.</p>

          <h2>Children's Privacy</h2>
          <p>The Gamer Scene is not directed at children under the age of 13. We do not knowingly collect personal information from children.</p>

          <h2>Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to access, correct, or delete personal data we hold about you, or to object to certain processing. To exercise these rights, contact us at <a href="mailto:contact@thegamerscene.news">contact@thegamerscene.news</a>.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this policy from time to time. The date at the top of this page reflects when it was last revised. Continued use of the site after changes constitutes acceptance of the updated policy.</p>

          <h2>Contact</h2>
          <p>Questions about this policy? Reach us at <a href="mailto:contact@thegamerscene.news">contact@thegamerscene.news</a> or visit our <Link href="/contact">Contact page</Link>.</p>
        </div>
      </main>

      <footer style={{
        borderTop: '2px solid var(--ink)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--sans)',
        fontSize: '0.75rem',
        color: 'var(--ink-faint)',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE · EST. 2013</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/about" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/terms" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Terms</Link>
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>← Back to Issue</Link>
        </div>
      </footer>
    </div>
  )
}
