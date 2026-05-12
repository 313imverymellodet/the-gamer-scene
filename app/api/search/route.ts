import { NextResponse } from 'next/server'
import { getAllContentMeta } from '@/lib/content'

export interface SearchItem {
  type: 'news' | 'review' | 'opinion'
  title: string
  blurb: string
  category?: string
  score?: number
  slug: string
  href: string
  date?: string
}

// GET /api/search
//
// Returns all articles as a flat sorted array for client-side search.
// Zero filesystem I/O at request time — getAllContentMeta() pulls from
// the in-memory cache populated on first access.
export async function GET() {
  const meta = getAllContentMeta()

  const items: SearchItem[] = Object.values(meta)
    .map(m => ({
      type:     m.type,
      title:    m.title,
      blurb:    m.blurb,
      category: m.category,
      score:    m.score,
      slug:     m.slug,
      href:     m.href,
      date:     m.date || undefined,
    }))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
