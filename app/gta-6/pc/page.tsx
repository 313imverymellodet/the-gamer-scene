import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import JsonLd from '@/components/JsonLd'
import {
  Status, SectionHead, Gta6Breadcrumbs,
  gta6Body as body, GTA6_DISCLAIMER,
  type StatusKind,
} from '@/components/Gta6Ui'

const BASE = 'https://thegamerscene.news'
const URL = `${BASE}/gta-6/pc`
const LAST_VERIFIED = 'July 19, 2026'
const PUBLISHED_ISO = '2026-07-19T12:00:00Z'

export const metadata: Metadata = {
  // Layout template appends " — The Gamer Scene"
  title: 'GTA 6 PC Release Date: No Date Announced Yet',
  description:
    'Rockstar has not announced a GTA 6 PC release date. See the official platform status, PC release history, rumor checks and every verified update.',
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'GTA 6 PC Release Date: The Verified Status',
    description:
      'No GTA 6 PC date is official. Here is what Rockstar has confirmed, what its history suggests, and which release claims remain speculation.',
    type: 'article',
    url: URL,
    siteName: 'The Gamer Scene',
    publishedTime: PUBLISHED_ISO,
    modifiedTime: PUBLISHED_ISO,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 PC Release Date: The Verified Status',
    description:
      'No GTA 6 PC date is official. What Rockstar confirmed, what history suggests, and which claims are speculation.',
    site: '@thegamerscene',
  },
}

// ─── Status snapshot ─────────────────────────────────────────────────────────
// Do not add pcWindow / pcReleaseDate fields until an official source exists.

const STATUS_ROWS: Array<[string, string]> = [
  ['Official PC release date', 'Not announced'],
  ['Official PC release window', 'Not announced'],
  ['Official console release date', 'November 19, 2026'],
  ['Confirmed launch platforms', 'PlayStation 5 · Xbox Series X|S'],
  ['Windows PC edition formally announced', 'No'],
  ['PC preorders', 'Not announced'],
  ['PC price', 'Not announced'],
  ['PC storefronts', 'Not announced'],
  ['PC system requirements', 'Not announced'],
  ['PC file size', 'Not announced'],
  ['Next scheduled Take-Two earnings update', 'August 7, 2026'],
]

const ANSWER_CARD: Array<[string, string]> = [
  ['Is there an official GTA 6 PC release date?', 'No'],
  ['Is PC included in the November 19, 2026 launch?', 'No — the announced platforms are PS5 and Xbox Series X|S'],
  ['Has Rockstar formally announced a Windows PC edition?', 'No'],
  ['Is a later PC release expected?', 'Yes — as a strong historical expectation, not a confirmed schedule'],
  ['Are PC preorders live?', 'No official PC preorders have been announced'],
  ['Are the PC system requirements official?', 'No'],
  ['Are Steam or Epic versions confirmed?', 'No'],
]

const TOC: Array<[string, string]> = [
  ['#official-status', 'Official PC status'],
  ['#take-two-comments', 'What Take-Two has said'],
  ['#why-console-first', 'Why Rockstar launches on console first'],
  ['#rockstar-pc-history', 'GTA V and RDR2 release history'],
  ['#release-window-analysis', 'Could GTA 6 hit PC in 2027 or 2028?'],
  ['#pc-rumors', 'PC rumors and false claims'],
  ['#storefronts', 'Steam, requirements, price, preorders'],
  ['#buy-console-or-wait', 'Should PC players wait?'],
  ['#faq', 'Frequently asked questions'],
  ['#updates', 'Update history'],
  ['#sources', 'Sources and methodology'],
]

const HISTORY: Array<[string, string, string, string]> = [
  ['Grand Theft Auto V', 'September 17, 2013', 'April 14, 2015', '574 days · about 19 months'],
  ['Red Dead Redemption 2', 'October 26, 2018', 'November 5, 2019', '375 days · about 12 months'],
]

