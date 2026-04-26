import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface TrendingItem {
  slug: string
  title: string
  category: string
  type: 'news' | 'review'
  score?: number
  views: number
  href: string
}

// GET /api/trending?limit=7
// Reads all known slugs, batch-fetches their view counts, sorts desc
export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '7', 10), 20)
  const contentDir = path.join(process.cwd(), 'content')

  // Build a map of slug → metadata
  const meta: Record<string, Omit<TrendingItem, 'views'>> = {}

  // News
  const newsDir = path.join(contentDir, 'news')
  if (fs.existsSync(newsDir)) {
    for (const file of fs.readdirSync(newsDir).filter(f => f.endsWith('.md'))) {
      const slug = file.replace('.md', '')
      const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const { data } = matter(raw)
      meta[slug] = {
        slug,
        title: String(data.title || ''),
        category: String(data.category || 'NEWS'),
        type: 'news',
        href: `/news/${slug}`,
      }
    }
  }

  // Reviews
  const reviewsDir = path.join(contentDir, 'reviews')
  if (fs.existsSync(reviewsDir)) {
    for (const file of fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'))) {
      const slug = file.replace('.md', '')
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      meta[slug] = {
        slug,
        title: String(data.title || ''),
        category: 'REVIEW',
        type: 'review',
        score: typeof data.score === 'number' ? data.score : undefined,
        href: `/reviews/${slug}`,
      }
    }
  }

  const slugs = Object.keys(meta)
  if (slugs.length === 0) return NextResponse.json([])

  try {
    // MGET all view counts in one round-trip
    const keys = slugs.map(s => `views:${s}`)
    const counts = await redis.mget<(number | null)[]>(...keys)

    const items: TrendingItem[] = slugs.map((slug, i) => ({
      ...meta[slug],
      views: Number(counts[i] ?? 0),
    }))
      .filter(item => item.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)

    // If fewer than 3 real views yet, pad with most recent articles
    if (items.length < 3) {
      const recent = Object.values(meta)
        .filter(m => !items.find(i => i.slug === m.slug))
        .slice(0, limit - items.length)
        .map(m => ({ ...m, views: 0 }))
      items.push(...recent)
    }

    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    // Fallback: return most recent articles with 0 views
    const fallback = Object.values(meta).slice(0, limit).map(m => ({ ...m, views: 0 }))
    return NextResponse.json(fallback)
  }
}
