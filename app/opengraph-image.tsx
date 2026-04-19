import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'The Gamer Scene — An independent gaming publication'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f0e8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* Top rule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ height: 3, background: '#1a1a18', width: '100%' }} />
          <div style={{ height: 1, background: '#1a1a18', width: '100%', marginTop: 4 }} />
        </div>

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'serif',
            fontSize: 14,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: 24,
          }}>
            An Independent Gaming Publication
          </div>
          <div style={{
            fontFamily: 'serif',
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.95,
            color: '#1a1a18',
            letterSpacing: '-2px',
          }}>
            The Gamer
          </div>
          <div style={{
            fontFamily: 'serif',
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.95,
            color: '#1a1a18',
            letterSpacing: '-2px',
          }}>
            Scene
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #ccc',
          paddingTop: 24,
        }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 13,
            letterSpacing: '0.12em',
            color: '#888',
            textTransform: 'uppercase',
          }}>
            Reviews · News · Criticism · Published Weekly
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 13,
            letterSpacing: '0.12em',
            color: '#888',
          }}>
            Est. 2019
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
