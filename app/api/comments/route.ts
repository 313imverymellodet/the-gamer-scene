import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MAX_COMMENTS = 200   // per issue
const PAGE_SIZE    = 20    // returned per request

export interface StoredComment {
  id: string
  name: string
  initials: string
  body: string
  timestamp: number
  likes: number
}

// GET /api/comments?issue=047&page=0
export async function GET(req: NextRequest) {
  const issue = req.nextUrl.searchParams.get('issue')
  const page  = parseInt(req.nextUrl.searchParams.get('page') || '0', 10)
  if (!issue) return NextResponse.json({ error: 'Missing issue' }, { status: 400 })

  try {
    const key   = `comments:${issue}`
    const start = page * PAGE_SIZE
    const end   = start + PAGE_SIZE - 1

    const raw: string[] = await redis.lrange(key, start, end) as string[]
    const total: number = await redis.llen(key)

    const comments: StoredComment[] = raw.map(r => {
      try { return JSON.parse(r) as StoredComment }
      catch { return null }
    }).filter(Boolean) as StoredComment[]

    return NextResponse.json({ comments, total, hasMore: end < total - 1 })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments
// Body: { issue, name, body }
export async function POST(req: NextRequest) {
  try {
    const { issue, name, body } = await req.json()

    if (!issue || !body?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const cleanName = (name?.trim() || 'Anonymous').slice(0, 60)
    const cleanBody = body.trim().slice(0, 1000)

    // Basic spam guard — min 10 chars
    if (cleanBody.length < 10) {
      return NextResponse.json({ error: 'Comment too short' }, { status: 400 })
    }

    const initials = cleanName
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() || '')
      .join('')
      || 'AN'

    const comment: StoredComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      initials,
      body: cleanBody,
      timestamp: Date.now(),
      likes: 0,
    }

    const key = `comments:${issue}`
    // LPUSH → newest first
    await redis.lpush(key, JSON.stringify(comment))
    // Trim to max so the list never grows unbounded
    await redis.ltrim(key, 0, MAX_COMMENTS - 1)

    return NextResponse.json({ comment })
  } catch {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
