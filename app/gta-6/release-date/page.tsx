import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import Gta6CountdownHero from '@/components/Gta6CountdownHero'
import JsonLd from '@/components/JsonLd'
import {
  Status, SectionHead, TrustModule, Gta6Breadcrumbs,
  gta6Body as body, GTA6_DISCLAIMER,
} from '@/components/Gta6Ui'

const BASE = 'https://thegamerscene.news'
const URL = `${BASE}/gta-6/release-date`
const LAST_VERIFIED = 'November 18, 2026'

export const metadata: Metadata = {
  title: 'GTA 6 Release Date: Latest Official GTA VI Launch Update',
  description:
    'See the official GTA 6 release date, confirmed platforms, preload information, launch timeline and every verified schedule update from Rockstar Games.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'GTA 6 Release Date: Latest Official GTA VI Launch Update',
    description:
      'Grand Theft Auto VI launches November 19, 2026 on PS5 and Xbox Series X|S. Track the full launch timeline, unlock time, preload date and download size.',
    type: 'article',
    url: URL,
    siteName: 'The Gamer Scene',
    images: [{ url: `${BASE}/images/news/gta6-release.jpg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Release Date: Latest Official GTA VI Launch Update',
    description:
      'GTA 6 launches November 19, 2026 on PS5 and Xbox Series X|S. Full timeline, unlock time, preload date and download size.',
    site: '@thegamerscene',
  },
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FACTS: Array<[string, string, 'confirmed' | 'reported' | 'unverified']> = [
  ['Release date', 'Thursday, November 19, 2026', 'confirmed'],
  ['Platforms at launch', 'PlayStation 5, Xbox Series X|S', 'confirmed'],
  ['Pre-orders opened', 'June 25, 2026', 'confirmed'],
  ['Pre-load', 'Open since November 10, 2026', 'confirmed'],
  ['Unlock time', 'Midnight local time, November 19', 'confirmed'],
  ['Download size', 'Up to 212 GB', 'confirmed'],
  ['PC release date', 'Not announced', 'confirmed'],
  ['PS4 / Xbox One', 'Not supported', 'confirmed'],
  ['Nintendo Switch 2', 'Not announced', 'unverified'],
  ['Development status', 'Complete, per Take-Two', 'confirmed'],
  ['Another delay', 'None. The rollout has begun', 'confirmed'],
]

// Dates from Rockstar/Take-Two listings (current window) and from The Gamer
// Scene's own prior reporting (pre-2026 history) — attributed inline below.
const TIMELINE: Array<{
  date: string
  event: string
  status: 'confirmed' | 'reported'
  href?: string
}> = [
  { date: 'Sep 2022',  event: 'Development footage leaks online, forcing Rockstar to acknowledge the breach publicly.', status: 'reported' },
  { date: 'Feb 2023',  event: 'Take-Two and Rockstar officially confirm Grand Theft Auto VI is in development.', status: 'confirmed' },
  { date: 'Dec 2023',  event: 'Trailer 1 premieres and breaks YouTube’s 24-hour view record for a game trailer.', status: 'confirmed' },
  { date: '2024',      event: 'Trailer 2 arrives, expanding on Leonida, the dual-protagonist structure, and Vice City.', status: 'confirmed' },
  { date: 'Original',  event: 'Launch window first targeted for Fall 2025.', status: 'reported' },
  { date: 'Delay 1',   event: 'Window moves from Fall 2025 to May 2026 for additional polish.', status: 'reported' },
  { date: 'Delay 2',   event: 'Window moves from May 2026 to November 19, 2026 for the holiday release corridor.', status: 'reported', href: '/news/2026-04-16-gta6-fiscal-year' },
  { date: 'Apr 2026',  event: 'Take-Two enters the fiscal year containing the launch — the strongest signal yet that the date holds.', status: 'confirmed', href: '/news/2026-04-16-gta6-fiscal-year' },
  { date: 'Jun 18, 2026', event: 'Rockstar Newswire announces pre-order details.', status: 'confirmed' },
  { date: 'Jun 25, 2026', event: 'Pre-orders open for Standard ($79.99) and Ultimate ($99.99) editions.', status: 'confirmed' },
  { date: 'Jul 16, 2026', event: 'Newzoo estimates the strongest pre-order opening in its dataset (~$260M worldwide, week one).', status: 'reported', href: '/news/2026-07-17-gta-6-preorder-record-newzoo-estimate' },
  { date: 'Aug 7, 2026',  event: 'Take-Two fiscal Q1 2027 earnings call — next known corporate checkpoint.', status: 'confirmed' },
  { date: 'Nov 9, 2026', event: 'Take-Two says development is complete and preorders are far above expectations.', status: 'confirmed', href: '/news/2026-11-18-gta-6-1-5-billion-preorders' },
  { date: 'Nov 10, 2026', event: 'Pre-load begins on PS5 and Xbox Series X|S.', status: 'confirmed', href: '/news/2026-11-05-gta-6-preload-guide' },
  { date: 'Nov 18, 2026', event: 'Reviews publish, with a 99 on Metacritic. Rollout begins in New Zealand as midnight arrives there.', status: 'reported', href: '/news/2026-11-18-gta-6-reviews-metacritic-99-roundup' },
  { date: 'Nov 19, 2026', event: 'Grand Theft Auto VI launches on PS5 and Xbox Series X|S.', status: 'confirmed' },
]

const FAQ: Array<[string, string]> = [
  ['When exactly does GTA 6 come out?',
   'Grand Theft Auto VI releases Thursday, November 19, 2026 on PlayStation 5 and Xbox Series X|S. It unlocks at midnight local time, so players in New Zealand get it first and the launch moves west.'],
  ['Has GTA 6 been delayed again?',
   'No. After moving from Fall 2025 to May 2026 and then to November 19, 2026, the game is complete and the worldwide rollout has begun.'],
  ['What time does GTA 6 unlock?',
   'Midnight local time on November 19, 2026, in every region. See our time-zone guide for when that happens around the world.'],
  ['When can I pre-load GTA 6?',
   'Pre-load opened November 10, 2026. Rockstar says it requires up to 212 GB depending on your device.'],
  ['Is GTA 6 coming to PC on November 19?',
   'No. GTA 6 launches on PS5 and Xbox Series X|S only. Rockstar has not announced a PC version. A GamesBeat report points to the first quarter of 2027, but that is unconfirmed.'],
  ['Is the launch still at risk of a delay?',
   'No. Take-Two has said development is complete, reviews are published and the game is already unlocking in the first time zones.'],
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'GTA 6 release date and launch timeline',
    description:
      'The official GTA 6 release date is November 19, 2026 on PS5 and Xbox Series X|S. Full launch timeline, unlock time, preload date and download size.',
    url: URL,
    datePublished: '2026-07-18T12:00:00Z',
    dateModified: '2026-11-18T12:00:00Z',
    author: { '@type': 'Organization', name: 'The Gamer Scene', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'The Gamer Scene',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
    about: {
      '@type': 'VideoGame',
      name: 'Grand Theft Auto VI',
      alternateName: ['GTA 6', 'GTA VI'],
      gamePlatform: ['PlayStation 5', 'Xbox Series X|S'],
      publisher: { '@type': 'Organization', name: 'Rockstar Games' },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'The Gamer Scene', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'GTA 6', item: `${BASE}/gta-6` },
      { '@type': 'ListItem', position: 3, name: 'Release date', item: URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Gta6ReleaseDatePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <JsonLd data={jsonLd} />
      <SiteHeader active="gta-6" hideCountdown />

      <main id="main-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        <Gta6Breadcrumbs current="Release date" />

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02,
          margin: '0 0 18px',
        }}>
          GTA 6 release date and launch timeline
        </h1>

        {/* Answer-first */}
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '1.08rem', lineHeight: 1.55,
          color: 'var(--ink)', margin: '0 0 20px', maxWidth: '62ch',
        }}>
          <strong>Grand Theft Auto VI (GTA 6) releases Thursday, November 19, 2026</strong> on
          PlayStation 5 and Xbox Series X|S. It unlocks at midnight local time, rolling
          around the world from New Zealand. Pre-load opened November 10, 2026, and the download
          requires up to 212 GB. Rockstar has not announced a PC version.
        </p>

        <TrustModule
          status="confirmed"
          statusNote="date and unlock time per Rockstar"
          lastVerified={LAST_VERIFIED}
          primarySource="Rockstar Games and Take-Two Interactive official listings"
          stillUnknown="PC date · GTA 6 Online plan"
        />

        <Gta6CountdownHero />

        {/* Quick facts */}
        <SectionHead num="§ 01" title="Launch facts at a glance" />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>Detail</th><th>Current status</th><th>Evidence</th></tr></thead>
            <tbody>
              {FACTS.map(([k, v, s]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                  <td><Status kind={s}>{s}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Platforms */}
        <SectionHead num="§ 02" title="Which platforms get GTA 6 on day one" />
        <p style={body}>
          Only two: <strong>PlayStation 5</strong> and <strong>Xbox Series X|S</strong>. GTA 6 is
          not playable on PS4 or Xbox One, there is no announced Nintendo Switch 2 version, and
          there is no PC release date. PlayStation&rsquo;s listing describes the game as a
          single-player experience with DualSense vibration and trigger support and a PS5/PS5 Pro
          Enhanced label — that label does not promise any specific resolution or frame rate.
        </p>
        <p style={body}>
          If you are on PC, read our{' '}
          <Link href="/gta-6/pc" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
            current GTA 6 PC release date status
          </Link>{' '}
          before buying anything — Rockstar has not announced a PC release date.
        </p>

        {/* Timeline */}
        <SectionHead num="§ 03" title="The full GTA 6 announcement and delay timeline" />
        <p style={body}>
          Two delays moved GTA 6 from an original Fall 2025 target to its current date. Here is
          how the schedule arrived at November 19, 2026.
        </p>
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>When</th><th>What happened</th><th>Evidence</th></tr></thead>
            <tbody>
              {TIMELINE.map(t => (
                <tr key={t.date + t.event}>
                  <td>{t.date}</td>
                  <td>
                    {t.href ? (
                      <Link href={t.href} style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                        {t.event}
                      </Link>
                    ) : t.event}
                  </td>
                  <td><Status kind={t.status}>{t.status}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...body, fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
          Pre-2026 entries reflect The Gamer Scene&rsquo;s prior reporting on the announcement and
          delay history; 2026 entries follow Rockstar and Take-Two&rsquo;s official listings.
        </p>

        {/* Preload */}
        <SectionHead num="§ 04" title="Pre-load and launch times" />
        <p style={body}>
          <Status kind="confirmed">Confirmed</Status>&nbsp; <strong>Pre-load opened November 10,
          2026</strong> and requires <strong>up to 212 GB</strong>, depending on your device. Boxed
          copies contain a download code, not a disc. Read our{' '}
          <Link href="/news/2026-11-05-gta-6-preload-guide" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
            GTA 6 preload and file size guide
          </Link>.
        </p>
        <p style={body}>
          <Status kind="confirmed">Confirmed</Status>&nbsp; <strong>GTA 6 unlocks at midnight local
          time on November 19.</strong> New Zealand is first, and the launch moves west with each
          time zone. See{' '}
          <Link href="/news/2026-11-18-gta-6-release-time-every-time-zone" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
            GTA 6 unlock times around the world
          </Link>.
        </p>

        {/* Will it slip */}
        <SectionHead num="§ 05" title="Could GTA 6 still be delayed?" />
        <p style={body}>
          No. Take-Two said on its November earnings call that development is complete, reviews
          have been published, and the rollout has started in the first time zones. After moving
          from Fall 2025 to May 2026 and then to November 19, 2026, the date held.
        </p>

        {/* Still unknown */}
        <SectionHead num="§ 06" title="What is still unknown" />
        <ul style={{ ...body, paddingLeft: '1.2em' }}>
          <li>Whether and when a PC version will be announced</li>
          <li>Whether and when GTA 6 Online will launch</li>
          <li>The full voice cast and complete radio lineup</li>
          <li>Official sales figures from Rockstar or Take-Two</li>
        </ul>

        {/* FAQ */}
        <SectionHead num="§ 07" title="GTA 6 release date FAQ" />
        <div>
          {FAQ.map(([q, a]) => (
            <details key={q} style={{ borderBottom: '1px solid var(--rule)', padding: '4px 0' }}>
              <summary style={{
                fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1rem',
                padding: '12px 0', cursor: 'pointer', color: 'var(--ink)',
              }}>
                {q}
              </summary>
              <p style={{ ...body, paddingBottom: '14px', margin: 0 }}>{a}</p>
            </details>
          ))}
        </div>

        {/* Related */}
        <SectionHead num="§ 08" title="Related GTA 6 coverage" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['/gta-6', 'GTA 6 hub: everything confirmed about Grand Theft Auto VI'],
            ['/gta-6/pc', 'GTA 6 PC release date: no date has been announced'],
            ['/news/2026-07-17-gta-6-preorder-record-newzoo-estimate', 'GTA 6 Just Opened the Strongest Preorder Campaign Newzoo Has Ever Tracked'],
            ['/news/2026-04-22-gta6-trailer-3-when-and-what-to-expect', 'GTA 6 Trailer 3: When Is It Coming and What Should We Expect?'],
            ['/news/2026-04-16-gta6-fiscal-year', 'GTA 6 Is Officially in Its Release Year — November 19 Holds Firm'],
          ].map(([href, title]) => (
            <li key={href} style={{ borderBottom: '1px solid var(--rule)' }}>
              <Link href={href} style={{
                display: 'block', padding: '14px 0', textDecoration: 'none',
                color: 'var(--ink)', fontFamily: 'var(--serif)', fontWeight: 700,
                fontSize: '1rem', lineHeight: 1.3,
              }}>
                {title} <span aria-hidden="true" style={{ color: 'var(--hot)' }}>→</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Change log */}
        <SectionHead num="§ 09" title="Change log" />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>Date</th><th>Change</th></tr></thead>
            <tbody>
              <tr>
                <td>Nov 18, 2026</td>
                <td>Corrected the pre-load date to November 10. Added the midnight-local unlock time, 212 GB download size, completed development status and review launch.</td>
              </tr>
              <tr>
                <td>Jul 18, 2026</td>
                <td>Page published. Release date, platforms, pre-order and pre-load dates verified against Rockstar and Take-Two listings.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em',
          color: 'var(--ink-faint)', marginTop: '40px', lineHeight: 1.8,
          borderTop: '1px solid var(--rule)', paddingTop: '16px',
        }}>
          Page last verified {LAST_VERIFIED}. {GTA6_DISCLAIMER}
        </p>
      </main>

      <footer style={{
        borderTop: '2px solid var(--ink)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--ink-faint)',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE · EST. 2013</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/gta-6"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>GTA 6 Hub</Link>
          <Link href="/news"    style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>News</Link>
          <Link href="/reviews" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Reviews</Link>
          <Link href="/about"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/"        style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Latest Issue →</Link>
        </div>
      </footer>
    </div>
  )
}
