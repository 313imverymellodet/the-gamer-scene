import Link from 'next/link'

export interface RelatedItem {
  type: 'news' | 'review'
  title: string
  blurb: string
  category?: string
  score?: number
  slug: string
  href: string
}

export default function RelatedArticles({ items, heading = 'Keep Reading' }: { items: RelatedItem[]; heading?: string }) {
  if (!items.length) return null

  return (
    <section style={{
      borderTop: '2px solid var(--ink)',
      marginTop: '64px',
      paddingTop: '40px',
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--ink-soft)',
        marginBottom: '24px',
      }}>
        {heading}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: '24px',
      }}
        className="related-grid"
      >
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <article style={{
              borderTop: '2px solid var(--ink)',
              paddingTop: '16px',
              height: '100%',
              transition: 'opacity 0.15s',
            }}
              className="related-card"
            >
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: item.type === 'review' ? 'var(--ink)' : 'transparent',
                  color: item.type === 'review' ? 'var(--bg)' : 'var(--ink-soft)',
                  border: '1px solid var(--rule)',
                  padding: '2px 6px',
                }}>
                  {item.type === 'review' ? `★ ${item.score}/10` : item.category || 'NEWS'}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--serif)',
                fontSize: '1rem',
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                margin: '0 0 8px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                color: 'var(--ink-soft)',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {item.blurb}
              </p>
              <div style={{
                marginTop: '12px',
                fontFamily: 'var(--sans)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}>
                Read →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
