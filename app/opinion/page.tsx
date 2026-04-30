import Link from 'next/link'
import { getAllOpinionItems } from '@/lib/content'
import type { Metadata } from 'next'

const BASE = 'https://thegamerscene.news'

export const metadata: Metadata = {
  title: 'Opinion — The Gamer Scene',
  description: 'Takes, arguments, and analysis from The Gamer Scene editorial team.',
  openGraph: {
    title: 'Opinion — The Gamer Scene',
    description: 'Takes, arguments, and analysis from The Gamer Scene editorial team.',
    type: 'website',
    url: `${BASE}/opinion`,
    siteName: 'The Gamer Scene',
  },
  alternates: { canonical: `${BASE}/opinion` },
}

export default function OpinionIndexPage() {
  const pieces = getAllOpinionItems()

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
          fontFamily: 'var(--serif)', fontWeight: 900, fontSize: '1.1rem',
          letterSpacing: '-0.02em', color: 'var(--ink)', textDecoration: 'none',
        }}>
          THE GAMER SCENE
        </Link>
        <Link href="/" style={{
          fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', textDecoration: 'none',
        }}>
          ← Latest Issue
        </Link>
      </header>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '48px', borderBottom: '2px solid var(--ink)', paddingBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px',
          }}>
            The Gamer Scene · Editorial
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05,
            margin: '0 0 12px', color: 'var(--ink)',
          }}>
            Opinion
          </h1>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '1rem', lineHeight: 1.6,
            color: 'var(--ink-soft)', margin: 0, maxWidth: '560px',
          }}>
            Takes, arguments, and analysis. Not news — perspective. Every piece is signed and stands behind a byline.
          </p>
        </div>

        {/* Opinion list */}
        {pieces.length === 0 ? (
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)' }}>No opinion pieces yet.</p>
        ) : (
          <div>
            {pieces.map((piece, i) => {
              const formattedDate = piece.date
                ? (() => {
                    const clean = piece.date.match(/\d{4}-\d{2}-\d{2}/)
                    if (clean) return new Date(clean[0] + 'T12:00:00').toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })
                    return piece.date
                  })()
                : ''

              return (
                <Link
                  key={piece.slug}
                  href={`/opinion/${piece.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article className="opinion-list-item">
                    {/* Number */}
                    <div className="opinion-list-num">
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Body */}
                    <div className="opinion-list-body">
                      <div className="opinion-list-meta">
                        <span className="opinion-chip">Opinion</span>
                        {formattedDate && (
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: '8px',
                            color: 'var(--ink-faint)', letterSpacing: '0.08em',
                          }}>
                            {formattedDate}
                          </span>
                        )}
                      </div>
                      <h2 style={{
                        fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                        fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em',
                        color: 'var(--ink)', margin: '0 0 8px',
                      }}>
                        {piece.title}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.875rem',
                        lineHeight: 1.5, color: 'var(--ink-soft)', margin: '0 0 10px',
                      }}>
                        {piece.blurb}
                      </p>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--ink-soft)',
                      }}>
                        By {piece.author} · Read →
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <footer style={{
        borderTop: '2px solid var(--ink)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--ink-faint)',
      }}>
        <span style={{ fontWeight: 700 }}>© 2026 THE GAMER SCENE</span>
        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>
          ← Latest Issue
        </Link>
      </footer>
    </div>
  )
}
