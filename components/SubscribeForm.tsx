'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSubscribe } from '@/lib/useSubscribe'

export default function SubscribeForm() {
  const router = useRouter()
  const { status, message, subscribe, notifyStarted } = useSubscribe()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await subscribe(email, honeypot)
    // The confirmation page is a real route so the "check your inbox" step is measurable and
    // linkable. The email itself is never put in the URL.
    if (ok) router.push('/subscribe/confirm')
  }

  const busy = status === 'loading'

  return (
    <form className="sf-form" onSubmit={handleSubmit} noValidate>
      <label className="sf-label" htmlFor="sf-email">
        Email address
      </label>
      <div className="sf-row">
        <input
          id="sf-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="sf-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            notifyStarted()
            setEmail(e.target.value)
          }}
          disabled={busy}
          required
          aria-describedby="sf-consent"
          aria-invalid={status === 'error'}
        />
        <button type="submit" className="sf-btn" disabled={busy}>
          {busy ? 'Sending…' : 'Get The Weekly Drop'}
        </button>
      </div>

      {/* Honeypot. Hidden from people and assistive tech; bots fill it and get silently dropped. */}
      <div className="sf-hp" aria-hidden="true">
        <label htmlFor="sf-website">Leave this field empty</label>
        <input
          id="sf-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <p className="sf-consent" id="sf-consent">
        By subscribing, you agree to receive TheGamerScene by email. You will receive a
        confirmation email to verify your subscription. Unsubscribe anytime.
      </p>

      {/* Errors are announced, and the typed address is never cleared on failure. */}
      <p className="sf-error" role="status" aria-live="polite">
        {status === 'error' ? message : ''}
      </p>
    </form>
  )
}
