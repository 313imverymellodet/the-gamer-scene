'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  src?: string
  alt: string
  category?: string
  title: string
}

// Category → background + accent color
const CATEGORY_STYLES: Record<string, { bg: string; accent: string; text: string }> = {
  INDUSTRY:  { bg: '#1a0a08', accent: '#c0392b', text: '#f5f0e8' },
  REVIEW:    { bg: '#0a0a10', accent: '#e67e22', text: '#f5f0e8' },
  PREVIEW:   { bg: '#08101a', accent: '#2980b9', text: '#f5f0e8' },
  GUIDE:     { bg: '#081408', accent: '#27ae60', text: '#f5f0e8' },
  DEAL:      { bg: '#081414', accent: '#16a085', text: '#f5f0e8' },
  LEAK:      { bg: '#100816', accent: '#8e44ad', text: '#f5f0e8' },
  WEEKLY:    { bg: '#0e0e0e', accent: '#888',    text: '#f5f0e8' },
  OPINION:   { bg: '#0e0a04', accent: '#d4a017', text: '#f5f0e8' },
  HOT:       { bg: '#180606', accent: '#c0392b', text: '#f5f0e8' },
}

const DEFAULT_STYLE = { bg: '#111', accent: '#888', text: '#f5f0e8' }

export default function ArticleHero({ src, alt, category = '', title }: Props) {
  const [imgFailed, setImgFailed] = useState(false)

  const showFallback = !src || imgFailed
  const style = CATEGORY_STYLES[category.toUpperCase()] || DEFAULT_STYLE

  if (showFallback) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '21/9',
        background: style.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '32px',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(${style.accent}11 1px, transparent 1px),
            linear-gradient(90deg, ${style.accent}11 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Accent corner */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '4px', height: '100%',
          background: style.accent,
        }} />

        {/* Category label */}
        <div style={{
          position: 'absolute', top: '20px', left: '20px',
          fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: style.accent,
          background: `${style.bg}cc`, padding: '4px 10px',
          border: `1px solid ${style.accent}44`,
        }}>
          {category || 'THE GAMER SCENE'}
        </div>

        {/* Publication watermark */}
        <div style={{
          position: 'absolute', bottom: '20px', right: '24px',
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: `${style.text}33`,
        }}>
          thegamerscene.news
        </div>
      </div>
    )
  }

  // External URL (http/https) — use regular <img> since Next.js Image needs domain config
  const isExternal = src.startsWith('http')

  if (isExternal) {
    return (
      <div style={{ margin: '0 0 36px', lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', display: 'block' }}
          onError={() => setImgFailed(true)}
        />
      </div>
    )
  }

  // Local image — use Next.js Image for optimization (WebP, lazy load, responsive)
  return (
    <div style={{ margin: '0 0 36px', position: 'relative', width: '100%', aspectRatio: '16/9' }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        style={{ objectFit: 'cover', display: 'block' }}
        priority
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}
