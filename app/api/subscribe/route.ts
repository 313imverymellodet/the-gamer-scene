import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // If a Beehiiv publication ID is set, use Beehiiv API
    const beehiivPubId = process.env.BEEHIIV_PUB_ID
    const beehiivApiKey = process.env.BEEHIIV_API_KEY

    if (beehiivPubId && beehiivApiKey) {
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
            reactivate_existing: true,
            send_welcome_email: true,
          }),
        }
      )
      if (!res.ok) {
        const body = await res.text()
        console.error('Beehiiv error:', body)
        return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
      }
      return NextResponse.json({ ok: true })
    }

    // Fallback: Substack embed API
    const res = await fetch('https://thegamerscenedaily.substack.com/api/v1/free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    })

    // Substack returns 200 even if the email is already subscribed, so treat any non-5xx as ok
    if (res.status >= 500) {
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
