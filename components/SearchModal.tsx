'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import type { SearchItem } from '@/app/api/search/route'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchItem[]>([])
  const [results, setResults] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fuseRef = useRef<Fuse<SearchItem> | null>(null)

  // Fetch search index once
  useEffect(() => {
    if (items.length > 0) return
    setLoading(true)
    fetch('/api/search')
      .then(r => r.json())
      .then((data: SearchItem[]) => {
        setItems(data)
        fuseRef.current = new Fuse(data, {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'blurb', weight: 1 },
            { name: 'category', weight: 0.5 },
          ],
          threshold: 0.35,
          includeScore: true,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [items.length])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Run search
  useEffect(() => {
    if (!query.trim() || !fuseRef.current) {
      setResults([])
      return
    }
    const r = fuseRef.current.search(query).map(res => res.item)
    setResults(r.slice(0, 8))
  }, [query])

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!isOpen) return null

  const showDefault = !query.trim()
  const recent = items.slice(0, 5)

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search articles, reviews, games…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {/* Results */}
        <div className="search-results">
          {loading && (
            <div className="search-empty">Loading index…</div>
          )}

          {!loading && showDefault && (
            <>
              <div className="search-section-label">Recent articles</div>
              {recent.map(item => (
                <SearchResultRow key={item.href} item={item} onClose={onClose} />
              ))}
            </>
          )}

          {!loading && !showDefault && results.length === 0 && (
            <div className="search-empty">
              No results for <strong>&ldquo;{query}&rdquo;</strong>
            </div>
          )}

          {!loading && !showDefault && results.length > 0 && (
            <>
              <div className="search-section-label">{results.length} result{results.length !== 1 ? 's' : ''}</div>
              {results.map(item => (
                <SearchResultRow key={item.href} item={item} onClose={onClose} />
              ))}
            </>
          )}
        </div>

        <div className="search-footer">
          <span>↵ open</span>
          <span>ESC close</span>
          <span>{items.length} articles indexed</span>
        </div>
      </div>
    </div>
  )
}

function SearchResultRow({ item, onClose }: { item: SearchItem; onClose: () => void }) {
  return (
    <Link href={item.href} className="search-result-row" onClick={onClose}>
      <div className="search-result-meta">
        <span className={`search-chip ${item.type}`}>
          {item.type === 'review' ? `★ ${item.score}/10` : item.category || 'NEWS'}
        </span>
      </div>
      <div className="search-result-body">
        <div className="search-result-title">{item.title}</div>
        <div className="search-result-blurb">{item.blurb}</div>
      </div>
    </Link>
  )
}
