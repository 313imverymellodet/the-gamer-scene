import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60

const UTM_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Per-IP signup cap.
 *
 * Fails open: if Redis is unreachable we allow the request rather than close the funnel. The
 * honeypot runs regardless, and an outage in the limiter shouldn't stop real people subscribing.
 */
async function isRateLimited(ip: string): Promise<boolean> {
  if (ip === 'unknown') return false
  try {
    const key = `subscribe:rate:${ip}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS)
    return count > RATE_LIMIT_MAX
  } catch {
    console.error('Subscribe rate limiter unavailable — allowing request.')
    return false
  }
}

function collectUtm(body: Record<string, unknown>): Record<string, string> {
  const utm: Record<string, string> = {}
  for (const field of UTM_FIELDS) {
    const value = body[field]
    if (typeof value === 'string' && value.trim()) {
      utm[field] = value.trim().slice(0, 200)
    }
  }
  return utm
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    // Honeypot. The `website` field is visually hidden and never focusable, so a human cannot
    // fill it. Return the normal success shape so a bot gets no signal, but never reach beehiiv.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const email = body.email
    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    const cleanEmail = email.trim().toLowerCase()

    if (await isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID
    const beehiivApiKey = process.env.BEEHIIV_API_KEY

    // Fail closed. A signup must reach the TheGamerScene beehiiv publication or not happen at
    // all — there is deliberately no fallback provider, because silently routing a subscriber
    // to a different list breaks the consent the form asked for.
    if (!beehiivPubId || !beehiivApiKey) {
      console.error(
        'Subscribe blocked: BEEHIIV_PUBLICATION_ID and/or BEEHIIV_API_KEY are not configured.'
      )
      return NextResponse.json(
        { error: 'Subscriptions are temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      )
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${beehiivApiKey}`,
        },
        body: JSON.stringify({
          email: cleanEmail,
          // Never resurrect a prior unsubscribe. Re-adding someone who opted out is the
          // affirmative-consent failure this account was previously suspended over.
          reactivate_existing: false,
          send_welcome_email: true,
          ...collectUtm(body),
        }),
      }
    )

    if (!res.ok) {
      // Status only: beehiiv echoes the submitted address in validation errors, and subscriber
      // emails must not reach production logs.
      console.error(`Beehiiv subscribe failed with status ${res.status}`)
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 502 })
    }

    // Deliberately not "you're subscribed": double opt-in means this person is not a subscriber
    // until they click the confirmation link.
    return NextResponse.json({ ok: true, pending_confirmation: true })
  } catch (err) {
    console.error('Subscribe error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
