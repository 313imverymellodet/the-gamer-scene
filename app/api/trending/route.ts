import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { getAllContentMeta } from '@/lib/content'
import type { ContentMeta } from '@/lib/content'

export interface TrendingItem extends ContentMeta {
  views: number
}

// GET /api/trending?limit=7
//
// Performance: zero filesystem I/O at request time. getAllContentMeta()
// returns from the in-memory cache built on first access. The only
// network call is a single Redis MGET for all view counts.
export async function GET(req: NextRequest) {
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get('limit') || '7', 10),
    20,
  )

  const meta   = getAllContentMeta()
  const slugs  = Object.keys(meta)
  if (slugs.length === 0) return NextResponse.json([])

  try {
    // Single round-trip: fetch all view counts at once
    const keys   = slugs.map(s => `views:${s}`)
    const counts = await redis.mget<(number | null)[]>(...keys)

    const items: TrendingItem[] = slugs
      .map((slug, i) => ({ ...meta[slug], views: Number(counts[i] ?? 0) }))
      .filter(item => item.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)

    // Pad with most-recent articles if fewer than 3 have real view counts
    if (items.length < 3) {
      const seen   = new Set(items.map(i => i.slug))
      const recent = Object.values(meta)
        .filter(m => !seen.has(m.slug))
        .slice(0, limit - items.length)
        .map(m => ({ ...m, views: 0 }))
      items.push(...recent)
    }

    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    // Graceful fallback: no Redis, return most-recent metadata with 0 views
    const fallback = Object.values(meta)
      .slice(0, limit)
      .map(m => ({ ...m, views: 0 }))
    return NextResponse.json(fallback)
  }
}
