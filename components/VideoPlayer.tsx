'use client'

import { useState, useRef } from 'react'

interface Props {
  src: string          // /videos/file.mp4  OR  https://youtube.com/...  OR  https://youtu.be/...
  title?: string
  caption?: string
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

function isYouTube(src: string) {
  return src.includes('youtube.com') || src.includes('youtu.be')
}

export default function VideoPlayer({ src, title, caption }: Props) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // ── YouTube embed ────────────────────────────────────────────────────
  if (isYouTube(src)) {
    const id = getYouTubeId(src)
    if (!id) return null
    const embedUrl = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`

    return (
      <figure className="video-figure">
        <div className="video-youtube-wrap">
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-youtube-iframe"
          />
        </div>
        {caption && <figcaption className="video-caption">{caption}</figcaption>}
      </figure>
    )
  }

  // ── Self-hosted MP4 ──────────────────────────────────────────────────
  return (
    <figure className="video-figure">
      <div className="video-self-wrap">
        {/* Custom play overlay */}
        {!playing && (
          <button
            className="video-play-btn"
            onClick={() => {
              setPlaying(true)
              videoRef.current?.play()
            }}
            aria-label="Play video"
          >
            <span className="video-play-icon">▶</span>
            {title && <span className="video-play-title">{title}</span>}
          </button>
        )}
        <video
          ref={videoRef}
          src={src}
          controls={playing}
          preload="metadata"
          playsInline
          className="video-self"
          style={{ display: 'block', width: '100%' }}
          onPlay={() => setPlaying(true)}
          onPause={() => {}}
        />
      </div>
      {caption && <figcaption className="video-caption">{caption}</figcaption>}
    </figure>
  )
}
