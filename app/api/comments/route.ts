import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

const MAX_COMMENTS = 200  // per issue
const PAGE_SIZE    = 20   // returned per request

export interface StoredComment {
  id: string
  name: string
  initials: string
  body: string
  timestamp: number
  likes: number
}

// GET /api/comments?issue=047&page=0
//
// Performance: lrange + llen sent in a single pipeline round-trip
// instead of two sequential awaits.
export async function GET(req: NextRequest) {
  const issue = req.nextUrl.searchParams.get('issue')
  const page  = parseInt(req.nextUrl.searchParams.get('page') || '0', 10)
  if (!issue) return NextResponse.json({ error: 'Missing issue' }, { status: 400 })

  try {
    const key   = `comments:${issue}`
    const start = page * PAGE_SIZE
    const end   = start + PAGE_SIZE - 1

    // Single round-trip: fetch slice AND total length together
    const pipeline = redis.pipeline()
    pipeline.lrange(key, start, end)
    pipeline.llen(key)
    const [rawResult, totalResult] = await pipeline.exec()

    const raw   = (rawResult   as string[]) ?? []
    const total = (totalResult as number)   ?? 0

    const comments: StoredComment[] = raw
      .map(r => { try { return JSON.parse(r) as StoredComment } catch { return null } })
      .filter(Boolean) as StoredComment[]

    return NextResponse.json({ comments, total, hasMore: end < total - 1 })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments
// Body: { issue, name, body }
//
// Performance: lpush + ltrim pipelined into one round-trip.
export async function POST(req: NextRequest) {
  try {
    const { issue, name, body } = await req.json()

    if (!issue || !body?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const cleanName = (name?.trim() || 'Anonymous').slice(0, 60)
    const cleanBody = body.trim().slice(0, 1_000)

    if (cleanBody.length < 10) {
      return NextResponse.json({ error: 'Comment too short' }, { status: 400 })
    }

    const initials = cleanName
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() || '')
      .join('') || 'AN'

    const comment: StoredComment = {
      id:        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name:      cleanName,
      initials,
      body:      cleanBody,
      timestamp: Date.now(),
      likes:     0,
    }

    const key = `comments:${issue}`

    // Single round-trip: push + trim together
    const pipeline = redis.pipeline()
    pipeline.lpush(key, JSON.stringify(comment))
    pipeline.ltrim(key, 0, MAX_COMMENTS - 1)
    await pipeline.exec()

    return NextResponse.json({ comment })
  } catch {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
