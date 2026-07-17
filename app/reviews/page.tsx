import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import { formatMonthYear } from '@/lib/date'

export const metadata: Metadata = {
  title: 'Review Index',
  description: 'Every game reviewed by The Gamer Scene, ranked by score, plus research-based review analyses.',
  openGraph: {
    title: 'Review Index — The Gamer Scene',
    description: 'Every game reviewed by The Gamer Scene, ranked by score, plus research-based review analyses.',
  },
}

interface ReviewEntry {
  slug: string
  title: string
  studio: string
  platforms: string[]
  score: number
  pull: string
  author: string
  hours: number
  hot: boolean
  date: string
  image?: string
  analysis: boolean
  consensusScore?: string
}

function getAllReviewEntries(): ReviewEntry[] {
  const dir = path.join(process.cwd(), 'content', 'reviews')
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data } = matter(raw)
      return {
        slug: file.replace('.md', ''),
        title: String(data.title || ''),
        studio: String(data.studio || ''),
        platforms: (data.platforms as string[]) ?? [],
        score: typeof data.score === 'number' ? data.score : 0,
        pull: String(data.pull || ''),
        author: String(data.author || ''),
        hours: typeof data.hours === 'number' ? data.hours : 0,
        hot: Boolean(data.hot),
        date: data.date ? String(data.date) : '',
        image: data.image ? String(data.image) : undefined,
        analysis: Boolean(data.analysis),
        consensusScore: data.consensusScore ? String(data.consensusScore) : undefined,
      }
    })
}

function scoreLabel(score: number): string {
  if (score >= 9.5) return 'ESSENTIAL'
  if (score >= 9.0) return 'OUTSTANDING'
  if (score >= 8.0) return 'GREAT'
  if (score >= 7.0) return 'GOOD'
  if (score >= 6.0) return 'DECENT'
  return 'MIXED'
}

function scoreAccent(score: number, hot: boolean): string {
  if (hot || score >= 9.5) return '#c0392b'
  if (score >= 9.0) return '#e74c3c'
  if (score >= 8.0) return '#e67e22'
  if (score >= 7.0) return '#2980b9'
  return '#7f8c8d'
}

