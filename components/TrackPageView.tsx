'use client'

import { useEffect, useRef } from 'react'
import { track, type FunnelEvent } from '@/lib/analytics'

/**
 * Fires a funnel event once when a server-rendered page mounts.
 *
 * Rendered as a zero-markup child so pages like /subscribe can stay server components.
 */
export default function TrackPageView({ event }: { event: FunnelEvent }) {
  const fired = useRef(false)

  useEffect(() => {
    // StrictMode double-invokes effects in development; a page view must still count once.
    if (fired.current) return
    fired.current = true
    track(event)
  }, [event])

  return null
}
