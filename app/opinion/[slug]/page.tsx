import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOpinionBySlug, getAllOpinionSlugs, getRelatedNews } from '@/lib/content'
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

const BASE = 'https://thegamerscene.news'

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

export async function generateStaticParams() {
  return getAllOpinionSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const piece = getOpinionBySlug(slug)
  if (!piece) return {}
  return {
    title: `${piece.title} — The Gamer Scene`,
    description: piece.blurb,
    openGraph: {
      title: piece.title,
      description: piece.blurb,
      type: 'article',
      url: `${BASE}/opinion/${slug}`,
      siteName: 'The Gamer Scene',
    },
    twitter: {
      card: 'summary_large_image',
      title: piece.title,
      description: piece.blurb,
      site: '@thegamerscene',
    },
    alternates: { canonical: `${BASE}/opinion/${slug}` },
  }
}

export default async function OpinionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const piece = getOpinionBySlug(slug)
  if (!piece) notFound()

  const formattedDate = piece.date
    ? (() => {
        const clean = piece.date.match(/\d{4}-\d{2}-\d{2}/)
        if (clean) return new Date(clean[0] + 'T12:00:00').toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        })
        try { return new Date(piece.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
        catch { return '' }
      })()
    : ''

  const related = getRelatedNews(slug, 'Opinion', 3)

  const isoDate = (() => {
    if (!piece.date) return undefined
    const clean = piece.date.match(/\d{4}-\d{2}-\d{2}/)
    if (clean) return `${clean[0]}T12:00:00Z`
    try { return new Date(piece.date).toISOString() } catch { return undefined }
  })()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OpinionNewsArticle',
    headline: piece.title,
    description: piece.blurb,
    datePublished: isoDate,
    dateModified: isoDate,
    url: `${BASE}/opinion/${slug}`,
    image: piece.image ? `${BASE}${piece.image}` : undefined,
    author: {
      '@type': 'Person',
      name: piece.author,
      worksFor: { '@type': 'Organization', name: 'The Gamer Scene', url: BASE },
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Gamer Scene',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/opinion/${slug}` },
  }

  const { before: bodyBefore, after: bodyAfter } = injectMidArticleCTA(piece.bodyHtml, 4)

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
          fontFamily: 'var(--serif)', fontWeight: 900, fontSize: '1.1rem',
          letterSpacing: '-0.02em', color: 'var(--ink)', textDecoration: 'none',
        }}>
          THE GAMER SCENE
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/opinion" style={{
            fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', textDecoration: 'none',
          }}>
            Opinion
          </Link>
          <Link href="/" style={{
            fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', textDecoration: 'none',
          }}>
            ← Back to Issue
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Opinion badge */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/opinion" style={{ textDecoration: 'none' }}>
            <span className="opinion-badge">Opinion</span>
          </Link>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: '0.72rem',
            color: 'var(--ink-faint)', fontWeight: 500, fontStyle: 'italic',
          }}>
            The views expressed are those of the author.
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
          {piece.title}
        </h1>

        {/* Blurb */}
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
          {piece.blurb}
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
          margin: '0 0 0',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <Link href="/authors/romello-morris" style={{ color: 'inherit', textDecoration: 'none' }}>
            {piece.author}
          </Link>
          {formattedDate && <span>{formattedDate}</span>}
          <ViewCounter
            slug={slug}
            style={{ marginLeft: 'auto', color: 'var(--ink-faint)', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em' }}
          />
        </div>

        {/* Share buttons */}
        <ShareButtons title={piece.title} url={`${BASE}/opinion/${slug}`} />

        {/* Hero image */}
        {piece.image && (
          <div style={{ marginTop: '28px' }}>
            <ArticleHero
              src={piece.image}
              alt={piece.title}
              category="OPINION"
              title={piece.title}
            />
          </div>
        )}

        {/* Video (if present) */}
        {piece.video && (
          <VideoPlayer src={piece.video} title={piece.title} />
        )}

        {/* Article body — split around mid-article CTA */}
        <div
          className="article-body opinion-body"
          dangerouslySetInnerHTML={{ __html: bodyBefore }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
            marginTop: piece.image ? '0' : '28px',
          }}
        />
        {bodyAfter && <InlineSubscribeCTA />}
        {bodyAfter && (
          <div
            className="article-body opinion-body"
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
