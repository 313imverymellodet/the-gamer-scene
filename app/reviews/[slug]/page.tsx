import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReviewBySlug, getAllReviewSlugs, getRelatedNews, getRelatedReviews } from '@/lib/content'
import ReadingProgress from '@/components/ReadingProgress'
import RelatedArticles from '@/components/RelatedArticles'
import ArticleComments from '@/components/ArticleComments'
import ArticleHero from '@/components/ArticleHero'
import ViewCounter from '@/components/ViewCounter'
import ShareButtons from '@/components/ShareButtons'
import JsonLd from '@/components/JsonLd'
import InlineSubscribeCTA from '@/components/InlineSubscribeCTA'
import VideoPlayer from '@/components/VideoPlayer'
import SiteHeader from '@/components/SiteHeader'
import type { Metadata } from 'next'

const MIN_PARAGRAPHS_FOR_CTA = 7

function injectMidArticleCTA(html: string, afterParagraph = 4): { before: string; after: string } {
  let count = 0
  let idx = -1
  let search = 0
  while (count < afterParagraph) {
    const found = html.indexOf('</p>', search)
    if (found === -1) break
    count++
    idx = found + 4
    search = idx
  }
  if (idx === -1 || count < afterParagraph) return { before: html, after: '' }
  return { before: html.slice(0, idx), after: html.slice(idx) }
}

function countParagraphs(html: string): number {
  return (html.match(/<\/p>/g) ?? []).length
}

const BASE = 'https://thegamerscene.news'

