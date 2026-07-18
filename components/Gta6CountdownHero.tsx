'use client'

import { useEffect, useState } from 'react'

const LAUNCH_TS = new Date('2026-11-19T00:00:00-05:00').getTime()

interface Remaining { d: number; h: number; m: number; s: number }

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

/**
 * Large launch countdown for the /gta-6 hub. The plain release date is always
 * rendered in text beside it, so the page stays useful without JavaScript.
 */
export default function Gta6CountdownHero() {
  const [t, setT] = useState<Remaining | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setT(remaining())
    const id = setInterval(() => setT(remaining()), 1_000)
    return () => clearInterval(id)
  }, [])

  const cells: Array<{ v: string; label: string }> = t
    ? [
        { v: String(t.d),  label: t.d === 1 ? 'Day' : 'Days' },
        { v: pad(t.h),     label: 'Hours' },
        { v: pad(t.m),     label: 'Minutes' },
        { v: pad(t.s),     label: 'Seconds' },
      ]
    : [
        { v: '—', label: 'Days' },
        { v: '—', label: 'Hours' },
        { v: '—', label: 'Minutes' },
        { v: '—', label: 'Seconds' },
      ]

  return (
    <div className="gta6-hero-clock" role="timer" aria-live="off">
      <div className="gta6-hero-clock-head">
        <span>Launch Countdown</span>
        <span>Thursday, November 19, 2026</span>
      </div>

      {mounted && t === null ? (
        <div className="gta6-hero-clock-out">
          GRAND THEFT AUTO VI IS OUT NOW
        </div>
      ) : (
        <div className="gta6-hero-clock-grid" suppressHydrationWarning>
          {cells.map(c => (
            <div key={c.label} className="gta6-hero-clock-cell">
              <b suppressHydrationWarning>{c.v}</b>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="gta6-hero-clock-foot">
        Exact regional unlock times have not been announced by Rockstar Games.
      </div>
    </div>
  )
}
