import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — The Gamer Scene',
  description: 'The Gamer Scene is an independent gaming publication covering reviews, news, and criticism. Founded in 2013 by Romello Morris.',
}

export default function AboutPage() {
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
        {/* Kicker */}
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
          About
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 32px',
        }}>
          An Independent Voice in Gaming Since 2013
        </h1>

        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          color: 'var(--ink)',
        }}>
          <p style={{ margin: '0 0 1.4em' }}>
            <strong>The Gamer Scene</strong> is an independent gaming publication founded in 2013. We cover video game reviews, breaking news, previews, and criticism — written for people who take games seriously but don't take themselves too seriously.
          </p>

          <p style={{ margin: '0 0 1.4em' }}>
            The publication has been through several eras since 2013, each one shaped by where games were at the time. The current volume launched in 2026 with a simple mandate: publish honest, well-written coverage of the games that matter, with no corporate agenda and no review score inflation.
          </p>

          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '2em 0 0.6em',
            borderBottom: '1px solid var(--rule)',
            paddingBottom: '8px',
          }}>
            Who We Are
          </h2>

          <p style={{ margin: '0 0 1.4em' }}>
            The Gamer Scene is written and edited by <strong>Romello Morris</strong>, Editor-in-Chief. Every review, news article, and opinion piece published here is written with the reader's time in mind — we won't waste it with filler, sponsored takes, or scores that don't mean anything.
          </p>

          <p style={{ margin: '0 0 1.4em' }}>
            We publish weekly issues covering the games you're playing, the news that actually matters, and the stories the rest of the gaming press either misses or buries.
          </p>

          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '2em 0 0.6em',
            borderBottom: '1px solid var(--rule)',
            paddingBottom: '8px',
          }}>
            Our Review Policy
          </h2>

          <p style={{ margin: '0 0 1.4em' }}>
            Scores are out of 10, rounded to one decimal place. A 7.0 means good. An 8.0 means great. A 9.0+ means essential. We don't give 10s lightly, and we don't inflate scores to maintain press relationships.
          </p>

          <p style={{ margin: '0 0 1.4em' }}>
            Review codes accepted from publishers are disclosed at the bottom of every review. Accepting a code has no influence on the score. If we think a game is bad, we'll say so clearly.
          </p>

          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '2em 0 0.6em',
            borderBottom: '1px solid var(--rule)',
            paddingBottom: '8px',
          }}>
            Stay Connected
          </h2>

          <p style={{ margin: '0 0 1.4em' }}>
            The best way to follow The Gamer Scene is through our newsletter on Substack. Every issue lands directly in your inbox — no algorithm, no feed, just the publication.
          </p>

          <p style={{ margin: '0 0 1.4em' }}>
            For press inquiries, review code submissions, or tips, reach us at{' '}
            <a
              href="mailto:contact@thegamerscene.news"
              style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              contact@thegamerscene.news
            </a>
          </p>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--rule)' }}>
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
                background: 'var(--ink)',
                color: 'var(--bg)',
                padding: '10px 20px',
                textDecoration: 'none',
                marginRight: '12px',
              }}
            >
              Subscribe on Substack →
            </Link>
            <Link
              href="/contact"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--sans)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '2px solid var(--ink)',
                color: 'var(--ink)',
                padding: '8px 20px',
                textDecoration: 'none',
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
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
          <Link href="/privacy" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Terms</Link>
          <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>← Back to Issue</Link>
        </div>
      </footer>
    </div>
  )
}