const RUMORS: Array<{
  claim: string
  kind: StatusKind
  verdict: string
  reason: string
}> = [
  {
    claim: 'GTA 6 PC is confirmed for 2027',
    kind: 'unverified', verdict: 'Unverified',
    reason: 'Rockstar and Take-Two have not announced a 2027 PC window. The year is plausible analysis, not a confirmed date.',
  },
  {
    claim: 'GTA 6 PC releases in February 2027',
    kind: 'unverified', verdict: 'Unverified',
    reason: 'No public primary source currently supports the date. Repetition across low-accountability articles and social posts is not independent verification.',
  },
  {
    claim: 'GTA 6 PC is confirmed for 2028',
    kind: 'unverified', verdict: 'Unverified',
    reason: 'The year can be derived from GTA V’s historical gap, but no official announcement supports it.',
  },
  {
    claim: 'Rockstar confirmed GTA 6 will never come to PC',
    kind: 'false-or-misleading', verdict: 'False or misleading',
    reason: 'Rockstar has not announced a permanent exclusion. PC is simply absent from the announced November 19, 2026 launch platforms.',
  },
  {
    claim: 'GTA 6 already has official PC system requirements',
    kind: 'false-or-misleading', verdict: 'False or misleading',
    reason: 'No official CPU, GPU, RAM, storage, operating-system, or DirectX requirements have been published. Lists naming specific hardware are estimates unless they link to a verifiable Rockstar product page.',
  },
  {
    claim: 'GTA 6 has an official Steam page',
    kind: 'unverified', verdict: 'Not announced',
    reason: 'No official GTA 6 Steam availability has been announced. Do not confuse fan groups, community hubs, copied store pages, or unrelated listings with a verified product page.',
  },
  {
    claim: 'GTA 6 PC preorders are open',
    kind: 'false-or-misleading', verdict: 'False or misleading',
    reason: 'Official preorders currently cover the announced console versions only. Any PC key sale should be treated as unauthorized, speculative, or potentially fraudulent until Rockstar announces a PC edition and approved sellers.',
  },
  {
    claim: 'GTA 6 PC specifications leaked through a retailer',
    kind: 'unverified', verdict: 'Unverified',
    reason: 'Retailer fields are often placeholders and may be generated from assumptions. Authentication and corroboration are required before treating them as a leak.',
  },
  {
    claim: 'Sony paid to keep GTA 6 off PC',
    kind: 'unverified', verdict: 'Unsupported',
    reason: 'Take-Two’s CEO has publicly described console-first as Rockstar’s historical approach and said the platform decision was not part of the PlayStation marketing arrangement.',
  },
  {
    claim: 'GTA 6 PC will definitely launch with GTA 6 Online',
    kind: 'unverified', verdict: 'Not announced',
    reason: 'Rockstar has not announced the PC edition or its online package, timing, cross-platform compatibility, or account-transfer rules.',
  },
]

const UNKNOWNS: string[] = [
  'Maximum frame rate', 'Resolution support', 'Ultrawide / multi-monitor',
  'Ray tracing settings', 'DLSS / FSR / XeSS', 'Texture-quality tiers',
  'Draw distance settings', 'HDR implementation', 'Keyboard & mouse features',
  'Controller support', 'Benchmark tool', 'Rockstar Editor',
  'Mod support', 'Crossplay', 'Progress transfer', 'PC file size',
]

const FAQ: Array<[string, string]> = [
  ['What is the GTA 6 PC release date?',
   'Rockstar has not announced a GTA 6 PC release date. GTA 6 is officially scheduled for November 19, 2026 on PlayStation 5 and Xbox Series X|S. PC is not included in the announced launch.'],
  ['Is GTA 6 coming to PC?',
   'A later PC edition is strongly expected because Rockstar released GTA V and Red Dead Redemption 2 on PC after their console debuts. However, Rockstar has not formally announced GTA 6 for PC, so there is no official date or window.'],
  ['Will GTA 6 launch on PC in 2027?',
   'A 2027 release is plausible but unconfirmed. Rockstar and Take-Two have not announced a year for the PC edition.'],
  ['Could GTA 6 PC be delayed until 2028?',
   'Yes, 2028 is possible based on the roughly 19-month gap between GTA V’s original console and PC releases. That comparison is historical analysis, not confirmation of GTA 6’s schedule.'],
  ['Is the February 2027 GTA 6 PC date real?',
   'No official source currently supports a February 2027 date. Treat the claim as unverified unless Rockstar or Take-Two announces it.'],
  ['Why is GTA 6 not launching on PC at the same time as consoles?',
   'Take-Two CEO Strauss Zelnick has described Rockstar as serving its core console audience first. A former Rockstar producer has also explained that fixed console targets can help a studio focus resources before expanding to the wider variety of PC hardware. Rockstar has not published a complete GTA 6-specific technical explanation.'],
  ['Will GTA 6 be on Steam?',
   'Rockstar has not announced any GTA 6 PC storefront. Steam, Epic Games Store, and Rockstar Games Launcher availability are all unknown.'],
  ['Can I preorder GTA 6 for PC?',
   'No official GTA 6 PC preorder is available. Avoid paying for unofficial PC keys, beta access, or downloads until Rockstar announces a PC edition and approved sellers.'],
  ['What are the GTA 6 PC system requirements?',
   'Rockstar has not published official GTA 6 PC minimum or recommended requirements. Any current CPU, GPU, RAM, or storage list is an estimate unless it comes from an official Rockstar product page.'],
  ['How much will GTA 6 cost on PC?',
   'The PC price has not been announced. The current console price should not be treated as confirmation of the future PC price.'],
  ['Will GTA 6 PC have better graphics?',
   'Rockstar has not announced PC features. Earlier Rockstar PC releases included additional graphical and technical options, but no specific GTA 6 enhancement is confirmed.'],
  ['Will GTA 6 support mods on PC?',
   'No PC edition or GTA 6 mod policy has been announced. The franchise’s history of PC modding does not guarantee official tools, compatibility, or support.'],
  ['Will GTA 6 Online launch with the PC version?',
   'Rockstar has not announced the PC edition or the release plan for GTA 6’s online experience. Online timing, crossplay, progression transfers, and feature parity are unknown.'],
  ['Should I buy a PS5 or Xbox for GTA 6 instead of waiting for PC?',
   'Buy an announced console version only if playing at launch is worth the hardware and game cost to you. Waiting is reasonable for players who prioritize PC features, but the length of the wait is unknown.'],
]

