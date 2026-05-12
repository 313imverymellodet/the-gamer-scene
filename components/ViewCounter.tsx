'use client'

import { useEffect, useState } from 'react'

interface Props {
  slug: string
  style?: React.CSSProperties
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000)    return `${Math.round(n / 1_000)}K`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function ViewCounter({ slug, style }: Props) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const storageKey = `viewed:${slug}`
    const alreadyCounted = sessionStorage.getItem(storageKey)

    if (alreadyCounted) {
      // Already counted this session — fetch current count without incrementing
      fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
        .then(r => r.json())
        .then(d => setViews(d.views ?? 0))
        .catch(() => setViews(null))
    } else {
      // First view this session — increment and mark as counted
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
        .then(r => r.json())
        .then(d => {
          setViews(d.views ?? 0)
          try { sessionStorage.setItem(storageKey, '1') } catch { /* private browsing */ }
        })
        .catch(() => setViews(null))
    }
  }, [slug])

  if (views === null) return null

  return (
    <span style={style}>
      {formatViews(views)} {views === 1 ? 'view' : 'views'}
    </span>
  )
}
