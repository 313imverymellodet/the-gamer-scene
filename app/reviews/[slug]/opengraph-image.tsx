import { ImageResponse } from 'next/og'
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/content'

export const runtime = 'edge'
export const alt = 'The Gamer Scene — Review'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllReviewSlugs().map(slug => ({ slug }))
}

function scoreColor(score: number): string {
  if (score >= 9) return '#c0392b'   // red/hot
  if (score >= 8) return '#e67e22'   // orange
  if (score >= 7) return '#2980b9'   // blue
  return '#666'
}

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  const review = getReviewBySlug(params.slug)
  const title    = review?.title  || 'Review'
  const studio   = review?.studio || ''
  const score    = review?.score  ?? 0
  const pull     = review?.pull   || ''
  const platforms = review?.platforms?.join(' · ') || ''

  const color = scoreColor(score)
  const displayPull = pull.length > 130 ? pull.slice(0, 127) + '…' : pull

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a18',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Score accent bar */}
        <div style={{ height: 6, background: color, width: '100%', display: 'flex' }} />

        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 60px',
          borderBottom: '1px solid #333',
        }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#f5f0e8',
          }}>
            The Gamer Scene
          </div>
          <div style={{
            background: '#f5f0e8',
            color: '#1a1a18',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            display: 'flex',
          }}>
            REVIEW
          </div>
        </div>

        {/* Main */}
        <div style={{
          flex: 1,
          display: 'flex',
          padding: '40px 60px',
          gap: 48,
          alignItems: 'center',
        }}>
          {/* Score block */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
            width: 160,
          }}>
            <div style={{
              fontFamily: 'serif',
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 1,
              color: color,
            }}>
              {score}
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 14,
              letterSpacing: '0.15em',
              color: '#666',
            }}>
              / 10
            </div>
            <div style={{
              marginTop: 8,
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: color,
            }}>
              {score >= 9.5 ? 'ESSENTIAL' : score >= 9 ? 'OUTSTANDING' : score >= 8 ? 'GREAT' : score >= 7 ? 'GOOD' : 'MIXED'}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, alignSelf: 'stretch', background: '#333', display: 'flex' }} />

          {/* Text */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#888',
              marginBottom: 12,
            }}>
              {studio}{platforms ? ` · ${platforms}` : ''}
            </div>
            <div style={{
              fontFamily: 'serif',
              fontSize: title.length > 50 ? 36 : 44,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              color: '#f5f0e8',
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
            }}>
              {title}
            </div>
            {displayPull && (
              <div style={{
                fontFamily: 'serif',
                fontSize: 17,
                fontStyle: 'italic',
                lineHeight: 1.5,
                color: '#aaa',
                display: 'flex',
                flexWrap: 'wrap',
              }}>
                &ldquo;{displayPull}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 60px',
          borderTop: '1px solid #333',
          background: '#111',
        }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#555',
          }}>
            thegamerscene.news
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            letterSpacing: '0.12em',
            color: color,
            fontWeight: 700,
          }}>
            READ FULL REVIEW →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
