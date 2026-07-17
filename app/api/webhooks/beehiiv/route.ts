import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { redis } from '@/lib/redis'

/**
 * beehiiv `subscription.confirmed` webhook.
 *
 * This is the only place a subscriber may be recorded as *confirmed*. Double opt-in means a form
 * submission is not a subscription, so §16's "cost per confirmed subscriber" needs a source of
 * truth that the browser cannot fake.
 *
 * Two independent checks, because beehiiv's payload signing scheme is not publicly documented and
 * we should not depend on a guess:
 *
 *  1. A shared secret in the URL (`?token=`), compared in constant time. beehiiv lets you choose
 *     the webhook URL, so an unguessable token is a workable stand-in for a signature.
 *  2. An authenticated read-back to the beehiiv API confirming the subscription really is active.
 *     This is the check that actually matters: even a forged request with a leaked token cannot
 *     manufacture a confirmation, because we ask beehiiv directly before believing it.
 *
 * Configure in beehiiv (Settings > Webhooks, Scale plan or above):
 *   https://thegamerscene.news/api/webhooks/beehiiv?token=<BEEHIIV_WEBHOOK_SECRET>
 */

const CONFIRMED_EVENT = 'subscription.confirmed'

interface BeehiivWebhookPayload {
  event_type?: string
  type?: string
  data?: {
    id?: string
    email?: string
    status?: string
    utm_source?: string
  }
}

function tokenMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  // timingSafeEqual throws on length mismatch, which itself leaks length; guard first.
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** Asks beehiiv whether this subscription is genuinely active. Returns its utm_source if so. */
async function verifyWithBeehiiv(
  subscriptionId: string
): Promise<{ active: boolean; utmSource: string }> {
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  const apiKey = process.env.BEEHIIV_API_KEY
  if (!pubId || !apiKey) return { active: false, utmSource: 'unknown' }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions/${subscriptionId}`,
    { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' } }
  )
  if (!res.ok) {
    console.error(`Webhook read-back failed with status ${res.status}`)
    return { active: false, utmSource: 'unknown' }
  }

  const body = (await res.json()) as { data?: { status?: string; utm_source?: string } }
  return {
    active: body.data?.status === 'active',
    utmSource: body.data?.utm_source || 'direct',
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.BEEHIIV_WEBHOOK_SECRET
  if (!secret) {
    console.error('Webhook rejected: BEEHIIV_WEBHOOK_SECRET is not configured.')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (!tokenMatches(req.nextUrl.searchParams.get('token'), secret)) {
    // No detail in the response: an attacker probing the endpoint learns nothing.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = (await req.json()) as BeehiivWebhookPayload
    const eventType = payload.event_type ?? payload.type

    // Acknowledge non-confirmation events so beehiiv doesn't retry them forever.
    if (eventType !== CONFIRMED_EVENT) {
      return NextResponse.json({ ok: true, ignored: eventType ?? 'unknown' })
    }

    const subscriptionId = payload.data?.id
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscription id' }, { status: 400 })
    }

    const { active, utmSource } = await verifyWithBeehiiv(subscriptionId)
    if (!active) {
      // Payload claimed a confirmation that beehiiv does not corroborate. Never record it.
      console.error('Webhook claimed a confirmation beehiiv did not corroborate; ignoring.')
      return NextResponse.json({ ok: true, recorded: false })
    }

    // Attribution only — never the subscriber's email. Counters are keyed by day and source so
    // confirmed-vs-submitted can be compared per campaign without storing personal data.
    const day = new Date().toISOString().slice(0, 10)
    const safeSource = utmSource.replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'direct'
    await redis.incr(`newsletter:confirmed:${day}`)
    await redis.incr(`newsletter:confirmed:${day}:${safeSource}`)

    return NextResponse.json({ ok: true, recorded: true })
  } catch (err) {
    console.error('Webhook error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
