import { ImageResponse } from 'next/og'
import { getNewsItemBySlug } from '@/lib/content'

export const alt = 'The Gamer Scene'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Category → accent color mapping
const CAT_COLORS: Record<string, string> = {
  'INDUSTRY':  '#c0392b',
  'REVIEW':    '#1a1a18',
  'PREVIEW':   '#2c3e50',
  'DEAL':      '#16a085',
  'LEAK':      '#8e44ad',
  'LIVE':      '#e67e22',
  'COMING':    '#2980b9',
  'HOT':       '#c0392b',
  'WEEKLY':    '#1a1a18',
  'GUIDE':     '#27ae60',
}

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  const item = getNewsItemBySlug(params.slug)
  const title    = item?.title    || 'The Gamer Scene'
  const category = item?.category || 'NEWS'
  const blurb    = item?.blurb    || ''

  const accentColor = CAT_COLORS[category.toUpperCase()] || '#1a1a18'

  // Truncate title for display
  const displayTitle = title.length > 80 ? title.slice(0, 77) + '…' : title
  const displayBlurb = blurb.length > 120 ? blurb.slice(0, 117) + '…' : blurb

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f0e8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 6, background: accentColor, width: '100%', display: 'flex' }} />

        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 60px',
          borderBottom: '1px solid #ddd',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#1a1a18',
          }}>
            The Gamer Scene
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#888',
          }}>
            thegamerscene.news
          </div>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 60px',
          gap: 0,
        }}>
          {/* Category chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              background: accentColor,
              color: '#f5f0e8',
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              display: 'flex',
            }}>
              {category}
            </div>
          </div>

          {/* Title */}
          <div style={{
            fontFamily: 'serif',
            fontSize: displayTitle.length > 60 ? 38 : 48,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            color: '#1a1a18',
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
          }}>
            {displayTitle}
          </div>

          {/* Blurb */}
          {displayBlurb && (
            <div style={{
              fontFamily: 'sans-serif',
              fontSize: 18,
              lineHeight: 1.5,
              color: '#666',
              display: 'flex',
              flexWrap: 'wrap',
            }}>
              {displayBlurb}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 60px',
          borderTop: '1px solid #ddd',
          background: '#f0ebe0',
        }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#888',
          }}>
            An independent gaming publication
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            letterSpacing: '0.12em',
            color: accentColor,
            fontWeight: 700,
          }}>
            READ →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
