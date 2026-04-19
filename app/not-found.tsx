import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-inter-tight), sans-serif',
      background: 'var(--bg, #f5f0e8)',
      color: 'var(--ink, #1a1a18)',
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontSize: 'clamp(80px, 20vw, 160px)',
        lineHeight: 1,
        opacity: 0.12,
        letterSpacing: '-4px',
        userSelect: 'none',
      }}>
        404
      </div>
      <div style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        opacity: 0.5,
        marginTop: -16,
        marginBottom: 24,
      }}>
        Page Not Found
      </div>
      <h1 style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 400,
        marginBottom: 16,
        maxWidth: 480,
      }}>
        This page respawned somewhere else.
      </h1>
      <p style={{
        fontSize: 15,
        opacity: 0.6,
        maxWidth: 360,
        lineHeight: 1.6,
        marginBottom: 40,
      }}>
        The article or page you&apos;re looking for has moved, been unpublished, or never existed.
      </p>
      <Link href="/" style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        border: '2px solid currentColor',
        padding: '12px 28px',
        color: 'inherit',
        display: 'inline-block',
      }}>
        ← Back to the Issue
      </Link>
      <div style={{
        marginTop: 80,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.15em',
        opacity: 0.3,
        textTransform: 'uppercase',
      }}>
        The Gamer·Scene · Est. 2019
      </div>
    </div>
  )
}
