'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// GTA VI launches Thursday, November 19, 2026 (per Rockstar's official listing).
// Midnight Eastern used as the tick target; exact global launch times are
// unannounced, which is why the strip always shows the plain date too.
const LAUNCH_TS = new Date('2026-11-19T00:00:00-05:00').getTime()

interface Remaining {
  d: number
  h: number
  m: number
  s: number
}

function remaining(): Remaining | null {
  const diff = LAUNCH_TS - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1_000) % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Gta6Countdown() {
  // null until mounted — server and first client render match (no hydration diff)
  const [t, setT] = useState<Remaining | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setT(remaining())
    const id = setInterval(() => setT(remaining()), 1_000)
    return () => clearInterval(id)
  }, [])

  const launched = mounted && t === null

  return (
    <Link
      href="/gta-6"
      className="gta6-strip"
      aria-label={
        launched
          ? 'Grand Theft Auto VI is out now — read our coverage'
          : 'Grand Theft Auto VI launches November 19, 2026 — open the GTA 6 hub'
      }
    >
      <span className="gta6-strip-brand" aria-hidden="true">
        <b>VI</b> WATCH
      </span>

      {launched ? (
        <span className="gta6-strip-clock">
          <em>GTA VI IS OUT NOW</em>
        </span>
      ) : (
        <span className="gta6-strip-clock">
          <span className="gta6-strip-tminus" aria-hidden="true">T-MINUS</span>
          {t ? (
            <span className="gta6-strip-digits" suppressHydrationWarning>
              <b>{t.d}</b><i>D</i>
              <b>{pad(t.h)}</b><i>H</i>
              <b>{pad(t.m)}</b><i>M</i>
              <b className="gta6-strip-sec">{pad(t.s)}</b><i className="gta6-strip-sec">S</i>
            </span>
          ) : (
            // Pre-hydration / no-JS: the date itself carries the information
            <span className="gta6-strip-digits">
              <b>NOV</b><i>19</i>
            </span>
          )}
        </span>
      )}

      <span className="gta6-strip-date">
        GTA VI · NOV 19, 2026 · PS5 &amp; XBOX SERIES X|S
      </span>

      <span className="gta6-strip-cta" aria-hidden="true">
        TRACK EVERYTHING →
      </span>
    </Link>
  )
}
