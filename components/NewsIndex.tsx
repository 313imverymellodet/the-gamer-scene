import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { formatShortDate } from '@/lib/date'
import {
  NEWS_CATEGORIES,
  newsIndexPath,
  type NewsArchiveItem,
  type NewsCategory,
} from '@/lib/news-index'

interface Props {
  articles: NewsArchiveItem[]
  category: NewsCategory
  page: number
  total: number
  totalPages: number
  startIndex: number
}

export default function NewsIndex({
  articles,
  category,
  page,
  total,
  totalPages,
  startIndex,
}: Props) {
  const newerHref = page > 1 ? newsIndexPath(page - 1, category) : null
  const olderHref = page < totalPages ? newsIndexPath(page + 1, category) : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <SiteHeader active="news" />

      <main id="main-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '40px', borderBottom: '2px solid var(--ink)', paddingBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px',
          }}>
            The Gamer Scene · News Archive
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05,
            margin: '0 0 12px', color: 'var(--ink)',
          }}>
            News
          </h1>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '1rem', lineHeight: 1.6,
            color: 'var(--ink-soft)', margin: 0, maxWidth: '560px',
          }}>
            Industry moves, game announcements, updates, and everything else worth knowing. No filler.
          </p>
        </div>

        <nav aria-label="News categories" style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px',
        }}>
          {NEWS_CATEGORIES.map(cat => {
            const active = category === cat
            return (
              <Link
                key={cat}
                href={newsIndexPath(1, cat)}
                aria-current={active ? 'page' : undefined}
                style={{
                  fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', padding: '5px 12px',
                  border: '1.5px solid',
                  borderColor: active ? 'var(--ink)' : 'var(--rule)',
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--bg)' : 'var(--ink-soft)',
                  textDecoration: 'none',
                }}
              >
                {cat}
              </Link>
            )
          })}
        </nav>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '16px',
        }}>
          {total} {total === 1 ? 'article' : 'articles'}
          {category !== 'All' && ` · ${category}`}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </div>

        {articles.length === 0 ? (
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)' }}>
            No articles in this category yet.
          </p>
        ) : (
          <div>
            {articles.map((article, i) => {
              const dateLabel = formatShortDate(article.date)
              return (
                <Link
                  key={article.slug}
                  href={article.href}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr auto',
                    gap: '20px',
                    padding: '20px 0',
                    borderBottom: '1px solid oklch(from var(--rule) l c h / 0.3)',
                    alignItems: 'start',
                  }}>
                    <div style={{
                      fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 900,
                      lineHeight: 1, color: 'var(--ink-faint)', fontFeatureSettings: '"tnum"',
                      paddingTop: '2px',
                    }}>
                      {String(startIndex + i + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <h2 style={{
                        fontFamily: 'var(--serif)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.015em',
                        color: 'var(--ink)', margin: '0 0 6px',
                      }}>
                        {article.title}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.85rem',
                        lineHeight: 1.45, color: 'var(--ink-soft)', margin: 0,
                      }}>
                        {article.blurb}
                      </p>
                    </div>

                    <div style={{
                      textAlign: 'right', display: 'flex', flexDirection: 'column',
                      gap: '6px', alignItems: 'flex-end', flexShrink: 0,
                    }}>
                      {article.category && (
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
                          textTransform: 'uppercase', padding: '2px 7px',
                          background: 'var(--bg-alt)', border: '1px solid var(--rule)',
                          color: 'var(--ink-soft)',
                        }}>
                          {article.category}
                        </span>
                      )}
                      {dateLabel && (
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.08em',
                          color: 'var(--ink-faint)',
                        }}>
                          {dateLabel}
                        </span>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="News pages" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '12px', marginTop: '32px', flexWrap: 'wrap',
          }}>
            {newerHref ? (
              <Link href={newerHref} rel="prev" style={pagerLinkStyle}>← Newer</Link>
            ) : <span style={pagerSpacerStyle} />}
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
            }}>
              Page {page} of {totalPages}
            </span>
            {olderHref ? (
              <Link href={olderHref} rel="next" style={pagerLinkStyle}>Older →</Link>
            ) : <span style={pagerSpacerStyle} />}
          </nav>
        )}
      </main>

      <footer style={{
        borderTop: '2px solid var(--ink)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--ink-faint)',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontWeight: 700 }}>© 2026 THE GAMER SCENE</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/about"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/privacy" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/"        style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Latest Issue →</Link>
        </div>
      </footer>
    </div>
  )
}

const pagerLinkStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '9px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  padding: '8px 14px',
  border: '1.5px solid var(--ink)',
  color: 'var(--ink)',
  textDecoration: 'none',
}

const pagerSpacerStyle = { minWidth: '88px' }
