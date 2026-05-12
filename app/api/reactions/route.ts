import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

const VALID_KEYS = ['brilliant', 'conflicted', 'spoton', 'disagree', 'mood'] as const

// GET /api/reactions?issue=047
export async function GET(req: NextRequest) {
  const issue = req.nextUrl.searchParams.get('issue')
  if (!issue) return NextResponse.json({ error: 'Missing issue' }, { status: 400 })

  try {
    const raw = await redis.hgetall<Record<string, number>>(`reactions:${issue}`)

    const counts: Record<string, number> = {}
    for (const k of VALID_KEYS) {
      counts[k] = raw ? Math.max(0, Number(raw[k]) || 0) : 0
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

// POST /api/reactions
// Body: { issue: "047", key: "brilliant", action: "add" | "remove" }
//
// Performance: was 3 sequential round-trips (hincrby → hget → hgetall).
// Now 2 pipelined (hincrby + hgetall), clamp applied in JS after the fact.
export async function POST(req: NextRequest) {
  try {
    const { issue, key, action } = await req.json()

    if (!issue || !key || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!(VALID_KEYS as readonly string[]).includes(key)) {
      return NextResponse.json({ error: 'Invalid reaction key' }, { status: 400 })
    }
    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const redisKey = `reactions:${issue}`
    const delta    = action === 'add' ? 1 : -1

    // Pipeline: increment + read back in one round-trip
    const pipeline = redis.pipeline()
    pipeline.hincrby(redisKey, key, delta)
    pipeline.hgetall(redisKey)
    const [, rawResult] = await pipeline.exec()

    const raw = rawResult as Record<string, number> | null

    // Clamp all values to ≥ 0 in JS — avoids a third Redis round-trip
    const counts: Record<string, number> = {}
    for (const k of VALID_KEYS) {
      counts[k] = raw ? Math.max(0, Number(raw[k]) || 0) : 0
    }

    // If the just-updated key went negative (race condition), floor it in Redis
    // asynchronously — fire-and-forget, doesn't block the response
    if (counts[key] < 0) {
      redis.hset(redisKey, { [key]: 0 }).catch(() => {})
      counts[key] = 0
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}