const UPDATES: Array<[string, string, string, string]> = [
  ['July 19, 2026', 'Reverified the GTA VI product page, console platform list, Take-Two preorder announcement, recent console-first comments, and historical PC release dates.', 'No', 'Rockstar, Take-Two, Rockstar Newswire'],
  ['June 24, 2026', 'Take-Two announced GTA VI console preorders and continued to list only PS5 and Xbox Series X|S for November 19, 2026.', 'No', 'Take-Two'],
  ['May 2026', 'Take-Two CEO Strauss Zelnick discussed Rockstar’s console-first strategy. No PC date was announced.', 'No', 'Bloomberg interview and secondary coverage'],
  ['November 6, 2025', 'GTA VI’s console release moved to November 19, 2026. PC remained unannounced.', 'No', 'Rockstar and Take-Two'],
  ['December 4, 2023', 'GTA VI was announced for PS5 and Xbox Series X|S. PC was not listed.', 'No', 'Rockstar and Take-Two'],
]

const SOURCES: Array<{ title: string; url: string; supports: string; not?: string }> = [
  { title: 'Rockstar Games — official Grand Theft Auto VI site', url: 'https://www.rockstargames.com/VI', supports: 'Current release date and announced launch platforms.' },
  { title: 'Take-Two — Rockstar Games Announces Pre-Orders for Grand Theft Auto VI', url: 'https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi', supports: 'November 19, 2026 launch; PS5 and Xbox Series X|S; console preorder details.' },
  { title: 'Take-Two Investor Relations', url: 'https://ir.take2games.com/', supports: 'Scheduled earnings events and official financial updates.' },
  { title: 'Rockstar Games Newswire', url: 'https://www.rockstargames.com/newswire/', supports: 'Official Rockstar announcements and future PC reveal monitoring.' },
  { title: 'VGC — Zelnick on console-before-PC releases', url: 'https://www.videogameschronicle.com/news/rockstar-games-like-gta-release-on-console-before-pc-because-thats-the-core-consumer-take-two-ceo-zelnick-says/', supports: 'Accessible summary of Zelnick’s Bloomberg comments.', not: 'A GTA 6 PC date or formal PC announcement.' },
  { title: 'Kiwi Talkz — interview with former Rockstar producer John Ricchio', url: 'https://www.youtube.com/watch?v=IK39id7-opI', supports: 'Historical development and resource-prioritization context from a former producer.', not: 'Current Rockstar plans or a release date.' },
  { title: 'VGC — Ricchio on console-only launch as resource management', url: 'https://www.videogameschronicle.com/news/gta-6-console-only-launch-isnt-anti-pc-but-a-case-of-resource-management-ex-rockstar-producer-says/', supports: 'Summary and context for Ricchio’s interview.' },
  { title: 'Rockstar — Grand Theft Auto V is now available for PC', url: 'https://www.rockstargames.com/newswire/article/25o2411812a31k/grand-theft-auto-v-is-now-available-for-pc', supports: 'April 14, 2015 PC release.' },
  { title: 'Rockstar — Red Dead Redemption 2 coming to PC November 5', url: 'https://www.rockstargames.com/newswire/article/9k1248838o2974/Red-Dead-Redemption-2-Coming-to-PC-November-5th', supports: 'November 5, 2019 PC release and October 2019 announcement timing.' },
]

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
// Article + BreadcrumbList only. No FAQPage (rich-result eligibility is now
// effectively limited to government/health sites). No PC platform, offer,
// price, or release date in structured data — none is announced.

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${URL}#article`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      headline: 'GTA 6 PC release date: no date has been announced',
      description:
        'Rockstar has not announced a GTA 6 PC release date. See the official platform status, PC release history, rumor checks and every verified update.',
      datePublished: PUBLISHED_ISO,
      dateModified: PUBLISHED_ISO,
      author: { '@type': 'Organization', name: 'The Gamer Scene', url: BASE },
      publisher: {
        '@type': 'Organization',
        name: 'The Gamer Scene',
        url: BASE,
        logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` },
      },
      about: {
        '@type': 'VideoGame',
        name: 'Grand Theft Auto VI',
        alternateName: ['GTA VI', 'GTA 6'],
        gamePlatform: ['PlayStation 5', 'Xbox Series X|S'],
        datePublished: '2026-11-19',
        publisher: { '@type': 'Organization', name: 'Rockstar Games' },
      },
      citation: [
        'https://www.rockstargames.com/VI',
        'https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi',
        'https://www.rockstargames.com/newswire/article/25o2411812a31k/grand-theft-auto-v-is-now-available-for-pc',
        'https://www.rockstargames.com/newswire/article/9k1248838o2974/Red-Dead-Redemption-2-Coming-to-PC-November-5th',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'GTA 6', item: `${BASE}/gta-6` },
        { '@type': 'ListItem', position: 3, name: 'GTA 6 PC', item: URL },
      ],
    },
  ],
}

const link: React.CSSProperties = { color: 'var(--ink)', textDecoration: 'underline' }

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Gta6PcPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      <JsonLd data={jsonLd} />
      {/* Countdown strip hidden here: the sitewide clock counts to the CONSOLE
          launch, and this page must keep that date visually separate from the
          unannounced PC date. */}
      <SiteHeader active="gta-6" hideCountdown />

      <main id="main-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        <Gta6Breadcrumbs current="GTA 6 PC" />

        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--hot)', marginBottom: '10px',
        }}>
          GTA 6 PC Status
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.9rem, 5.2vw, 3rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.04,
          margin: '0 0 16px',
        }}>
          GTA 6 PC release date: no date has been announced
        </h1>

        {/* Byline + verification row */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--ink-faint)',
          borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
          padding: '10px 0', margin: '0 0 24px',
          display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span>By The Gamer Scene Editorial</span>
          <span>Published July 19, 2026</span>
          <span style={{ color: 'var(--ink)' }}>Last verified: {LAST_VERIFIED}</span>
          <span>Reviewed against Rockstar &amp; Take-Two sources</span>
        </div>

        {/* Status panel */}
        <section className="pc-status-panel" aria-labelledby="status-heading">
          <div className="pc-status-banner">
            <b id="status-heading">PC date: NOT ANNOUNCED</b>
            <span>Last verified {LAST_VERIFIED}</span>
          </div>
          <dl className="pc-status-list">
            {STATUS_ROWS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd><b>{v}</b></dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Direct answer */}
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '1.08rem', lineHeight: 1.55,
          color: 'var(--ink)', margin: '0 0 16px', maxWidth: '62ch',
        }}>
          <strong>Rockstar Games has not announced a GTA 6 PC release date.</strong> Grand Theft
          Auto VI is officially scheduled to launch on <strong>November 19, 2026</strong> for{' '}
          <strong>PlayStation 5 and Xbox Series X|S</strong>, and PC is not included in that
          announced launch. Rockstar has not formally listed a Windows edition, a PC release
          window, storefronts, preorders, pricing, or system requirements.
        </p>
        <p style={body}>
          A later PC release is reasonable to expect because Rockstar brought both Grand Theft Auto
          V and Red Dead Redemption 2 to PC after their console debuts, and Take-Two CEO Strauss
          Zelnick has publicly described consoles as Rockstar&rsquo;s first audience for major
          launches. That still does not make 2027, 2028, or any specific month official. This page
          tracks the evidence and will change its status only when Rockstar or Take-Two publishes
          verifiable information.
        </p>

        {/* TOC */}
        <nav className="pc-toc" aria-label="On this page">
          <div className="pc-toc-head">On this page</div>
          <ol>
            {TOC.map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ol>
        </nav>

        {/* Latest update */}
        <div className="pc-update-card">
          <div className="pc-update-card-date">Latest update · July 19, 2026 · Status unchanged</div>
          <b>No GTA 6 PC date has been announced</b>
          <p style={{ ...body, margin: 0, fontSize: '0.85rem' }}>
            Rockstar and Take-Two continue to list the November 19, 2026 launch for PlayStation 5
            and Xbox Series X|S only. Recent comments explain Rockstar&rsquo;s console-first
            strategy but do not reveal a PC date. Next monitoring point:{' '}
            <strong>Take-Two&rsquo;s Q1 FY2027 earnings call on August 7, 2026</strong> — a
            scheduled corporate checkpoint, <em>not</em> a confirmed PC announcement.
          </p>
        </div>

        {/* § Official status */}
        <SectionHead num="§ 01" title="Official GTA 6 PC status" />
        <div id="official-status" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          <Status kind="confirmed">Confirmed</Status>&nbsp; Rockstar&rsquo;s current GTA VI
          materials and Take-Two&rsquo;s June 24, 2026 preorder announcement list a November 19,
          2026 release for PlayStation 5 and Xbox Series X|S. Neither source lists PC as a launch
          platform. The official record establishes four points:
        </p>
        <ol style={{ ...body, paddingLeft: '1.3em' }}>
          <li>Grand Theft Auto VI has a November 19, 2026 console release date.</li>
          <li>PlayStation 5 and Xbox Series X|S are the announced launch platforms.</li>
          <li>Console preorders are available.</li>
          <li>No equivalent PC product, date, or preorder has been announced.</li>
        </ol>
        <p style={body}>
          The absence of PC from those materials confirms that PC is <em>not part of the announced
          November launch</em>. It does <strong>not</strong> confirm that a PC edition will never
          exist. Saying &ldquo;GTA 6 will almost certainly come to PC later&rdquo; is an
          evidence-based expectation; saying &ldquo;GTA 6 PC releases in 2027&rdquo; is a release
          claim that currently lacks official confirmation.
        </p>

        {/* Answer card */}
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <caption style={{
              textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '9px',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', paddingBottom: '8px',
            }}>
              Quick answers
            </caption>
            <thead><tr><th>Question</th><th>Verified answer</th></tr></thead>
            <tbody>
              {ANSWER_CARD.map(([q, a]) => (
                <tr key={q}><td style={{ whiteSpace: 'normal' }}>{q}</td><td>{a}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* § Take-Two comments */}
        <SectionHead num="§ 02" title="What Take-Two has said about console-first launches" />
        <div id="take-two-comments" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          <Status kind="on-the-record">On the record</Status>&nbsp; In a May 2026 Bloomberg
          interview, Take-Two CEO Strauss Zelnick explained that Rockstar historically begins major
          releases on console because it wants to serve what it considers the core audience first.
          He also rejected the idea that GTA 6&rsquo;s launch-platform decision was created by a
          PlayStation marketing agreement.
        </p>
        <p style={body}>
          That comment is useful context: Rockstar&rsquo;s console-first plan appears to be a
          deliberate publishing and development strategy, not evidence that PC has been ruled out
          forever. It still does not give players a date — Zelnick did not announce a PC edition, a
          year, or a target interval. The correct use of his comment is to explain the strategy,
          not to build a release calendar he never provided.
        </p>

        {/* § Why console first */}
        <SectionHead num="§ 03" title="Why Rockstar might launch on consoles first" />
        <div id="why-console-first" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          Rockstar has not published a GTA 6 PC development explanation, so no outsider can state
          the complete internal reasoning. Public comments and ordinary platform-development
          realities point to several likely factors.
        </p>
        <p style={body}>
          <strong>Fixed hardware targets.</strong> A console generation gives developers a small set
          of known configurations. PC development must account for a far wider range of processors,
          graphics cards, memory amounts, storage speeds, drivers, operating-system versions,
          displays, peripherals, and background software. That does not make PC development
          impossible — it means optimization, compatibility testing, settings design, driver
          coordination, anti-cheat planning, and QA can require additional work.
        </p>
        <p style={body}>
          <Status kind="on-the-record">On the record — former employee</Status>&nbsp;{' '}
          <strong>Resource prioritization.</strong> Former Rockstar producer John Ricchio discussed
          this in a July 2026 Kiwi Talkz interview, describing development as a resource-allocation
          problem: work assigned to a PC build is work not assigned elsewhere, and starting with
          fixed console limits can make it easier to establish a stable baseline.{' '}
          <strong>Ricchio left Rockstar in 2014.</strong> He is not a spokesperson for the current
          GTA 6 team and did not reveal an internal PC date. Treat his comments as experienced
          historical context, not confirmation of current plans.
        </p>
        <p style={body}>
          <Status kind="analysis">Analysis</Status>&nbsp; <strong>Launch focus and commercial
          sequencing.</strong> Concentrating the initial release on two console families reduces
          the number of hardware and storefront combinations that must be supported at once, and a
          staggered PC release can create a second sales event. Both are reasonable readings of the
          pattern — neither is a Rockstar statement, and cynical explanations should not be
          presented as established fact.
        </p>

        {/* § History */}
        <SectionHead num="§ 04" title="How long GTA V and RDR2 took to reach PC" />
        <div id="rockstar-pc-history" style={{ scrollMarginTop: '80px' }} />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead>
              <tr><th>Game</th><th>Console release</th><th>PC release</th><th>Gap</th></tr>
            </thead>
            <tbody>
              {HISTORY.map(([game, con, pc, gap]) => (
                <tr key={game}>
                  <td>{game}</td><td>{con}</td><td>{pc}</td><td>{gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={body}>
          These dates are context, not a formula. A two-game sample cannot tell us that GTA 6 will
          arrive exactly 12, 15, or 19 months after November 19, 2026. If GTA 6 copied those gaps
          exactly, the result would land somewhere between late 2027 and mid-2028 — a mathematical
          comparison, not inside information.
        </p>
        <p style={body}>
          <strong>Why the comparison can mislead:</strong> GTA 6 is a different project on a
          different hardware generation; Rockstar&rsquo;s PC tools, staffing, and storefront
          strategy may have changed; the console version itself was delayed; a PC build may be
          planned long before Rockstar announces it; and Rockstar has sometimes announced PC
          releases close to launch — Red Dead Redemption 2&rsquo;s PC edition was announced in
          October 2019 and released in November 2019.
        </p>

        {/* § Analysis */}
        <SectionHead num="§ 05" title="Could GTA 6 come to PC in 2027 or 2028?" />
        <div id="release-window-analysis" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          <strong>2027 is plausible. It is not confirmed.</strong> A 2027 PC launch would fit the
          broad pattern set by Red Dead Redemption 2, which reached PC about a year after consoles,
          and would make commercial sense as a second-wave release. But no official source
          establishes a 2027 target — Rockstar has not published a year, quarter, fiscal period, or
          month.
        </p>
        <p style={body}>
          <strong>2028 is also plausible and also unconfirmed.</strong> GTA V took about 19 months
          to move from console to PC; applying a similar interval points into 2028. This page does
          not choose between the two years as though one is secretly correct.
        </p>

        <div className="pc-assessment">
          <span className="pc-assessment-flag">Analysis, not a release announcement</span>
          <dl>
            {[
              ['Official status', 'No PC date or window announced'],
              ['Confidence in an eventual PC release', 'High'],
              ['Most defensible broad possibility', '2027 or 2028'],
              ['Confidence in any specific year', 'Low'],
              ['Confidence in any specific month or day', 'Very low'],
            ].map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p style={{ ...body, margin: 0, fontSize: '0.82rem' }}>
            <strong>Reasoning:</strong> Rockstar&rsquo;s recent flagship games eventually reached
            PC; Take-Two describes Rockstar as console-first, not console-only; a 12-to-19-month
            comparison places the obvious historical range across late 2027 and 2028; two past
            games are not enough to predict a modern production schedule; and no official PC
            product or release period exists yet.
          </p>
          <p style={{
            ...body, margin: '12px 0 0', fontSize: '0.78rem',
            color: 'var(--ink-faint)', fontStyle: 'italic',
          }}>
            This assessment is editorial analysis based on public history. It is not a leak, an
            announcement, a retailer date, or financial guidance from Rockstar or Take-Two.
          </p>
        </div>

        <p style={body}>
          <strong>On the February 2027 claim:</strong> treat it as{' '}
          <Status kind="unverified">Unverified</Status> unless it can be traced to a named,
          accountable source with direct knowledge or an authenticated official document. No public
          Rockstar or Take-Two announcement supports it. Articles repeating the same unnamed claim
          do not become independent confirmation merely because there are many of them.
        </p>

        {/* § Rumors */}
        <SectionHead num="§ 06" title="GTA 6 PC rumor and misinformation tracker" />
        <div id="pc-rumors" style={{ scrollMarginTop: '80px' }} />
        <p style={{ ...body, fontSize: '0.82rem', color: 'var(--ink-faint)' }}>
          Every entry below was last checked {LAST_VERIFIED}. Labels: <em>Unverified</em> means no
          public primary source supports it. <em>False or misleading</em> means an official source
          contradicts it or the cited evidence does not support the headline.
        </p>
        <div>
          {RUMORS.map(r => (
            <div key={r.claim} className="pc-rumor">
              <div className="pc-rumor-head">
                <Status kind={r.kind}>{r.verdict}</Status>
                <span className="pc-rumor-claim">&ldquo;{r.claim}&rdquo;</span>
              </div>
              <p style={{ ...body, fontSize: '0.82rem', margin: 0 }}>{r.reason}</p>
            </div>
          ))}
        </div>

        {/* § Storefronts / specs / price / preorders */}
        <SectionHead num="§ 07" title="Storefronts, requirements, price and preorders" />
        <div id="storefronts" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          <strong>System requirements.</strong> There are no official GTA 6 PC system requirements
          — no processor, graphics card, memory, storage, operating system, DirectX version, SSD
          requirement, ray tracing, upscaling, resolution, or frame-rate target. We are not
          publishing guessed specifications in an official-looking table, and we are not shipping a
          &ldquo;can my PC run it?&rdquo; tool that would invent precision before a PC build exists.
        </p>
        <p style={body}>
          <strong>Storefronts.</strong> No PC storefront has been announced. For historical context
          only: GTA V is available through the Rockstar Games Launcher, Steam, and Epic Games Store,
          and Red Dead Redemption 2 opened PC prepurchases through the Rockstar Games Launcher
          before reaching additional storefronts. That history does not confirm GTA 6&rsquo;s
          storefronts or whether one launcher gets priority.
        </p>
        <p style={body}>
          <strong>Preorders.</strong> No official GTA 6 PC preorder has been announced. Console
          preorders do not create a PC entitlement, and the existence of a console edition does not
          authorize third parties to sell future PC keys.
        </p>
        <div style={{
          border: '2px solid #c0392b', background: 'oklch(from #c0392b l c h / 0.07)',
          padding: '16px 18px', margin: '16px 0',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c0392b',
            marginBottom: '8px',
          }}>
            ⚠ Safety note
          </div>
          <p style={{ ...body, margin: 0, color: 'var(--ink)' }}>
            <strong>Do not pay for a GTA 6 PC key, beta, early-access build, or download from an
            unofficial seller.</strong> Rockstar has not announced a public PC preorder or PC beta.
            Any seller who cannot link to an official Rockstar announcement should be treated as
            unauthorized or fraudulent.
          </p>
        </div>
        <p style={body}>
          <strong>Price.</strong> Rockstar has not announced a PC price. The console Standard
          Edition is currently listed at $79.99 in the United States, but currency, regional
          pricing, edition structure, launch timing, and storefront fees can all differ — we do not
          reuse the console price as a PC price anywhere on this site.
        </p>
        <p style={body}>
          <strong>Features, mods and online.</strong> Past Rockstar PC editions added technical and
          graphical options, which makes expanded settings a reasonable expectation but confirms
          nothing about GTA 6. Everything below remains unknown:
        </p>
        <div className="pc-unknowns">
          {UNKNOWNS.map(u => (
            <div key={u}><span>{u}</span><em>Unknown</em></div>
          ))}
        </div>
        <p style={{ ...body, marginTop: '14px' }}>
          Rockstar has also not announced a GTA 6 mod policy, and it has not announced the branding,
          timing, PC availability, crossplay rules, or progression-transfer rules for GTA 6&rsquo;s
          future online experience. Do not assume online launches alongside a future PC version.
        </p>

        {/* § Decision guide */}
        <SectionHead num="§ 08" title="Should PC players wait, or buy a console?" />
        <div id="buy-console-or-wait" style={{ scrollMarginTop: '80px' }} />
        <div className="pc-decision">
          <div>
            <h3>Buy or use a console if…</h3>
            <ul>
              <li>You want to play at the confirmed November 19 launch.</li>
              <li>Avoiding story spoilers is a high priority.</li>
              <li>Your friends will be playing on PS5 or Xbox Series X|S.</li>
              <li>You are comfortable buying the game again if a later PC edition offers features you prefer.</li>
            </ul>
          </div>
          <div>
            <h3>Wait for PC if…</h3>
            <ul>
              <li>Keyboard and mouse are essential to you.</li>
              <li>You primarily play in one PC ecosystem.</li>
              <li>You prefer the <em>possibility</em> of higher frame rates, ultrawide support, or community tools — while understanding none is confirmed.</li>
              <li>You do not want to buy hardware for one game, and can accept an unknown wait plus spoiler risk.</li>
            </ul>
          </div>
        </div>
        <p style={body}>
          The honest conclusion: <strong>players who need GTA 6 on launch day currently need one of
          the announced consoles. Players who prefer PC have a credible reason to expect a later
          edition, but no reliable date on which to plan a purchase.</strong> We are not going to
          tell you that one console delivers a &ldquo;best&rdquo; experience without independent
          testing, or estimate what a future PC build will demand from your hardware.
        </p>

        {/* § FAQ */}
        <SectionHead num="§ 09" title="GTA 6 PC frequently asked questions" />
        <div id="faq" style={{ scrollMarginTop: '80px' }} />
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

        {/* § Update log */}
        <SectionHead num="§ 10" title="Update history" />
        <div id="updates" style={{ scrollMarginTop: '80px' }} />
        <div className="gta6-table-wrap">
          <table className="gta6-table">
            <thead>
              <tr><th>Date</th><th>Update</th><th>Status change?</th><th>Source</th></tr>
            </thead>
            <tbody>
              {UPDATES.map(([d, u, c, s]) => (
                <tr key={d}>
                  <td>{d}</td>
                  <td style={{ whiteSpace: 'normal' }}>{u}</td>
                  <td>{c}</td>
                  <td style={{ whiteSpace: 'normal' }}>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* § Sources */}
        <SectionHead num="§ 11" title="Sources and methodology" />
        <div id="sources" style={{ scrollMarginTop: '80px' }} />
        <p style={body}>
          We prioritize first-party announcements from Rockstar Games, Take-Two Interactive,
          official platform holders, and verified store pages. Named executive comments are labeled
          separately from formal announcements. Historical comparisons are shown as analysis rather
          than predictions. Anonymous claims, retailer placeholders, social posts, and copied rumor
          articles are not treated as confirmation. <strong>The &ldquo;last verified&rdquo; date
          changes only when an editor rechecks the underlying sources</strong> — not on every
          deployment.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
          {SOURCES.map(s => (
            <li key={s.url} style={{ borderBottom: '1px solid var(--rule)', padding: '12px 0' }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ ...link, fontWeight: 600 }}>
                {s.title} ↗
              </a>
              <div style={{ ...body, fontSize: '0.8rem', margin: '4px 0 0' }}>
                <strong>Supports:</strong> {s.supports}
                {s.not && <><br /><strong>Does not support:</strong> {s.not}</>}
              </div>
            </li>
          ))}
        </ul>

        {/* Related */}
        <SectionHead num="§ 12" title="Related GTA 6 coverage" />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            ['/gta-6', 'Everything officially confirmed about GTA 6'],
            ['/gta-6/release-date', 'GTA 6 console release date and November 19 launch timeline'],
            ['/news/2026-07-17-gta-6-preorder-record-newzoo-estimate', 'GTA 6 Just Opened the Strongest Preorder Campaign Newzoo Has Ever Tracked'],
            ['/news/2026-04-22-gta6-trailer-3-when-and-what-to-expect', 'GTA 6 Trailer 3: When Is It Coming and What Should We Expect?'],
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

        {/* Bottom line */}
        <div style={{
          border: '2px solid var(--ink)', padding: '20px 22px', margin: '36px 0 0',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px',
          }}>
            The bottom line
          </div>
          <p style={{ ...body, margin: 0, color: 'var(--ink)' }}>
            There is no official GTA 6 PC release date. The only confirmed launch is November 19,
            2026 on PlayStation 5 and Xbox Series X|S. A later PC edition is a strong expectation
            based on Rockstar&rsquo;s recent history and Take-Two&rsquo;s console-first comments,
            but 2027 and 2028 remain possibilities rather than announcements. No month, storefront,
            price, preorder, system requirement, or PC feature set is official.
          </p>
        </div>

        <p style={{
          fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em',
          color: 'var(--ink-faint)', marginTop: '32px', lineHeight: 1.8,
          borderTop: '1px solid var(--rule)', paddingTop: '16px',
        }}>
          Page last verified {LAST_VERIFIED}. Spotted an error or an official update we missed?{' '}
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}>
            Send us a correction
          </Link>
          . {GTA6_DISCLAIMER}
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
          <Link href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/"        style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Latest Issue →</Link>
        </div>
      </footer>
    </div>
  )
}
