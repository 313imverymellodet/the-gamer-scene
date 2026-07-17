'use client'

import { useCallback, useEffect, useState } from 'react'

const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type SubscribeStatus = 'idle' | 'loading' | 'ok' | 'error'

/**
 * Shared signup logic for every subscribe surface on the site.
 *
 * Two things it guarantees that individual forms kept getting wrong:
 * - UTM values present on the landing URL are carried through to beehiiv, so paid traffic can be
 *   attributed to *confirmed* subscribers rather than form submissions.
 * - The honeypot value is always sent, so the API can distinguish bots from people.
 *
 * `ok` means "beehiiv accepted the signup", NOT "this person is subscribed" — double opt-in means
 * they are not a subscriber until they click the confirmation link. Callers must say so.
 */
export function useSubscribe() {
  const [utm, setUtm] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const field of UTM_FIELDS) {
      const value = params.get(field)
      if (value) found[field] = value
    }
    setUtm(found)
  }, [])

  const subscribe = useCallback(
    async (email: string, honeypot: string): Promise<boolean> => {
      setStatus('loading')
      setMessage('')
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, website: honeypot, ...utm }),
        })
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        if (res.ok) {
          setStatus('ok')
          return true
        }
        setStatus('error')
        setMessage(json.error ?? 'Something went wrong. Please try again.')
        return false
      } catch {
        setStatus('error')
        setMessage('Could not connect. Please check your connection and try again.')
        return false
      }
    },
    [utm]
  )

  return { status, message, subscribe, utm }
}
