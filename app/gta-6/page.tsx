import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import Gta6CountdownHero from '@/components/Gta6CountdownHero'
import JsonLd from '@/components/JsonLd'
import {
  Status, SectionHead, TrustModule,
  gta6Body as body, GTA6_DISCLAIMER,
  type StatusKind,
} from '@/components/Gta6Ui'

const BASE = 'https://thegamerscene.news'
const LAST_VERIFIED = 'July 18, 2026'

export const metadata: Metadata = {
  title: 'GTA 6: Release Date, News, Trailers and Everything Confirmed',
  description:
    'Follow verified GTA 6 news, the official November 19, 2026 release date, trailers, characters, Leonida locations, editions, PC status, rumors and launch updates.',
  alternates: { canonical: `${BASE}/gta-6` },
  openGraph: {
    title: 'GTA 6: Release Date, News, Trailers and Everything Confirmed',
    description:
      'The source-first GTA 6 hub — official release date countdown, confirmed characters and Leonida locations, editions, PC status, rumor tracker and scam warnings.',
    type: 'website',
    url: `${BASE}/gta-6`,
    siteName: 'The Gamer Scene',
    images: [{ url: `${BASE}/images/news/gta6-release.jpg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6: Release Date, News, Trailers and Everything Confirmed',
    description:
      'Official GTA 6 release date countdown, confirmed facts, rumor tracker and scam warnings — updated through launch.',
    site: '@thegamerscene',
  },
}

// ─── Data (dossier snapshot, July 18 2026 — verified facts only) ─────────────

const QUICK_FACTS: Array<[string, string, StatusKind]> = [
  ['Release date', 'Thursday, November 19, 2026', 'confirmed'],
  ['Platforms', 'PlayStation 5 and Xbox Series X|S', 'confirmed'],
  ['PC version', 'No PC version or date announced', 'confirmed'],
  ['Setting', 'Vice City and the state of Leonida', 'confirmed'],
  ['Protagonists', 'Jason Duval and Lucia Caminos', 'confirmed'],
  ['Standard Edition', '$79.99 US MSRP (PlayStation listing)', 'confirmed'],
  ['Ultimate Edition', '$99.99 US MSRP (PlayStation listing)', 'confirmed'],
  ['Pre-orders', 'Opened June 25, 2026', 'confirmed'],
  ['Pre-load', 'November 12, 2026 (Rockstar Store listing)', 'confirmed'],
  ['Physical package', 'Rockstar Store package is code-in-box — no disc', 'confirmed'],
  ['Install size', 'Not announced', 'confirmed'],
  ['Age rating', 'Not final at last check', 'confirmed'],
  ['GTA 6 Online', 'Unannounced; online development reported', 'reported'],
  ['Trailer 3', 'Not announced', 'confirmed'],
]

const CHARACTERS: Array<[string, string]> = [
  ['Jason Duval', 'Grew up around grifters and crooks, spent time in the Army, and later worked for drug runners in the Leonida Keys. His relationship with Lucia is central to the story.'],
  ['Lucia Caminos', 'Learned to fight from her father, spent time in prison, and is focused on changing the odds for herself and her family. Originally from Liberty City.'],
  ['Cal Hampton', "An associate of Jason's who is more comfortable monitoring Coast Guard communications and conspiracy theories than being at the center of the action."],
  ['Boobie Ike', 'A Vice City figure with interests in real estate, a strip club, and music, connected to Only Raw Records and Dre’Quan Priest.'],
  ['Dre’Quan Priest', 'A hustler focused on making it in music rather than remaining in the streets. He signs Real Dimez through Only Raw Records.'],
  ['Real Dimez', 'Bae-Luxe and Roxy, a rap and social-media duo whose history and online presence are part of their rise.'],
  ['Raul Bautista', 'An experienced bank robber who searches for talented people willing to take major risks for major rewards.'],
  ['Brian Heder', 'An old-school drug runner in the Keys who lets Jason live on one of his properties in exchange for work.'],
]

const REGIONS: Array<[string, string]> = [
  ['Vice City', 'The major urban center — the modern return of the franchise’s Miami-inspired setting.'],
  ['Leonida Keys', 'Island communities, waterways, fishing culture, smuggling routes, and coastal life.'],
  ['Grassrivers', 'Wetland territory inspired by southern Florida’s marsh and alligator country.'],
  ['Port Gellhorn', 'A weathered coastal city and former tourism hub.'],
  ['Ambrosia', 'An industrial area tied to sugar production and local power.'],
  ['Mount Kalaga National Park', 'Northern wilderness — trails, hunting territory, and off-road terrain.'],
]

const RUMORS: Array<{ claim: string; status: StatusKind; label: string; note: string }> = [
  { claim: 'GTA 6 has already earned $1 billion in pre-orders', status: 'debunked', label: 'DEBUNKED', note: 'Newzoo explicitly rejected the viral figure. Its own estimate is roughly $260M in first-week global digital pre-orders — a modeled estimate, not a Rockstar figure.' },
  { claim: 'Trailer 3 has an official date', status: 'unverified', label: 'UNVERIFIED', note: 'Rockstar’s media library lists no Trailer 3. Treat any "official Trailer 3" upload as fake unless it appears on Rockstar’s verified channels.' },
  { claim: 'GTA 6’s file size is 676.7GB', status: 'debunked', label: 'DEBUNKED', note: 'No official install size exists. The viral storage screenshot is not authoritative.' },
  { claim: 'PS5 Pro will run GTA 6 at 60fps', status: 'unverified', label: 'UNSUPPORTED', note: 'Rockstar has not announced frame-rate or resolution modes. Technical analysts consider a 30fps baseline more realistic, with a 40fps mode plausible — that is analysis, not confirmation.' },
  { claim: 'GTA 6 Online launches with the base game on November 19', status: 'unverified', label: 'UNVERIFIED', note: 'Court-document reporting supports online development work (including a reported 32-player internal session), but no launch plan, mode design, or final player count is confirmed.' },
  { claim: 'The fan-made State of Leonida map is the official map', status: 'community', label: 'COMMUNITY', note: 'Rockstar has not released a complete map. Fan reconstructions are community projects, not canon.' },
  { claim: 'A public GTA 6 beta or paid early access exists', status: 'scam', label: 'SCAM', note: 'No public beta or early-access program has been announced. Sites offering one are scams — see the warning below.' },
]

const FAQ: Array<[string, string]> = [
  ['When does GTA 6 come out?', 'Grand Theft Auto VI releases Thursday, November 19, 2026 on PlayStation 5 and Xbox Series X|S, per Rockstar Games’ official listing. Exact regional unlock times have not been announced.'],
  ['Is GTA 6 coming to PC?', 'No PC version or PC release date has been announced. Rockstar has historically brought GTA games to PC after console launch, but any specific PC date you see is unverified.'],
  ['How much does GTA 6 cost?', 'At our last check, the Standard Edition is listed at $79.99 US MSRP and the Ultimate Edition at $99.99 US MSRP on PlayStation. Prices can vary by country, taxes, and retailer.'],
  ['Who are the GTA 6 main characters?', 'Jason Duval and Lucia Caminos are the confirmed protagonists. The confirmed supporting cast includes Cal Hampton, Boobie Ike, Dre’Quan Priest, Real Dimez, Raul Bautista, and Brian Heder.'],
  ['Where is GTA 6 set?', 'GTA 6 is set in Vice City and the wider state of Leonida, with six officially named regions: Vice City, the Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, and Mount Kalaga National Park.'],
  ['Is there a GTA 6 beta?', 'No. Rockstar has not announced any public beta or early-access program. Every "GTA 6 beta," "VIP early access," or crypto-payment download offer is a scam.'],
  ['Has Trailer 3 been released?', 'No. As of our last verification, Rockstar’s official media library lists Trailer 1, Trailer 2, the cover-art animation, and eight character clips — no Trailer 3. Verify any new video against Rockstar’s official channels.'],
]

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Grand Theft Auto VI',
    alternateName: ['GTA 6', 'GTA VI'],
    url: `${BASE}/gta-6`,
    description:
      'Grand Theft Auto VI (GTA 6) is Rockstar Games’ upcoming open-world game set in Vice City and the state of Leonida, releasing November 19, 2026 on PS5 and Xbox Series X|S.',
    gamePlatform: ['PlayStation 5', 'Xbox Series X|S'],
    publisher: { '@type': 'Organization', name: 'Rockstar Games' },
    datePublished: '2026-11-19',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'The Gamer Scene', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'GTA 6', item: `${BASE}/gta-6` },
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

export default function Gta6HubPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <JsonLd data={jsonLd} />
      <SiteHeader active="gta-6" hideCountdown />

      <main id="main-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px',
        }}>
          The Gamer Scene · GTA VI Hub · Updated through launch
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02,
          margin: '0 0 18px',
        }}>
          GTA 6: everything confirmed about <em style={{ color: 'var(--hot)' }}>Grand Theft Auto VI</em>
        </h1>

        {/* Answer-first block */}
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '1.08rem', lineHeight: 1.55,
          color: 'var(--ink)', margin: '0 0 20px', maxWidth: '62ch',
        }}>
          <strong>Grand Theft Auto VI (GTA 6) releases Thursday, November 19, 2026</strong> on
          PlayStation 5 and Xbox Series X|S. It stars Jason Duval and Lucia Caminos in Vice City
          and the state of Leonida, in Standard ($79.99) and Ultimate ($99.99) editions. No PC
          version, no GTA 6 Online plan, and no Trailer 3 have been announced.
        </p>

        {/* Trust module */}
        <TrustModule
          status="confirmed"
          statusNote="core facts, with rumor labels inline"
          lastVerified={LAST_VERIFIED}
          primarySource="Rockstar Games official listings and media library"
          stillUnknown="PC date · GTA 6 Online plan · install size · final age rating · frame-rate modes · Trailer 3"
        />

        {/* Countdown centerpiece */}
        <Gta6CountdownHero />

        <p style={{ ...body, textAlign: 'center', margin: '-18px 0 0' }}>
          <Link href="/gta-6/release-date" style={{
            fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink)',
            borderBottom: '2px solid var(--accent)', textDecoration: 'none',
            paddingBottom: '2px',
          }}>
            Full release date &amp; launch timeline →
          </Link>
        </p>

        {/* Quick facts */}
        <SectionHead num="§ 01" title="GTA 6 quick facts" />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead>
              <tr><th>Fact</th><th>Detail</th><th>Status</th></tr>
            </thead>
            <tbody>
              {QUICK_FACTS.map(([fact, detail, status]) => (
                <tr key={fact}>
                  <td>{fact}</td>
                  <td>{detail}</td>
                  <td><Status kind={status}>{status}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...body, fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
          Prices and listings checked {LAST_VERIFIED}; they can change by region and retailer.
        </p>

        {/* Latest coverage */}
        <SectionHead num="§ 02" title="Latest GTA 6 coverage" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
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

        {/* Trailers */}
        <SectionHead num="§ 03" title="Every official GTA 6 trailer and video" />
        <p style={body}>
          Rockstar&rsquo;s official media library lists <strong>11 GTA 6 videos</strong>: Trailer 1,
          Trailer 2, the official cover-art animation, and eight character clips. A video is only
          &ldquo;official&rdquo; when it appears on Rockstar&rsquo;s verified channels — the words
          &ldquo;official trailer&rdquo; in a YouTube title prove nothing.
        </p>
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>Video</th><th>Music</th><th>Watch</th></tr></thead>
            <tbody>
              <tr>
                <td>Trailer 1</td>
                <td>&ldquo;Love Is a Long Road&rdquo; — Tom Petty</td>
                <td><a href="https://www.youtube.com/watch?v=QdBZY2fkU-0" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Official upload ↗</a></td>
              </tr>
              <tr>
                <td>Trailer 2</td>
                <td>&ldquo;Hot Together&rdquo; — The Pointer Sisters</td>
                <td><a href="https://www.youtube.com/watch?v=VQRLujxTm3c" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Official upload ↗</a></td>
              </tr>
              <tr>
                <td>Cover-art animation</td>
                <td>—</td>
                <td><a href="https://www.youtube.com/watch?v=EiQEBYDox_k" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Official upload ↗</a></td>
              </tr>
              <tr>
                <td>8 character clips</td>
                <td>—</td>
                <td><a href="https://www.rockstargames.com/VI/media/videos" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Rockstar media library ↗</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={body}>
          Rockstar describes Trailer 2 as a mix of gameplay and cutscenes captured in-game on
          PlayStation 5 — that does not make every shot player-controlled gameplay. Trailer songs
          are not automatically confirmed as in-game radio tracks. <strong>Trailer 3 does not
          exist</strong> in the official library; any upload claiming otherwise is fake until
          Rockstar publishes it.
        </p>

        {/* Characters */}
        <SectionHead num="§ 04" title="GTA 6 characters: the confirmed cast" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {CHARACTERS.map(([name, bio]) => (
            <div key={name} style={{ border: '1px solid var(--rule)', padding: '14px 16px' }}>
              <div style={{
                fontFamily: 'var(--serif)', fontWeight: 900, fontSize: '1rem',
                marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap',
              }}>
                {name}
                {(name === 'Jason Duval' || name === 'Lucia Caminos') && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '7px', letterSpacing: '0.14em',
                    textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--bg)',
                    padding: '2px 6px',
                  }}>Protagonist</span>
                )}
              </div>
              <p style={{ ...body, fontSize: '0.82rem', margin: 0 }}>{bio}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, marginTop: '14px' }}>
          Voice actors have <strong>not</strong> been announced. Rumored casting names remain
          unverified until Rockstar confirms them.
        </p>

        {/* Locations */}
        <SectionHead num="§ 05" title="Every confirmed Leonida region" />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>Region</th><th>What Rockstar has shown</th></tr></thead>
            <tbody>
              {REGIONS.map(([name, desc]) => (
                <tr key={name}><td>{name}</td><td>{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={body}>
          Rockstar has not released the complete map or an official size comparison. Community map
          reconstructions are impressive projects — and they are <em>not</em> the official map.
        </p>

        {/* Editions */}
        <SectionHead num="§ 06" title="GTA 6 Standard vs Ultimate Edition" />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead><tr><th>&nbsp;</th><th>Standard — $79.99</th><th>Ultimate — $99.99</th></tr></thead>
            <tbody>
              <tr>
                <td>Base game</td><td>✓</td><td>✓</td>
              </tr>
              <tr>
                <td>Vintage Vice City Pack</td>
                <td>✓ (pre-order)</td><td>✓</td>
              </tr>
              <tr>
                <td>Ultimate Edition Upgrade</td>
                <td>—</td>
                <td>✓ — vehicles, weapons, styles, properties and activities woven into Jason and Lucia&rsquo;s story (1995 Grotti Cheetah, Hawk &amp; Little Morgan revolvers, Shitzu Squalo boat, Paradise Garage and more)</td>
              </tr>
              <tr>
                <td>GTA+ trial</td>
                <td>1 month</td><td>1 month</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={body}>
          The Vintage Vice City Pack includes the 1955 Vapid Stanier Sedan and garage, appearance
          items, and an exclusive weapon pattern. <strong>Note:</strong> the promotional GTA+ month
          auto-renews unless cancelled and must be claimed by March 31, 2027. Rockstar&rsquo;s own
          physical package is <strong>code-in-box — it does not include a disc</strong>.
        </p>

        {/* PC + Online */}
        <SectionHead num="§ 07" title="PC and GTA 6 Online status" />
        <p style={body}>
          <Status kind="confirmed">Confirmed</Status>&nbsp; <strong>There is no announced PC
          version or PC release date.</strong> A former Rockstar producer has explained the
          studio&rsquo;s console-first logic — fixed hardware targets first, the wide PC
          configuration matrix later — but that is context, not an announcement. Any specific PC
          year you see is unverified. Full detail on our{' '}
          <Link href="/gta-6/pc" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
            GTA 6 PC release date status page
          </Link>
          , including the historical GTA V and RDR2 PC gaps and a rumor tracker.
        </p>
        <p style={body}>
          <Status kind="reported">Reported</Status>&nbsp; Court-document reporting describes an
          unannounced online service and a difficult 32-player internal test session. That supports
          online development existing — it does not confirm the final lobby size, modes, name,
          or whether anything online launches on November 19.
        </p>

        {/* Rumor tracker */}
        <SectionHead num="§ 08" title="Rumor tracker: the claims that matter" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {RUMORS.map(r => (
            <div key={r.claim} style={{ border: '1px solid var(--rule)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <Status kind={r.status}>{r.label}</Status>
                <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '0.95rem' }}>
                  &ldquo;{r.claim}&rdquo;
                </span>
              </div>
              <p style={{ ...body, fontSize: '0.82rem', margin: 0 }}>{r.note}</p>
            </div>
          ))}
        </div>

        {/* Scam warning */}
        <div style={{
          border: '2px solid #c0392b', background: 'oklch(from #c0392b l c h / 0.07)',
          padding: '18px 20px', margin: '32px 0 0',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c0392b',
            marginBottom: '8px',
          }}>
            ⚠ Scam warning
          </div>
          <p style={{ ...body, margin: 0, color: 'var(--ink)' }}>
            <strong>There is no public GTA 6 beta, no VIP early access, and no downloadable
            build.</strong> Fake beta sites, crypto-payment offers, &ldquo;early access&rdquo;
            keys, and AI-generated &ldquo;official trailer&rdquo; uploads are active scams.
            Verify every GTA 6 link against rockstargames.com/VI before you click, and never pay
            anyone for early access.
          </p>
        </div>

        {/* FAQ */}
        <SectionHead num="§ 09" title="GTA 6 FAQ" />
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

        {/* Sources */}
        <SectionHead num="§ 10" title="Sources" />
        <ul style={{ ...body, paddingLeft: '1.2em', margin: 0 }}>
          <li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Rockstar Games — official GTA VI site</a></li>
          <li><a href="https://www.rockstargames.com/VI/media/videos" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Rockstar Games — official video library</a></li>
          <li><a href="https://newzoo.com/articles/gta-6-first-week-pre-order-sales" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Newzoo — pre-order estimate and $1B fact check</a></li>
          <li><a href="https://www.take2games.com/ir" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Take-Two Interactive — investor relations (next earnings call: August 7, 2026)</a></li>
        </ul>

        <p style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em',
          color: 'var(--ink-faint)', marginTop: '40px', lineHeight: 1.8,
          borderTop: '1px solid var(--rule)', paddingTop: '16px',
        }}>
          Page last verified {LAST_VERIFIED}. {GTA6_DISCLAIMER}
        </p>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid var(--ink)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--ink-faint)',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontWeight: 700 }}>THE GAMER SCENE · EST. 2013</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/news"    style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>News</Link>
          <Link href="/reviews" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Reviews</Link>
          <Link href="/opinion" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Opinion</Link>
          <Link href="/about"   style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>About</Link>
          <Link href="/"        style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Latest Issue →</Link>
        </div>
      </footer>
    </div>
  )
}
