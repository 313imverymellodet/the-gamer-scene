'use client'

import { useState } from 'react'

interface Props {
  title: string
  url?: string   // defaults to window.location.href
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => url || (typeof window !== 'undefined' ? window.location.href : '')

  const shareX = () => {
    const text = encodeURIComponent(`${title} — The Gamer Scene`)
    const link = encodeURIComponent(getUrl())
    window.open(`https://x.com/intent/tweet?text=${text}&url=${link}`, '_blank', 'noopener,width=600,height=400')
  }

  const shareBluesky = () => {
    const text = encodeURIComponent(`${title} — The Gamer Scene\n${getUrl()}`)
    window.open(`https://bsky.app/intent/compose?text=${text}`, '_blank', 'noopener,width=600,height=500')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback — select a temp input
      const el = document.createElement('input')
      el.value = getUrl()
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: getUrl() })
      } catch { /* user cancelled */ }
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="share-row">
      <span className="share-label">Share</span>

      {canNativeShare && (
        <button className="share-btn" onClick={shareNative} aria-label="Share">
          ↑ Share
        </button>
      )}

      <button className="share-btn" onClick={shareX} aria-label="Share on X">
        𝕏
      </button>

      <button className="share-btn" onClick={shareBluesky} aria-label="Share on Bluesky">
        🦋
      </button>

      <button
        className={`share-btn share-copy${copied ? ' copied' : ''}`}
        onClick={copyLink}
        aria-label="Copy link"
      >
        {copied ? '✓ Copied' : '⧉ Copy Link'}
      </button>
    </div>
  )
}
