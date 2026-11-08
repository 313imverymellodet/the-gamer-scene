import type { Metadata } from 'next'
import { getNewsArchive } from '@/lib/content'
import NewsIndex from '@/components/NewsIndex'
import { pageMetadata } from '@/lib/site'
import {
  NEWS_INDEX_DESCRIPTION,
  filterNews,
  newsIndexPath,
  newsIndexTitle,
  normalizeNewsCategory,
  paginateNews,
} from '@/lib/news-index'

interface Search {
  category?: string | string[]
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Search>
}): Promise<Metadata> {
  const { category: raw } = await searchParams
  const category = normalizeNewsCategory(raw)
  return pageMetadata({
    title: newsIndexTitle(1, category),
    description: NEWS_INDEX_DESCRIPTION,
    path: newsIndexPath(1, category),
  })
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const { category: raw } = await searchParams
  const category = normalizeNewsCategory(raw)
  const filtered = filterNews(getNewsArchive(), category)
  const paged = paginateNews(filtered, 1)

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