export default function ReviewsPage() {
  const all = getAllReviewEntries()

  // Scored, hands-on reviews are ranked. Analyses are unscored and unranked.
  const scored   = all.filter(r => !r.analysis).sort((a, b) => b.score - a.score)
  const analyses = all.filter(r => r.analysis)
    .sort((a, b) => (b.date > a.date ? 1 : -1))
  const [gold, silver, bronze] = scored

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <SiteHeader active="reviews" />

      <main id="main-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Page header */}
        <div style={{ marginBottom: '48px', borderBottom: '2px solid var(--ink)', paddingBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px',
          }}>
            {scored.length} Scored {scored.length === 1 ? 'Review' : 'Reviews'}
            {analyses.length > 0 && ` · ${analyses.length} Analysis`}
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
          }}>
            Review Index
          </h1>
        </div>

        {/* Podium — top 3 scored */}
        {scored.length >= 1 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              borderBottom: '1px solid var(--rule)', paddingBottom: '12px', marginBottom: '20px',
            }}>
              Top Scores
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}
              className="podium-grid"
            >
              {[gold, silver, bronze].filter(Boolean).map((r, rank) => {
                if (!r) return null
                const accent = scoreAccent(r.score, r.hot)
                const medals = ['◆', '◈', '◇']
                return (
                  <Link key={r.slug} href={`/reviews/${r.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      border: rank === 0 ? `2px solid var(--ink)` : '1px solid var(--rule)',
                      padding: '24px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxSizing: 'border-box',
                      transition: 'box-shadow 0.15s',
                    }}
                      className="podium-card"
                    >
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '16px',
                      }}>
                        <span style={{
                          fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 900,
                          color: accent, lineHeight: 1,
                        }}>{r.score}</span>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: '18px', color: accent,
                        }}>{medals[rank]}</span>
                      </div>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.16em',
                        textTransform: 'uppercase', color: accent, marginBottom: '6px',
                      }}>
                        {scoreLabel(r.score)}
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 800,
                        lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--ink)',
                        margin: '0 0 8px', flex: 1,
                      }}>
                        {r.title}
                      </h3>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--ink-soft)',
                      }}>
                        {r.studio}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Full ranked list — scored only */}
        {scored.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              borderBottom: '1px solid var(--rule)', paddingBottom: '12px', marginBottom: '0',
            }}>
              All Reviews
            </div>

            <div>
              {scored.map((r, i) => {
                const accent = scoreAccent(r.score, r.hot)
                return (
                  <Link key={r.slug} href={`/reviews/${r.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <article style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 80px 1fr auto',
                      gap: '20px',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--rule)',
                      alignItems: 'center',
                      transition: 'background 0.1s',
                    }}
                      className="review-row"
                    >
                      {/* Rank */}
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em',
                        color: 'var(--ink-faint)', textAlign: 'center',
                      }}>
                        #{i + 1}
                      </div>

                      {/* Score */}
                      <div style={{
                        textAlign: 'center',
                        borderRight: `3px solid ${accent}`,
                        paddingRight: '20px',
                      }}>
                        <div style={{
                          fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 900,
                          color: accent, lineHeight: 1,
                        }}>
                          {r.score}
                        </div>
                        <div style={{
                          fontFamily: 'var(--mono)', fontSize: '7px', letterSpacing: '0.14em',
                          textTransform: 'uppercase', color: accent, marginTop: '2px',
                        }}>
                          {scoreLabel(r.score)}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
                        }}>
                          <div style={{
                            fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.12em',
                            textTransform: 'uppercase', color: 'var(--ink-soft)',
                          }}>
                            {r.studio}
                          </div>
                          <div style={{ color: 'var(--rule)', fontSize: '8px' }}>·</div>
                          <div style={{
                            fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.1em',
                            color: 'var(--ink-faint)',
                          }}>
                            {r.platforms.slice(0, 2).join(' · ')}
                          </div>
                        </div>
                        <h3 style={{
                          fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 800,
                          letterSpacing: '-0.01em', lineHeight: 1.2,
                          color: 'var(--ink)', margin: '0 0 6px',
                        }}>
                          {r.title}
                        </h3>
                        <p style={{
                          fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--ink-soft)',
                          lineHeight: 1.4, margin: 0, fontStyle: 'italic',
                        }}>
                          &ldquo;{r.pull.length > 110 ? r.pull.slice(0, 107) + '…' : r.pull}&rdquo;
                        </p>
                      </div>

                      {/* Meta */}
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                        gap: '4px', flexShrink: 0,
                      }}>
                        <div style={{
                          fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.1em',
                          color: 'var(--ink-faint)', textTransform: 'uppercase',
                        }}>
                          {formatMonthYear(r.date)}
                        </div>
                        {r.hours > 0 && (
                          <div style={{
                            fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--ink-faint)',
                          }}>
                            {r.hours}h played
                          </div>
                        )}
                        <div style={{
                          fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: 'var(--ink)', marginTop: '4px',
                        }}>
                          Read →
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Review Analysis — unscored, unranked, research-based */}
        {analyses.length > 0 && (
          <div style={{ marginTop: scored.length > 0 ? '56px' : '0' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              borderBottom: '1px solid var(--rule)', paddingBottom: '12px', marginBottom: '4px',
              display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap',
            }}>
              <span>Review Analysis</span>
              <span style={{ color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'none', fontSize: '9px' }}>
                Research-based critic-consensus — not hands-on TGS scores
              </span>
            </div>

            <div>
              {analyses.map(r => (
                <Link key={r.slug} href={`/reviews/${r.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <article style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '20px',
                    padding: '20px 0',
                    borderBottom: '1px solid var(--rule)',
                    alignItems: 'center',
                    transition: 'background 0.1s',
                  }}
                    className="review-row"
                  >
                    {/* Analysis marker (no score) */}
                    <div style={{
                      borderRight: '3px solid var(--ink-faint)',
                      paddingRight: '20px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--ink-faint)',
                        lineHeight: 1,
                      }}>
                        ◍
                      </div>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '7px', letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--ink-faint)', marginTop: '6px',
                      }}>
                        Analysis
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
                      }}>
                        <div style={{
                          fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: 'var(--ink-soft)',
                        }}>
                          {r.studio}
                        </div>
                        {r.consensusScore && (
                          <>
                            <div style={{ color: 'var(--rule)', fontSize: '8px' }}>·</div>
                            <div style={{
                              fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.06em',
                              color: 'var(--ink-faint)', textTransform: 'none',
                            }}>
                              Critic consensus: {r.consensusScore}
                            </div>
                          </>
                        )}
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 800,
                        letterSpacing: '-0.01em', lineHeight: 1.2,
                        color: 'var(--ink)', margin: '0 0 6px',
                      }}>
                        {r.title}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--ink-soft)',
                        lineHeight: 1.4, margin: 0, fontStyle: 'italic',
                      }}>
                        &ldquo;{r.pull.length > 110 ? r.pull.slice(0, 107) + '…' : r.pull}&rdquo;
                      </p>
                    </div>

                    {/* Meta */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                      gap: '4px', flexShrink: 0,
                    }}>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.1em',
                        color: 'var(--ink-faint)', textTransform: 'uppercase',
                      }}>
                        {formatMonthYear(r.date)}
                      </div>
                      <div style={{
                        fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: 'var(--ink)', marginTop: '4px',
                      }}>
                        Read →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {all.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
          }}>
            No reviews published yet.
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
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/news"    style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>News</Link>
          <Link href="/opinion" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Opinion</Link>
          <Link href="/about"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/"        style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Latest Issue →</Link>
        </div>
      </footer>
    </div>
  )
}
