import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getNewsArchive } from '@/lib/content'
import NewsIndex from '@/components/NewsIndex'
import { pageMetadata } from '@/lib/site'
import {
  NEWS_INDEX_DESCRIPTION,
  NEWS_PAGE_SIZE,
  filterNews,
  newsIndexPath,
  newsIndexTitle,
  newsPageCount,
  normalizeNewsCategory,
  paginateNews,
} from '@/lib/news-index'

interface Search {
  category?: string | string[]
}

export function generateStaticParams() {
  const totalPages = newsPageCount(getNewsArchive().length)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }))
}

function parsePage(raw: string): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null
  const page = Number(raw)
  return Number.isSafeInteger(page) ? page : null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>
  searchParams: Promise<Search>
}): Promise<Metadata> {
  const { page: raw } = await params
  const page = parsePage(raw)
  if (!page) return {}
  const { category: rawCategory } = await searchParams
  const category = normalizeNewsCategory(rawCategory)
  return pageMetadata({
    title: newsIndexTitle(page, category),
    description: NEWS_INDEX_DESCRIPTION,
    path: newsIndexPath(page, category),
  })
}

export default async function NewsPagedPage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>
  searchParams: Promise<Search>
}) {
  const { page: raw } = await params
  const page = parsePage(raw)
  if (!page) notFound()

  const { category: rawCategory } = await searchParams
  const category = normalizeNewsCategory(rawCategory)
  if (page === 1) permanentRedirect(newsIndexPath(1, category))

  const filtered = filterNews(getNewsArchive(), category)
  const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_PAGE_SIZE) || 1)
  if (page > totalPages) notFound()

  const paged = paginateNews(filtered, page)
  return (
    <NewsIndex
      articles={paged.items}
      category={category}
      page={paged.page}
      total={paged.total}
      totalPages={paged.totalPages}
      startIndex={paged.start}
    />
  )
}
