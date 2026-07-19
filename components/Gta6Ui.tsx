import Link from 'next/link'

export type StatusKind =
  | 'confirmed' | 'on-the-record' | 'reported' | 'analysis'
  | 'community' | 'unverified' | 'debunked' | 'scam' | 'false-or-misleading'

/**
 * Evidence chip. Always renders visible text — never color alone.
 * `kind` drives the colour; `children` sets the visible wording, so a kind can
 * carry variant labels (e.g. kind="unverified" showing "NOT ANNOUNCED").
 */
export function Status({ kind, children }: { kind: StatusKind; children: React.ReactNode }) {
  return <span className={`gta6-status ${kind}`}>{children}</span>
}

export function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '14px',
      borderBottom: '2px solid var(--ink)', paddingBottom: '10px',
      margin: '52px 0 20px',
    }}>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em',
        color: 'var(--ink-faint)',
      }}>{num}</span>
      <h2 style={{
        fontFamily: 'var(--serif)', fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
        fontWeight: 900, letterSpacing: '-0.02em', margin: 0,
      }}>{title}</h2>
    </div>
  )
}

/** Consistent trust block for every factual GTA VI page. */
export function TrustModule({
  status, statusNote, lastVerified, primarySource, stillUnknown,
}: {
  status: StatusKind
  statusNote: string
  lastVerified: string
  primarySource: string
  stillUnknown: string
}) {
  return (
    <div style={{
      border: '1.5px solid var(--rule)', background: 'var(--bg-alt)',
      padding: '14px 18px', fontFamily: 'var(--mono)', fontSize: '10px',
      letterSpacing: '0.08em', lineHeight: 2, color: 'var(--ink-soft)',
    }}>
      <div>
        <b style={{ color: 'var(--ink)' }}>STATUS:</b>{' '}
        <Status kind={status}>{status}</Status> {statusNote}
      </div>
      <div><b style={{ color: 'var(--ink)' }}>LAST VERIFIED:</b> {lastVerified}</div>
      <div><b style={{ color: 'var(--ink)' }}>PRIMARY SOURCE:</b> {primarySource}</div>
      <div><b style={{ color: 'var(--ink)' }}>STILL UNKNOWN:</b> {stillUnknown}</div>
    </div>
  )
}

/** Breadcrumb trail for GTA VI child pages. */
export function Gta6Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" style={{
      fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '10px',
    }}>
      <Link href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>
        The Gamer Scene
      </Link>
      {' · '}
      <Link href="/gta-6" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>
        GTA 6
      </Link>
      {' · '}
      <span aria-current="page">{current}</span>
    </nav>
  )
}

export const gta6Body: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.65,
  color: 'var(--ink-soft)', margin: '0 0 14px',
}

export const GTA6_DISCLAIMER =
  'This is an unofficial fan publication and is not affiliated with, endorsed by, or ' +
  'sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto, Grand Theft ' +
  'Auto VI, Rockstar Games, and related names, logos, characters, and imagery are ' +
  'trademarks and copyrighted properties of their respective owners.'
