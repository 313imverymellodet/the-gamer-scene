import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// GET /api/views?slug=2026-04-24-we-are-xbox
// Returns current view count without incrementing (for display only)
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  try {
    const count = await redis.get<number>(`views:${slug}`)
    return NextResponse.json({ views: count ?? 0 })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}

// POST /api/views
// Body: { slug: "2026-04-24-we-are-xbox" }
// Increments view count and returns new total
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    const key = `views:${slug}`
    const views = await redis.incr(key)
    return NextResponse.json({ views })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}
