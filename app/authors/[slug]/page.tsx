import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Metadata } from 'next'

interface AuthorData {
  slug: string
  name: string
  initials: string
  role: string
  bio: string
  location: string
  since: string
  social: { twitter?: string; bluesky?: string; newsletter?: string }
  stats: { reviewsPublished: number; articlesPublished: number; yearsActive: number }
}

interface ArticleEntry {
  slug: string
  title: string
  blurb: string
  category: string
  date: string
  type: 'news' | 'review'
  score?: number
  href: string
}

function getAuthor(slug: string): AuthorData | null {
  const file = path.join(process.cwd(), 'content', 'authors', `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as AuthorData
}

function getAuthorArticles(authorName: string): ArticleEntry[] {
  const contentDir = path.join(process.cwd(), 'content')
  const articles: ArticleEntry[] = []

  // News — default author to the publication owner since frontmatter lacks author field
  const newsDir = path.join(contentDir, 'news')
  if (fs.existsSync(newsDir)) {
    for (const file of fs.readdirSync(newsDir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const { data } = matter(raw)
      const fileAuthor = data.author ? String(data.author) : 'Romello Morris'
      if (fileAuthor.toLowerCase().includes(authorName.split(' ')[0].toLowerCase())) {
        const slug = file.replace('.md', '')
        articles.push({
          slug,
          title: String(data.title || ''),
          blurb: String(data.blurb || ''),
          category: String(data.category || 'NEWS'),
          date: data.date ? String(data.date) : '',
          type: 'news',
          href: `/news/${slug}`,
        })
      }
    }
  }

  // Reviews
  const reviewsDir = path.join(contentDir, 'reviews')
  if (fs.existsSync(reviewsDir)) {
    for (const file of fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      const fileAuthor = data.author ? String(data.author) : ''
      if (!fileAuthor || fileAuthor.toLowerCase().includes(authorName.split(' ')[0].toLowerCase())) {
        const slug = file.replace('.md', '')
        articles.push({
          slug,
          title: String(data.title || ''),
          blurb: String(data.pull || data.blurb || ''),
          category: 'REVIEW',
          date: data.date ? String(data.date) : '',
          type: 'review',
          score: typeof data.score === 'number' ? data.score : undefined,
          href: `/reviews/${slug}`,
        })
      }
    }
  }

  return articles.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da
  })
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'authors')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ slug: f.replace('.json', '') }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) return {}
  return {
    title: `${author.name} — The Gamer Scene`,
    description: author.bio,
    openGraph: {
      title: `${author.name} — ${author.role}`,
      description: author.bio,
      type: 'profile',
    },
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()

  const articles = getAuthorArticles(author.name)
  const reviews  = articles.filter(a => a.type === 'review')
  const news     = articles.filter(a => a.type === 'news')

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

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Author hero */}
        <div className="author-hero">
          {/* Avatar */}
          <div className="author-avatar">
            {author.initials}
          </div>

          {/* Info */}
          <div className="author-info">
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px',
            }}>
              Staff · Since {author.since}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05,
              margin: '0 0 6px', color: 'var(--ink)',
            }}>
              {author.name}
            </h1>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--ink-soft)', marginBottom: '16px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {author.role}
            </div>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: '1rem', lineHeight: 1.7,
              color: 'var(--ink)', margin: '0 0 20px', maxWidth: '560px',
            }}>
              {author.bio}
            </p>

            {/* Stats row */}
            <div className="author-stats">
              <div className="author-stat">
                <span className="author-stat-num">{articles.length}</span>
                <span className="author-stat-label">Published</span>
              </div>
              <div className="author-stat">
                <span className="author-stat-num">{reviews.length}</span>
                <span className="author-stat-label">Reviews</span>
              </div>
              <div className="author-stat">
                <span className="author-stat-num">{author.stats.yearsActive}</span>
                <span className="author-stat-label">Years</span>
              </div>
            </div>

            {/* Social links */}
            <div className="author-social">
              {author.social.twitter && (
                <a href={author.social.twitter} target="_blank" rel="noopener noreferrer"
                  className="author-social-link">
                  𝕏 Twitter
                </a>
              )}
              {author.social.bluesky && (
                <a href={author.social.bluesky} target="_blank" rel="noopener noreferrer"
                  className="author-social-link">
                  🦋 Bluesky
                </a>
              )}
              {author.social.newsletter && (
                <a href={author.social.newsletter} target="_blank" rel="noopener noreferrer"
                  className="author-social-link">
                  ✉ Newsletter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews by this author */}
        {reviews.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              borderBottom: '2px solid var(--ink)', paddingBottom: '12px',
              marginBottom: '20px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span>Reviews</span>
              <span style={{ color: 'var(--ink-faint)' }}>{reviews.length} total</span>
            </div>
            <div className="author-reviews-grid">
              {reviews.map(r => (
                <Link key={r.slug} href={r.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article className="author-review-card">
                    <div style={{
                      fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 900,
                      color: r.score && r.score >= 9 ? 'var(--hot)' : 'var(--ink)',
                      lineHeight: 1, marginBottom: '4px',
                    }}>
                      {r.score}
                    </div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--hot)', marginBottom: '8px',
                    }}>
                      /10
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 800,
                      lineHeight: 1.25, color: 'var(--ink)', margin: '0 0 8px',
                    }}>
                      {r.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'var(--ink-soft)',
                      lineHeight: 1.4, margin: 0, fontStyle: 'italic',
                    }}>
                      &ldquo;{r.blurb.length > 80 ? r.blurb.slice(0, 77) + '…' : r.blurb}&rdquo;
                    </p>
                    <div style={{
                      marginTop: '12px', fontFamily: 'var(--sans)', fontSize: '0.68rem',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: 'var(--ink)',
                    }}>
                      Read Review →
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* News articles */}
        {news.length > 0 && (
          <section>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              borderBottom: '2px solid var(--ink)', paddingBottom: '12px',
              marginBottom: '0', display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span>Articles</span>
              <span style={{ color: 'var(--ink-faint)' }}>{news.length} total</span>
            </div>
            <div>
              {news.map((article, i) => (
                <Link key={article.slug} href={article.href}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <article style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr auto',
                    gap: '16px',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--rule)',
                    alignItems: 'start',
                    transition: 'background 0.1s',
                  }}
                    className="author-article-row"
                  >
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-faint)',
                      letterSpacing: '0.06em', paddingTop: '3px',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '5px',
                      }}>
                        {article.category}
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700,
                        lineHeight: 1.25, color: 'var(--ink)', margin: '0 0 4px',
                      }}>
                        {article.title}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--ink-soft)',
                        lineHeight: 1.4, margin: 0,
                      }}>
                        {article.blurb.length > 100 ? article.blurb.slice(0, 97) + '…' : article.blurb}
                      </p>
                    </div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--ink-faint)',
                      letterSpacing: '0.08em', whiteSpace: 'nowrap', paddingTop: '3px',
                    }}>
                      {article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
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
