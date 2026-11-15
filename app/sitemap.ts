import { MetadataRoute } from 'next'
import { getAllContentMeta, getAllIssueSlugs } from '@/lib/content'
import { parseContentDate } from '@/lib/date'

const base = 'https://thegamerscene.news'

// lastModified reflects each page's real publication date rather than the
// build time — a lastmod that changes on every deploy teaches crawlers to
// ignore it.
export default function sitemap(): MetadataRoute.Sitemap {
  const meta = Object.values(getAllContentMeta())

  const dated = meta.map(m => ({ m, d: parseContentDate(m.date) ?? undefined }))
  const newest = (filter: (h: string) => boolean) =>
    dated
      .filter(x => filter(x.m.href) && x.d)
      .reduce<Date | undefined>((a, x) => (!a || x.d! > a ? x.d : a), undefined)

  const latestAny     = newest(() => true)
  const latestNews    = newest(h => h.startsWith('/news/'))
  const latestReview  = newest(h => h.startsWith('/reviews/'))
  const latestOpinion = newest(h => h.startsWith('/opinion/'))
  const latestGta     = newest(h => /gta-?6|gta-online/i.test(h))

  const priorityFor = (href: string) =>
    href.startsWith('/reviews/') ? 0.8 : href.startsWith('/opinion/') ? 0.75 : 0.7

  const content = dated.map(({ m, d }) => ({
    url: `${base}${m.href}`,
    lastModified: d,
    changeFrequency: 'monthly' as const,
    priority: /gta-?6/i.test(m.href) ? 0.85 : priorityFor(m.href),
  }))

  const issues = getAllIssueSlugs().map(slug => ({
    url: `${base}/issues/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: base,                         lastModified: latestAny,     changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/gta-6`,              lastModified: latestGta,     changeFrequency: 'daily',   priority: 0.95 },
    { url: `${base}/gta-6/release-date`, lastModified: latestGta,     changeFrequency: 'daily',   priority: 0.95 },
    { url: `${base}/gta-6/pc`,           lastModified: new Date('2026-07-19T12:00:00Z'), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/news`,               lastModified: latestNews,    changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/reviews`,            lastModified: latestReview,  changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/opinion`,            lastModified: latestOpinion, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/issues`,             lastModified: latestAny,     changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/subscribe`,          changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,              changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/contact`,            changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy`,            changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,              changeFrequency: 'yearly',  priority: 0.3 },
    ...issues,
    ...content,
  ]
}
