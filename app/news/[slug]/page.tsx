import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsItemBySlug, getAllNewsSlugs } from '@/lib/content'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllNewsSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getNewsItemBySlug(slug)
  if (!item) return {}
  return {
    title: `${item.title} — The Gamer Scene`,
    description: item.blurb,
    openGraph: {
      title: item.title,
      description: item.blurb,
      images: item.image ? [item.image] : [],
    },
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getNewsItemBySlug(slug)
  if (!item) notFound()

  const formattedDate = item.date
    ? new Date(item.date + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Site header */}
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
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Back to Issue
        </Link>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Category chip */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'var(--ink)',
            color: 'var(--bg)',
            padding: '3px 8px',
          }}>
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          margin: '0 0 16px',
          color: 'var(--ink)',
        }}>
          {item.title}
        </h1>

        {/* Blurb */}
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '1.05rem',
          lineHeight: 1.5,
          color: 'var(--ink-soft)',
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '16px',
          margin: '0 0 24px',
        }}>
          {item.blurb}
        </p>

        {/* Meta */}
        <div style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
          padding: '10px 0',
          margin: '0 0 32px',
          display: 'flex',
          gap: '16px',
        }}>
          <span>The Gamer Scene</span>
          {formattedDate && <span>{formattedDate}</span>}
        </div>

        {/* Hero image */}
        {item.image && (
          <div style={{ margin: '0 0 36px', lineHeight: 0 }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        )}

        {/* Article body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
          }}
        />
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
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE</span>
        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Issue
        </Link>
      </footer>
    </div>
  )
}
