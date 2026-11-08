import type { Metadata } from 'next'

/**
 * Canonical origin for every absolute URL this site emits (canonical,
 * og:url, sitemap, robots, JSON-LD, RSS item links).
 *
 * Production serves pages on the www host. The apex domain
 * (https://thegamerscene.news) 307-redirects there; that redirect is a
 * Vercel domain setting, not something this repo controls. Override with
 * NEXT_PUBLIC_SITE_URL when a preview needs a different origin.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thegamerscene.news'
).replace(/\/$/, '')

export const SITE_NAME = 'The Gamer Scene'

/** Fixed homepage <title>. Must not be passed through the "%s — The Gamer Scene" template. */
export const SITE_TITLE =
  'The Gamer Scene — Independent Gaming News, Reviews & GTA 6 Coverage'

/** Evergreen homepage / default meta description. Not tied to the latest issue. */
export const SITE_DESCRIPTION =
  'Independent gaming news, reviews, and criticism, with ongoing GTA 6 coverage. The Gamer Scene publishes weekly.'

/** Raster publisher logo. Schema.org will not reliably use the SVG favicon. */
export const PUBLISHER_LOGO_PATH = '/logo.png'

/**
 * Last substantive edit for pages that are not generated from a content file.
 * Kept in sync with the "last verified" dates on the GTA 6 pages.
 * About, contact, privacy, terms, and subscribe have no comparable date.
 */
export const STATIC_LAST_MODIFIED: Record<string, string> = {
  '/gta-6': '2026-07-18',
  '/gta-6/release-date': '2026-07-18',
  '/gta-6/pc': '2026-07-19',
}

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function publisherLogo() {
  return {
    '@type': 'ImageObject' as const,
    url: absoluteUrl(PUBLISHER_LOGO_PATH),
    width: 512,
    height: 512,
  }
}

export function publisherJsonLd() {
  return {
    '@type': 'Organization' as const,
    name: SITE_NAME,
    url: SITE_URL,
    logo: publisherLogo(),
  }
}

/** Organization + WebSite graph for the homepage. */
export function homeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: publisherLogo(),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

/**
 * "Hades II Review — …" → "Hades II".
 * "EA Sports College Football 27 Review Analysis — …" → "EA Sports College Football 27".
 */
export function gameNameFromHeadline(title: string): string {
  const match = title.match(/^(.+?)\s+Review(?:\s+Analysis)?(?:\s*[—–\-:]|$)/i)
  const name = match?.[1]?.trim()
  return name || title
}

interface PageMetadataInput {
  title: string
  description: string
  /** Site path, including an optional query string. "/" is the homepage. */
  path: string
  /** Use the title as-is, without the layout's " — The Gamer Scene" template. */
  absoluteTitle?: boolean
  ogType?: 'website' | 'article' | 'profile'
  ogTitle?: string
  ogDescription?: string
  robots?: Metadata['robots']
}

/**
 * Self-referencing canonical, matching og:url, and a Twitter description
 * that matches the page description. Title is the page name only — the
 * root layout template appends the brand once.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const url = absoluteUrl(input.path)
  const socialTitle = input.ogTitle
    ?? (input.absoluteTitle ? input.title : `${input.title} — ${SITE_NAME}`)
  const socialDescription = input.ogDescription ?? input.description

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: SITE_NAME,
      type: input.ogType ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
    },
    ...(input.robots ? { robots: input.robots } : {}),
  }
}