export async function generateStaticParams() {
  return getAllReviewSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const review = getReviewBySlug(slug)
  if (!review) return {}
  const base = 'https://thegamerscene.news'
  return {
    title: `${review.title} Review — The Gamer Scene`,
    description: review.pull,
    openGraph: {
      title: `${review.title} Review — ${review.score}/10`,
      description: review.pull,
      type: 'article',
      url: `${base}/reviews/${slug}`,
      siteName: 'The Gamer Scene',
      // Next.js auto-generates /reviews/[slug]/opengraph-image as the OG image
    },
    twitter: {
      card: 'summary_large_image',
      title: `${review.title} Review — ${review.score}/10`,
      description: review.pull,
      site: '@thegamerscene',
      creator: '@rmorris',
    },
    alternates: {
      canonical: `${base}/reviews/${slug}`,
    },
  }
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const review = getReviewBySlug(slug)
  if (!review) notFound()

  const formattedDate = (() => {
    if (!review.date) return ''
    const clean = review.date.match(/\d{4}-\d{2}-\d{2}/)
    const d = clean ? new Date(clean[0] + 'T12:00:00') : new Date(review.date)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  })()

  const scoreColor = review.hot ? 'var(--hot)' : 'var(--ink)'

  // Related: other reviews + recent news
  const otherReviews  = getRelatedReviews(slug, 1)
  const relatedNews   = getRelatedNews(slug, undefined, 2)
  const related       = [...otherReviews, ...relatedNews].slice(0, 3)

  const { before: bodyBefore, after: bodyAfter } =
    countParagraphs(review.bodyHtml) >= MIN_PARAGRAPHS_FOR_CTA
      ? injectMidArticleCTA(review.bodyHtml, 4)
      : { before: review.bodyHtml, after: '' }

  const isoDate = (() => {
    if (!review.date) return undefined
    const clean = review.date.match(/\d{4}-\d{2}-\d{2}/)
    if (clean) return `${clean[0]}T12:00:00Z`
    try { return new Date(review.date).toISOString() } catch { return undefined }
  })()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${review.title} Review`,
    url: `${BASE}/reviews/${slug}`,
    datePublished: isoDate,
    reviewBody: review.pull,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(review.score),
      bestRating: '10',
      worstRating: '0',
    },
    itemReviewed: {
      '@type': 'VideoGame',
      name: review.title,
      author: { '@type': 'Organization', name: review.studio },
      applicationCategory: 'Game',
      operatingSystem: review.platforms.join(', '),
    },
    author: {
      '@type': 'Person',
      name: review.author,
      worksFor: { '@type': 'Organization', name: 'The Gamer Scene', url: BASE },
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Gamer Scene',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` },
    },
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <JsonLd data={jsonLd} />
      <ReadingProgress />
      <SiteHeader active="reviews" />

      <main id="main-content" style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* REVIEW badge */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            Review
          </span>
          <span style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.72rem',
            color: 'var(--ink-faint)',
            fontWeight: 500,
          }}>
            {review.studio}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          margin: '0 0 20px',
          color: 'var(--ink)',
        }}>
          {review.title}
        </h1>

        {/* Score + platforms row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          margin: '0 0 20px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontFamily: 'var(--serif)',
              fontSize: '3rem',
              fontWeight: 900,
              lineHeight: 1,
              color: scoreColor,
            }}>
              {review.score}
            </span>
            <span style={{
              fontFamily: 'var(--sans)',
              fontSize: '1rem',
              color: 'var(--ink-faint)',
              fontWeight: 500,
            }}>
              / 10
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {review.platforms.map(p => (
              <span key={p} style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid var(--ink)',
                padding: '2px 7px',
                color: 'var(--ink)',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Pull quote */}
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.1rem',
          lineHeight: 1.55,
          fontStyle: 'italic',
          color: 'var(--ink-soft)',
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '16px',
          margin: '0 0 24px',
        }}>
          &ldquo;{review.pull}&rdquo;
        </p>

        {/* Quick Verdict box */}
        <aside className="verdict-box" aria-label="Quick verdict">
          <div className="verdict-box-head">
            <span className="verdict-box-label">Quick Verdict</span>
            <span>
              <span className={`verdict-score${review.hot ? ' hot' : ''}`}>{review.score}</span>
              <span className="verdict-score-denom">/ 10</span>
            </span>
          </div>
          <div className="verdict-grid">
            <div className="verdict-cell">
              <div className="verdict-cell-label">Developer</div>
              <div className="verdict-cell-value">{review.studio}</div>
            </div>
            <div className="verdict-cell">
              <div className="verdict-cell-label">Time Played</div>
              <div className="verdict-cell-value">{review.hours}</div>
            </div>
            <div className="verdict-cell" style={{ gridColumn: 'span 2' }}>
              <div className="verdict-cell-label">Platforms</div>
              <div className="verdict-platforms">
                {review.platforms.map(p => (
                  <span key={p} className="verdict-platform-chip">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Meta bar + view counter */}
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
          margin: '0 0 0',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <Link href="/authors/romello-morris" style={{ color: 'inherit', textDecoration: 'none' }}>
            {review.author}
          </Link>
          <span>{review.hours}</span>
          {formattedDate && <span>{formattedDate}</span>}
          <ViewCounter
            slug={slug}
            style={{ marginLeft: 'auto', color: 'var(--ink-faint)', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em' }}
          />
        </div>

        {/* Share buttons */}
        <ShareButtons title={review.title} url={`${BASE}/reviews/${slug}`} />

        {/* Hero image */}
        <div style={{ marginTop: '28px' }}>
          <ArticleHero
            src={review.image}
            alt={review.title}
            category="REVIEW"
            title={review.title}
          />
        </div>

        {/* Video (if present) */}
        {review.video && (
          <VideoPlayer src={review.video} title={review.title} />
        )}

        {/* Review body — split around mid-article CTA */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: bodyBefore }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
          }}
        />
        {bodyAfter && <InlineSubscribeCTA />}
        {bodyAfter && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: bodyAfter }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--ink)',
            }}
          />
        )}

        {/* Related articles */}
        <RelatedArticles items={related} heading="More From The Gamer Scene" />

        {/* Comments */}
        <ArticleComments issueContext={slug} />
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
          <Link href="/news"    style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>News</Link>
          <Link href="/reviews" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Reviews</Link>
          <Link href="/opinion" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Opinion</Link>
          <Link href="/about"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/privacy" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </div>
  )
}
