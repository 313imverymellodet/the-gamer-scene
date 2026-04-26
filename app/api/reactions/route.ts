import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const VALID_KEYS = ['brilliant', 'conflicted', 'spoton', 'disagree', 'mood']

// GET /api/reactions?issue=047
// Returns current reaction counts for an issue
export async function GET(req: NextRequest) {
  const issue = req.nextUrl.searchParams.get('issue')
  if (!issue) return NextResponse.json({ error: 'Missing issue' }, { status: 400 })

  try {
    const key = `reactions:${issue}`
    const raw = await redis.hgetall<Record<string, number>>(key)

    const counts: Record<string, number> = {}
    for (const k of VALID_KEYS) {
      counts[k] = raw ? (Number(raw[k]) || 0) : 0
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

// POST /api/reactions
// Body: { issue: "047", key: "brilliant", action: "add" | "remove" }
export async function POST(req: NextRequest) {
  try {
    const { issue, key, action } = await req.json()

    if (!issue || !key || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid reaction key' }, { status: 400 })
    }
    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const redisKey = `reactions:${issue}`
    const delta = action === 'add' ? 1 : -1
    await redis.hincrby(redisKey, key, delta)

    // Clamp to 0 — never go negative
    const current = await redis.hget<number>(redisKey, key)
    if (current !== null && Number(current) < 0) {
      await redis.hset(redisKey, { [key]: 0 })
    }

    // Return updated counts
    const raw = await redis.hgetall<Record<string, number>>(redisKey)
    const counts: Record<string, number> = {}
    for (const k of VALID_KEYS) {
      counts[k] = raw ? Math.max(0, Number(raw[k]) || 0) : 0
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}
