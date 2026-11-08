import { MetadataRoute } from 'next'
import { getNewsDated, getReviewDated, getOpinionDated, getIssueDated, latestDate, type DatedEntry } from '@/lib/content'
import { parseContentDate } from '@/lib/date'
import { NEWS_PAGE_SIZE } from '@/lib/news-index'
import { SITE_URL, STATIC_LAST_MODIFIED } from '@/lib/site'

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

function entry(
  path: string,
  date: Date | null | undefined,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`,
    ...(date ? { lastModified: date } : {}),
    changeFrequency,
    priority,
  }
}

function staticDate(path: string): Date | null {
  return parseContentDate(STATIC_LAST_MODIFIED[path] ?? null)
}

function contentEntries(
  items: DatedEntry[],
  pathFor: (slug: string) => string,
  priority: number,
): MetadataRoute.Sitemap {
  return items.map(item => entry(pathFor(item.slug), item.date, 'monthly', priority))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const news = getNewsDated()
  const reviews = getReviewDated()
  const opinion = getOpinionDated()
  const issues = getIssueDated()

  const newsPages: MetadataRoute.Sitemap = []
  const newsPageTotal = Math.ceil(news.length / NEWS_PAGE_SIZE)
  for (let page = 2; page <= newsPageTotal; page++) {
    const newestOnPage = news[(page - 1) * NEWS_PAGE_SIZE]
    newsPages.push(entry(
      `/news/page/${page}`,
      newestOnPage?.date,
      'weekly',
      0.5,
    ))
  }

  return [
    entry('/', latestDate(issues), 'weekly', 1.0),
    entry('/news', latestDate(news), 'daily', 0.9),
    ...newsPages,
    entry('/gta-6', staticDate('/gta-6'), 'daily', 0.95),
    entry('/gta-6/release-date', staticDate('/gta-6/release-date'), 'daily', 0.95),
    entry('/gta-6/pc', staticDate('/gta-6/pc'), 'daily', 0.95),
    entry('/subscribe', null, 'monthly', 0.95),
    entry('/issues', latestDate(issues), 'weekly', 0.9),
    entry('/reviews', latestDate(reviews), 'weekly', 0.9),
    entry('/opinion', latestDate(opinion), 'weekly', 0.85),
    entry('/about', null, 'yearly', 0.5),
    entry('/contact', null, 'yearly', 0.4),
    entry('/privacy', null, 'yearly', 0.3),
    entry('/terms', null, 'yearly', 0.3),
    ...contentEntries(issues, slug => `/issues/${slug}`, 0.6),
    ...contentEntries(reviews, slug => `/reviews/${slug}`, 0.8),
    ...contentEntries(opinion, slug => `/opinion/${slug}`, 0.75),
    ...contentEntries(news, slug => `/news/${slug}`, 0.7),
  ]
}
