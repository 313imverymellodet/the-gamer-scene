import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Issue Archive',
  description: 'Every issue of The Gamer Scene — the independent weekly gaming publication.',
}

interface IssueMeta {
  number: string
  date: string
  weekday: string
  readTime: string
  subscribers: string
}

interface IssueLead {
  kicker: string
  title: string
  dek: string
  tag: string
  image?: string
  readLink?: string
}

interface IssueEntry {
  issue: IssueMeta
  lead: IssueLead
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '')
}

async function getAllIssues(): Promise<IssueEntry[]> {
  const issuesDir = path.join(process.cwd(), 'content', 'issues')
  const files = fs.readdirSync(issuesDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse() // newest first

  return files.map(f => {
    const raw = fs.readFileSync(path.join(issuesDir, f), 'utf-8')
    const data = JSON.parse(raw)
    return { issue: data.issue, lead: data.lead } as IssueEntry
  })
}

export default async function ArchivePage() {
  const issues = await getAllIssues()
  const [latest, ...older] = issues

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
          ← Latest Issue
        </Link>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px 80px' }}>
        {/* Page title */}
        <div style={{ marginBottom: '48px', borderBottom: '2px solid var(--ink)', paddingBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            marginBottom: '8px',
          }}>
            Vol. VII · {issues.length} Issues Published
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Issue Archive
          </h1>
        </div>

        {/* Latest issue — hero card */}
        {latest && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              marginBottom: '16px',
            }}>
              Latest Issue
            </div>
            <Link href={`/issues/${latest.issue.number}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '2px solid var(--ink)',
                transition: 'box-shadow 0.15s',
              }}
                className="archive-hero"
              >
                {/* Image pane */}
                <div style={{
                  background: 'var(--bg-alt)',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {latest.lead.image ? (
                    <img
                      src={latest.lead.image}
                      alt={stripHtml(latest.lead.title)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--serif)', fontSize: '4rem', fontWeight: 900, color: 'var(--rule)',
                    }}>
                      №{latest.issue.number}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.15em',
                    background: 'var(--ink)', color: 'var(--bg)', padding: '3px 8px',
                  }}>
                    {latest.lead.tag}
                  </div>
                </div>

                {/* Text pane */}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px',
                  }}>
                    Issue №{latest.issue.number} · {latest.issue.date}
                  </div>
                  <div style={{
                    fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--ink-soft)', marginBottom: '12px',
                  }}>
                    {latest.lead.kicker}
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--serif)', fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
                    fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em',
                    margin: '0 0 16px', color: 'var(--ink)',
                  }}
                    dangerouslySetInnerHTML={{ __html: latest.lead.title }}
                  />
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.875rem', lineHeight: 1.6,
                    color: 'var(--ink-soft)', margin: '0 0 24px',
                  }}>
                    {latest.lead.dek}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: 'var(--ink)', color: 'var(--bg)', padding: '8px 16px',
                    }}>
                      Read Issue →
                    </span>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
                      color: 'var(--ink-soft)',
                    }}>
                      {latest.issue.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Older issues grid */}
        {older.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              borderBottom: '1px solid var(--rule)',
              paddingBottom: '12px',
              marginBottom: '24px',
            }}>
              Previous Issues
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
            }}
              className="archive-grid"
            >
              {older.map(entry => (
                <Link
                  key={entry.issue.number}
                  href={`/issues/${entry.issue.number}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{
                    border: '1px solid var(--rule)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                    className="archive-card"
                  >
                    {/* Cover art */}
                    <div style={{
                      background: 'var(--bg-alt)',
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                    }}>
                      {entry.lead.image ? (
                        <img
                          src={entry.lead.image}
                          alt={stripHtml(entry.lead.title)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--rule)',
                        }}>
                          №{entry.issue.number}
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.14em',
                        background: 'var(--ink)', color: 'var(--bg)', padding: '2px 6px',
                      }}>
                        {entry.lead.tag}
                      </div>
                    </div>

                    {/* Text */}
                    <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.16em',
                        textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px',
                      }}>
                        Issue №{entry.issue.number} · {entry.issue.date}
                      </div>
                      <div style={{
                        fontFamily: 'var(--sans)', fontSize: '0.65rem', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--ink-soft)', marginBottom: '6px',
                      }}>
                        {entry.lead.kicker}
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--serif)', fontSize: '0.95rem',
                        fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em',
                        margin: '0 0 auto', color: 'var(--ink)',
                      }}
                        dangerouslySetInnerHTML={{ __html: entry.lead.title }}
                      />
                      <div style={{
                        marginTop: '14px',
                        fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)',
                      }}>
                        Read Issue →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
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
        <span style={{ fontWeight: 700 }}>© 2026 THE GAMER SCENE</span>
        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>
          ← Latest Issue
        </Link>
      </footer>
    </div>
  )
}
