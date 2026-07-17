'use client'

import { useState } from 'react'
import { useSubscribe } from '@/lib/useSubscribe'

export default function InlineSubscribeCTA() {
  const { status, message, subscribe } = useSubscribe()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await subscribe(email, honeypot)
  }

  const busy = status === 'loading'

  return (
    <div className="inline-cta">
      <div className="inline-cta-eyebrow">The Weekly Drop · Free · Once a week</div>
      <div className="inline-cta-heading">
        Five gaming stories that matter, explained in five minutes.
      </div>
      <p className="inline-cta-body">
        The biggest stories, releases, and deals — once a week, no noise.
      </p>

      {status === 'ok' ? (
        // Double opt-in: they are not subscribed until they confirm. Never claim otherwise.
        <div className="inline-cta-success">
          ✓ Check your inbox to confirm your subscription.
        </div>
      ) : (
        <form className="inline-cta-form" onSubmit={handleSubmit} noValidate>
          <label className="sf-label" htmlFor="inline-cta-email">
            Email address
          </label>
          <input
            id="inline-cta-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="inline-cta-input"
            required
            disabled={busy}
            aria-invalid={status === 'error'}
          />
          <button type="submit" className="inline-cta-btn" disabled={busy}>
            {busy ? '…' : 'Subscribe Free'}
          </button>

          <div className="sf-hp" aria-hidden="true">
            <label htmlFor="inline-cta-website">Leave this field empty</label>
            <input
              id="inline-cta-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
        </form>
      )}

      <div className="inline-cta-error" role="status" aria-live="polite">
        {status === 'error' ? message : ''}
      </div>
    </div>
  )
}
