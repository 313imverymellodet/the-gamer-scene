import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — The Gamer Scene',
  description: 'Get in touch with The Gamer Scene. Press inquiries, review code submissions, tips, and general contact.',
}

export default function ContactPage() {
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
          Contact
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}>
          Get in Touch
        </h1>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '1rem',
          color: 'var(--ink-soft)',
          margin: '0 0 48px',
          lineHeight: 1.6,
        }}>
          Whether you're a developer, PR rep, reader, or fellow writer — here's how to reach us.
        </p>

        {/* Contact cards */}
        {[
          {
            label: 'General Inquiries',
            description: 'Questions, feedback, or anything else.',
            email: 'contact@thegamerscene.news',
          },
          {
            label: 'Review Code Submissions',
            description: 'Sending a game for coverage? Include a press kit, key platforms, and release date.',
            email: 'reviews@thegamerscene.news',
          },
          {
            label: 'Tips & News',
            description: 'Got a scoop? We protect sources. Reach out confidentially.',
            email: 'tips@thegamerscene.news',
          },
          {
            label: 'Advertising',
            description: 'Sponsorship and advertising inquiries for the newsletter and site.',
            email: 'advertising@thegamerscene.news',
          },
        ].map(card => (
          <div
            key={card.label}
            style={{
              borderTop: '1px solid var(--rule)',
              padding: '24px 0',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-faint)',
                marginBottom: '4px',
              }}>
                {card.label}
              </div>
              <p style={{
                fontFamily: 'var(--serif)',
                fontSize: '1rem',
                margin: 0,
                color: 'var(--ink-soft)',
                lineHeight: 1.5,
              }}>
                {card.description}
              </p>
            </div>
            <a
              href={`mailto:${card.email}`}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'var(--ink)',
                color: 'var(--bg)',
                padding: '8px 16px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Email →
            </a>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '32px', marginTop: '8px' }}>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            color: 'var(--ink-faint)',
            lineHeight: 1.6,
            margin: '0 0 16px',
          }}>
            <strong style={{ color: 'var(--ink-soft)' }}>Newsletter</strong> — The fastest way to stay current is through our Substack. Issues drop weekly.
          </p>
          <Link
            href="https://thegamerscenedaily.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--sans)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '2px solid var(--ink)',
              color: 'var(--ink)',
              padding: '8px 16px',
              textDecoration: 'none',
            }}
          >
            Subscribe on Substack →
          </Link>
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
          <Link href="/terms" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Terms</Link>
          <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>← Back to Issue</Link>
        </div>
      </footer>
    </div>
  )
}
