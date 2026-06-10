'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import type { SearchItem } from '@/app/api/search/route'

const CATEGORIES = ['All', 'Industry', 'Update', 'Reveal', 'Rumor', 'Poll']

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  // Try ISO date pattern first (YYYY-MM-DD)
  const iso = dateStr.match(/\d{4}-\d{2}-\d{2}/)
  const d = iso ? new Date(iso[0] + 'T12:00:00') : new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NewsIndexPage() {
  const [articles, setArticles] = useState<SearchItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')

  useEffect(() => {
    fetch('/api/search')
      .then(r => r.json())
      .then((data: SearchItem[]) => {
        setArticles(data.filter(d => d.type === 'news'))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'All') return articles
    return articles.filter(a => a.category?.toLowerCase() === filter.toLowerCase())
  }, [articles, filter])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <SiteHeader active="news" />

      <main id="main-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Page header */}
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

        {/* Category filter */}
        <div style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '5px 12px',
                border: '1.5px solid',
                borderColor: filter === cat ? 'var(--ink)' : 'var(--rule)',
                background: filter === cat ? 'var(--ink)' : 'transparent',
                color: filter === cat ? 'var(--bg)' : 'var(--ink-soft)',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article count */}
        {!loading && (
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '16px',
          }}>
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            {filter !== 'All' && ` · ${filter}`}
          </div>
        )}

        {/* Article list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                height: '88px', background: 'var(--rule)',
                borderBottom: '2px solid var(--bg)',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.07}s`,
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)' }}>
            No articles in this category yet.
          </p>
        ) : (
          <div>
            {filtered.map((article, i) => (
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
                  transition: 'background 0.12s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-alt)'; (e.currentTarget as HTMLElement).style.marginLeft = '-8px'; (e.currentTarget as HTMLElement).style.paddingLeft = '8px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.marginLeft = ''; (e.currentTarget as HTMLElement).style.paddingLeft = ''; }}
                >
                  {/* Index number */}
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 900,
                    lineHeight: 1, color: 'var(--ink-faint)', fontFeatureSettings: '"tnum"',
                    paddingTop: '2px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Body */}
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

                  {/* Meta */}
                  <div style={{
                    textAlign: 'right', display: 'flex', flexDirection: 'column',
                    gap: '6px', alignItems: 'flex-end', flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
                      textTransform: 'uppercase', padding: '2px 7px',
                      background: 'var(--bg-alt)', border: '1px solid var(--rule)',
                      color: 'var(--ink-soft)',
                    }}>
                      {article.category}
                    </span>
                    {article.date && (
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.08em',
                        color: 'var(--ink-faint)',
                      }}>
                        {formatDate(article.date)}
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
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
