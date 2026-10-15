import { getNewsArchive, type NewsArchiveItem } from '@/lib/content'

export const NEWS_PAGE_SIZE = 20

export const NEWS_CATEGORIES = ['All', 'Industry', 'Update', 'Reveal', 'Rumor', 'Poll'] as const
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const NEWS_INDEX_DESCRIPTION =
  'Industry moves, game announcements, updates, and everything else worth knowing. No filler.'

export type { NewsArchiveItem }

export function normalizeNewsCategory(raw: string | string[] | undefined): NewsCategory {
  const value = (Array.isArray(raw) ? raw[0] : raw)?.trim()
  if (!value) return 'All'
  const match = NEWS_CATEGORIES.find(category => category.toLowerCase() === value.toLowerCase())
  return match ?? 'All'
}

export function categoryMatches(articleCategory: string, filter: NewsCategory): boolean {
  if (filter === 'All') return true
  const article = articleCategory.trim().toLowerCase()
  const wanted = filter.toLowerCase()
  // Frontmatter uses both spellings; the filter label is "Rumor".
  if (wanted === 'rumor') return article === 'rumor' || article === 'rumour'
  return article === wanted
}

export function filterNews(items: NewsArchiveItem[], category: NewsCategory): NewsArchiveItem[] {
  if (category === 'All') return items
  return items.filter(item => categoryMatches(item.category, category))
}

/** Crawlable path for a news-index page. Page 1 is /news; later pages are /news/page/N. */
export function newsIndexPath(page: number, category: NewsCategory = 'All'): string {
  const base = page <= 1 ? '/news' : `/news/page/${page}`
  if (category === 'All') return base
  return `${base}?category=${encodeURIComponent(category)}`
}

export function newsIndexTitle(page: number, category: NewsCategory): string {
  const subject = category === 'All' ? 'News' : `${category} News`
  return page > 1 ? `${subject}, page ${page}` : subject
}

export function paginateNews(items: NewsArchiveItem[], page: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE) || 1)
  const safePage = Number.isInteger(page) ? Math.min(Math.max(1, page), totalPages) : 1
  const start = (safePage - 1) * NEWS_PAGE_SIZE
  return {
    items: items.slice(start, start + NEWS_PAGE_SIZE),
    total,
    totalPages,
    page: safePage,
    start,
  }
}

export function newsPageCount(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / NEWS_PAGE_SIZE) || 1)
}
