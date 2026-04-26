import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReviewBySlug, getAllReviewSlugs, getRelatedNews, getRelatedReviews } from '@/lib/content'
import ReadingProgress from '@/components/ReadingProgress'
import RelatedArticles from '@/components/RelatedArticles'
import ArticleComments from '@/components/ArticleComments'
import ArticleHero from '@/components/ArticleHero'
import type { Metadata } from 'next'

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

  const formattedDate = review.date
    ? new Date(review.date + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const scoreColor = review.hot ? 'var(--hot)' : 'var(--ink)'

  // Related: other reviews + recent news
  const otherReviews  = getRelatedReviews(slug, 1)
  const relatedNews   = getRelatedNews(slug, undefined, 2)  // slug won't match news files, all news eligible
  const related       = [...otherReviews, ...relatedNews].slice(0, 3)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <ReadingProgress />

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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/issues" style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            textDecoration: 'none',
          }}>
            Archive
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
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
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

        {/* Meta bar */}
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
          flexWrap: 'wrap',
        }}>
          <span>{review.author}</span>
          <span>{review.hours}</span>
          {formattedDate && <span>{formattedDate}</span>}
        </div>

        {/* Hero image */}
        <ArticleHero
          src={review.image}
          alt={review.title}
          category="REVIEW"
          title={review.title}
        />

        {/* Review body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: review.bodyHtml }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
          }}
        />

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
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE</span>
        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Issue
        </Link>
      </footer>
    </div>
  )
}
