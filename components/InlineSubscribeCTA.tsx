'use client'

import { useState } from 'react'

export default function InlineSubscribeCTA() {
  const [email, setEmail]       = useState('')
  const [status, setStatus]     = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [message, setMessage]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMessage(json.message || 'You\'re in. See you Friday.')
      } else {
        setStatus('err')
        setMessage(json.error || 'Something went wrong.')
      }
    } catch {
      setStatus('err')
      setMessage('Could not connect. Try again.')
    }
  }

  return (
    <div className="inline-cta">
      <div className="inline-cta-eyebrow">The Gamer Scene · Free Weekly</div>
      <div className="inline-cta-heading">
        Worth reading. Every Friday.
      </div>
      <p className="inline-cta-body">
        Reviews, news, and takes — straight to your inbox. No ads, no noise.
        Join {' '}<strong>thousands of readers</strong> who get it first.
      </p>
      {status === 'ok' ? (
        <div className="inline-cta-success">✓ {message}</div>
      ) : (
        <form className="inline-cta-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="inline-cta-input"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="inline-cta-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '…' : 'Subscribe Free'}
          </button>
        </form>
      )}
      {status === 'err' && (
        <div className="inline-cta-error">{message}</div>
      )}
    </div>
  )
}
