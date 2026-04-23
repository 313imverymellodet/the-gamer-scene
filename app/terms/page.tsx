import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — The Gamer Scene',
  description: 'Terms of Service for The Gamer Scene.',
}

export default function TermsPage() {
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
          Terms of Service
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

          <p>By accessing or using thegamerscene.news (the "Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>

          <h2>Use of the Site</h2>
          <p>The Gamer Scene grants you a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. You may not:</p>
          <ul>
            <li>Reproduce, republish, or redistribute our content without written permission</li>
            <li>Use the Site in any way that could damage, disable, or impair it</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its related systems</li>
            <li>Use automated tools (scrapers, bots, crawlers) to extract content without prior permission</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>All content published on The Gamer Scene — including articles, reviews, headlines, images, and design elements — is the property of The Gamer Scene or its respective rights holders. All rights reserved.</p>
          <p>Short quotations with attribution and a link back to the original article are permitted under fair use. Full reproduction of articles is not permitted without written consent.</p>

          <h2>User Submissions</h2>
          <p>If you submit comments, tips, or other content to us, you grant The Gamer Scene a non-exclusive, royalty-free license to use, edit, and publish that content. You represent that you own the rights to any content you submit and that it does not violate any third-party rights.</p>
          <p>We reserve the right to remove any submitted content at our discretion, including content that is defamatory, abusive, off-topic, or in violation of these terms.</p>

          <h2>Third-Party Content and Links</h2>
          <p>The Site may contain links to third-party websites and embed content from third parties (e.g., video embeds, social media). We are not responsible for the content, accuracy, or practices of those third parties.</p>

          <h2>Advertising</h2>
          <p>The Gamer Scene displays third-party advertisements. We are not responsible for the content of those advertisements or the products/services they promote. Clicking an advertisement takes you to a third-party site governed by that party's terms.</p>

          <h2>Editorial Independence</h2>
          <p>Advertisers have no influence over editorial content. Review scores, recommendations, and editorial positions are determined solely by The Gamer Scene. Receipt of review codes or press materials does not constitute an obligation to publish positive coverage.</p>

          <h2>Disclaimer of Warranties</h2>
          <p>The Site is provided "as is" without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.</p>

          <h2>Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, The Gamer Scene shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or reliance on any content published here.</p>

          <h2>Changes to These Terms</h2>
          <p>We may update these Terms at any time. The date at the top of this page reflects the last revision. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>

          <h2>Governing Law</h2>
          <p>These Terms are governed by the laws of the United States. Any disputes shall be resolved in the appropriate courts of jurisdiction.</p>

          <h2>Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:contact@thegamerscene.news">contact@thegamerscene.news</a> or visit our <Link href="/contact">Contact page</Link>.</p>

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
          <Link href="/privacy" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>← Back to Issue</Link>
        </div>
      </footer>
    </div>
  )
}
