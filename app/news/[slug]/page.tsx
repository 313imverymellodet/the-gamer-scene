import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsItemBySlug, getAllNewsSlugs, getRelatedNews, getRelatedReviews } from '@/lib/content'
import ReadingProgress from '@/components/ReadingProgress'
import RelatedArticles from '@/components/RelatedArticles'
import ArticleComments from '@/components/ArticleComments'
import ArticleHero from '@/components/ArticleHero'
import ViewCounter from '@/components/ViewCounter'
import ShareButtons from '@/components/ShareButtons'
import JsonLd from '@/components/JsonLd'
import InlineSubscribeCTA from '@/components/InlineSubscribeCTA'
import VideoPlayer from '@/components/VideoPlayer'
import type { Metadata } from 'next'

/** Split bodyHtml after the Nth closing </p> tag and inject a CTA node. */
function injectMidArticleCTA(html: string, afterParagraph = 3): { before: string; after: string } {
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

const BASE = 'https://thegamerscene.news'

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
  const base = 'https://thegamerscene.news'
  return {
    title: `${item.title} — The Gamer Scene`,
    description: item.blurb,
    openGraph: {
      title: item.title,
      description: item.blurb,
      type: 'article',
      url: `${base}/news/${slug}`,
      siteName: 'The Gamer Scene',
      // Next.js auto-generates /news/[slug]/opengraph-image as the OG image
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.blurb,
      site: '@thegamerscene',
      creator: '@rmorris',
    },
    alternates: {
      canonical: `${base}/news/${slug}`,
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

  // Related: same-category news + 1 review (up to 3 total)
  const relatedNews    = getRelatedNews(slug, item.category, 2)
  const relatedReviews = getRelatedReviews(slug, 1)
  const related        = [...relatedNews, ...relatedReviews].slice(0, 3)

  const { before: bodyBefore, after: bodyAfter } = injectMidArticleCTA(item.bodyHtml, 3)

  // Safe ISO date: item.date may be a stringified JS Date from gray-matter
  const isoDate = (() => {
    if (!item.date) return undefined
    // If it looks like YYYY-MM-DD already, use it directly
    const clean = item.date.match(/\d{4}-\d{2}-\d{2}/)
    if (clean) return `${clean[0]}T12:00:00Z`
    try { return new Date(item.date).toISOString() } catch { return undefined }
  })()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.blurb,
    datePublished: isoDate,
    dateModified: isoDate,
    url: `${BASE}/news/${slug}`,
    image: item.image ? `${BASE}${item.image}` : `${BASE}/news/${slug}/opengraph-image`,
    author: { '@type': 'Organization', name: 'The Gamer Scene', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'The Gamer Scene',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/news/${slug}` },
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <JsonLd data={jsonLd} />
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

        {/* Meta + view counter */}
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
          alignItems: 'center',
        }}>
          <Link href="/authors/romello-morris" style={{ color: 'inherit', textDecoration: 'none' }}>
            {item.author}
          </Link>
          {formattedDate && <span>{formattedDate}</span>}
          <ViewCounter
            slug={slug}
            style={{ marginLeft: 'auto', color: 'var(--ink-faint)', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em' }}
          />
        </div>

        {/* Share buttons */}
        <ShareButtons title={item.title} url={`${BASE}/news/${slug}`} />


        {/* Hero image */}
        <div style={{ marginTop: '28px' }}>
          <ArticleHero
            src={item.image}
            alt={item.title}
            category={item.category}
            title={item.title}
          />
        </div>

        {/* Video (if present) */}
        {item.video && (
          <VideoPlayer src={item.video} title={item.title} />
        )}

        {/* Article body — split around mid-article CTA */}
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
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE</span>
        <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Issue
        </Link>
      </footer>
    </div>
  )
}
