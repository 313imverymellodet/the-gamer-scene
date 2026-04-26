import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// GET /api/poll?issue=047
// Returns current vote counts and totals for an issue's poll
export async function GET(req: NextRequest) {
  const issue = req.nextUrl.searchParams.get('issue')
  if (!issue) return NextResponse.json({ error: 'Missing issue' }, { status: 400 })

  try {
    const key = `poll:${issue}`
    const votes = await redis.hgetall<Record<string, number>>(key)

    if (!votes) {
      return NextResponse.json({ votes: {}, total: 0 })
    }

    const counts: Record<string, number> = {}
    let total = 0
    for (const [k, v] of Object.entries(votes)) {
      const n = Number(v) || 0
      counts[k] = n
      total += n
    }

    return NextResponse.json({ votes: counts, total })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
  }
}

// POST /api/poll
// Body: { issue: "047", option: 2 }
// Increments the vote count for the given option
export async function POST(req: NextRequest) {
  try {
    const { issue, option } = await req.json()

    if (!issue || option === undefined || option === null) {
      return NextResponse.json({ error: 'Missing issue or option' }, { status: 400 })
    }
    if (typeof option !== 'number' || option < 0 || option > 10) {
      return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
    }

    const key = `poll:${issue}`
    await redis.hincrby(key, String(option), 1)

    // Return updated counts immediately
    const votes = await redis.hgetall<Record<string, number>>(key)
    const counts: Record<string, number> = {}
    let total = 0
    if (votes) {
      for (const [k, v] of Object.entries(votes)) {
        const n = Number(v) || 0
        counts[k] = n
        total += n
      }
    }

    return NextResponse.json({ votes: counts, total })
  } catch {
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
  }
}
