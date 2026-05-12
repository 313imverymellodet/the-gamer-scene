'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { TrendingItem } from '@/app/api/trending/route'

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000)    return `${Math.round(n / 1_000)}K`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n > 0 ? n.toLocaleString() : ''
}

// Module-level client cache — shared across all component instances and
// survives React re-renders and same-tab navigation. TTL: 60 seconds.
// Eliminates duplicate fetches when a user navigates between articles.
const CACHE_TTL = 60_000
let _cachedItems: TrendingItem[] | null = null
let _cacheTime = 0

function getCachedItems(): TrendingItem[] | null {
  if (_cachedItems && Date.now() - _cacheTime < CACHE_TTL) return _cachedItems
  return null
}

function setCachedItems(items: TrendingItem[]) {
  _cachedItems = items
  _cacheTime   = Date.now()
}

export default function TrendingWidget() {
  const [items, setItems]     = useState<TrendingItem[]>(() => getCachedItems() ?? [])
  const [loading, setLoading] = useState(!getCachedItems())

  useEffect(() => {
    const cached = getCachedItems()
    if (cached) {
      setItems(cached)
      setLoading(false)
      return
    }

    fetch('/api/trending?limit=7')
      .then(r => r.json())
      .then((data: TrendingItem[]) => {
        setCachedItems(data)
        setItems(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="trending-widget">
        <div className="trending-head">
          <span className="trending-label">Trending</span>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="trending-skeleton" />
        ))}
      </div>
    )
  }

  if (!items.length) return null

  return (
    <div className="trending-widget">
      <div className="trending-head">
        <span className="trending-label">▲ Most Read</span>
      </div>

      <ol className="trending-list">
        {items.map((item, i) => (
          <li key={item.slug} className="trending-item">
            <Link href={item.href} className="trending-link">
              <span className="trending-rank">{String(i + 1).padStart(2, '0')}</span>
              <div className="trending-body">
                <div className="trending-meta">
                  <span className={`trending-chip ${item.type}`}>
                    {item.type === 'review' && item.score
                      ? `★ ${item.score}`
                      : item.category}
                  </span>
                  {item.views > 0 && (
                    <span className="trending-views">{formatViews(item.views)} views</span>
                  )}
                </div>
                <div className="trending-title">{item.title}</div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
