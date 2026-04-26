'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { IssueData, CommentItem } from '@/types'

const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false })

// ─── Topbar ──────────────────────────────────────────────────────────────────

function Topbar({ data, onSearchOpen }: { data: IssueData; onSearchOpen: () => void }) {
  const items = [...data.ticker, ...data.ticker]
  return (
    <div className="topbar">
      <div className="left">TGS · Issue {data.issue.number}</div>
      <div className="ticker">
        <div className="ticker-track">
          {items.map((t, i) => (
            <span key={i}><em>{t.tag}</em>{t.text}</span>
          ))}
        </div>
      </div>
      <div className="right">
        <span>{data.issue.weekday}, {data.issue.date}</span>
        <span>·</span>
        <span>{data.issue.subscribers} readers</span>
        <button
          onClick={onSearchOpen}
          className="topbar-search-btn"
          aria-label="Search"
        >
          ⌕ Search
        </button>
      </div>
    </div>
  )
}

// ─── Masthead ─────────────────────────────────────────────────────────────────

function Masthead({ data }: { data: IssueData }) {
  return (
    <header className="masthead">
      <div className="masthead-top">
        <div>Est. 2013 · {data.issue.volume} · No. {data.issue.number}</div>
        <div className="stamp">◆ TGS / 26 · THE GAMER SCENE</div>
        <div>{data.issue.weekday}, {data.issue.date}</div>
      </div>
      <div className="masthead-title">
        The Gamer<span className="amp">·</span>Scene
      </div>
      <div className="masthead-meta">
        <div><span>Issue</span><b>№ {data.issue.number} / 2026</b></div>
        <div><span>Read Time</span><b>{data.issue.readTime}</b></div>
        <div><span>Weather</span><b>{data.issue.weather}</b></div>
        <div><span>Dispatched From</span><b>{data.issue.location}</b></div>
      </div>
    </header>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function IssueTabs({ active, setActive, data }: { active: string; setActive: (id: string) => void; data: IssueData }) {
  return (
    <nav className="tabs" role="tablist">
      {data.tabs.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => setActive(t.id)}
          className="tab"
        >
          <span className="num">{t.num}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

function Lead({ data }: { data: IssueData }) {
  return (
    <section className="lead">
      <div className="lead-art">
        {data.lead.image
          ? <img src={data.lead.image} alt={data.lead.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div className="placeholder" />
        }
        <div className="hero-tag">{data.lead.tag}</div>
      </div>
      <div className="lead-text">
        <div className="kicker">{data.lead.kicker}</div>
        <h1 dangerouslySetInnerHTML={{ __html: data.lead.title }} />
        <p className="dek">{data.lead.dek}</p>
        <div className="byline">
          <div className="avatar">{data.lead.initials}</div>
          <div><b>{data.lead.author}</b> · <span>{data.lead.role}</span></div>
          <div style={{ marginLeft: 'auto' }}>{data.lead.readTime}</div>
        </div>
        {data.lead.readLink && (
          <Link
            href={data.lead.readLink}
            style={{
              display: 'inline-block',
              marginTop: '16px',
              fontFamily: 'var(--sans)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '8px 16px',
              textDecoration: 'none',
            }}
          >
            Read Now →
          </Link>
        )}
      </div>
    </section>
  )
}

// ─── News ─────────────────────────────────────────────────────────────────────

function News({ data }: { data: IssueData }) {
  return (
    <div>
      <div className="section-head">
        <span className="num">§ 02</span>
        <h2>The Dispatch</h2>
        <span className="tag">Filed this week</span>
      </div>
      {data.news.map(n => (
        <Link
          key={n.n}
          href={n.slug ? `/news/${n.slug}` : '#'}
          style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
        >
          <article className="news-row" style={{ cursor: 'pointer' }}>
            <div className="idx">{n.n}</div>
            <div className="body">
              <h3>{n.title}</h3>
              <p>{n.blurb}</p>
            </div>
            <div className="meta">
              <span className="chip">{n.cat}</span>
              <span>{n.time}</span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

// ─── Poll ─────────────────────────────────────────────────────────────────────

function Poll({ data }: { data: IssueData }) {
  const issueNumber = data.issue.number
  const storageKey = `tgs-poll-${issueNumber}`
  const opts = data.poll.options

  const [voted, setVoted] = useState<number | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Load current vote counts + check if already voted on this device
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) setVoted(Number(saved))

    fetch(`/api/poll?issue=${issueNumber}`)
      .then(r => r.json())
      .then(d => {
        setCounts(d.votes || {})
        setTotal(d.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [issueNumber, storageKey])

  const handleVote = async (i: number) => {
    if (voted !== null || submitting) return
    setSubmitting(true)
    setVoted(i)
    localStorage.setItem(storageKey, String(i))

    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: issueNumber, option: i }),
      })
      const d = await res.json()
      setCounts(d.votes || {})
      setTotal(d.total || 0)
    } catch {
      // Keep local state even if request fails
    } finally {
      setSubmitting(false)
    }
  }

  const getPct = (i: number) => {
    if (total === 0) return 0
    return Math.round(((counts[String(i)] || 0) / total) * 100)
  }

  const hasVoted = voted !== null

  return (
    <div className="poll">
      <div className="label">Reader Poll · Issue {issueNumber}</div>
      <h3>{data.poll.question}</h3>
      <div className="opts">
        {opts.map((o, i) => {
          const pct = getPct(i)
          return (
            <button
              key={i}
              className={`opt${hasVoted ? ' voted' : ''}${voted === i ? ' selected' : ''}`}
              onClick={() => handleVote(i)}
              disabled={hasVoted || submitting || loading}
            >
              <div className="fill" style={{ width: hasVoted ? `${pct}%` : '0%' }} />
              <span>{o.label}{voted === i ? ' ✓' : ''}</span>
              <span className="pct">{hasVoted ? `${pct}%` : ''}</span>
            </button>
          )
        })}
      </div>
      <div className="total">
        <span>
          {loading ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'vote' : 'votes'}`}
        </span>
        <span>{data.poll.closes}</span>
      </div>
    </div>
  )
}

// ─── Release Calendar ─────────────────────────────────────────────────────────

function ReleaseCalendar({ data }: { data: IssueData }) {
  return (
    <div>
      <div className="section-head">
        <span className="num">§ 05</span>
        <h2>On Deck</h2>
        <span className="tag">Next 4 weeks</span>
      </div>
      <div className="calendar">
        {data.calendar.map((c, i) => (
          <div className="cal-row" key={i}>
            <div className="date">{c.day}<b>{c.date}</b></div>
            <div className="title">{c.title}<small>{c.sub}</small></div>
            <div className="platform">{c.platform}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

function Reviews({ data }: { data: IssueData }) {
  return (
    <section className="reviews">
      {data.reviews.map((r, i) => (
        <Link
          key={i}
          href={r.slug ? `/reviews/${r.slug}` : '#'}
          style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
        >
          <article className="review" style={{ cursor: 'pointer' }}>
            <div className="cover">
              {r.image
                ? <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div className="placeholder" />
              }
              <div className={`score${r.hot ? ' hot' : ''}`}>
                <b>{r.score}</b>
                <span className="outof">/ 10</span>
              </div>
            </div>
            <div className="meta">
              <span>{r.studio}</span>
              <span>· {r.platforms.join(' · ')}</span>
            </div>
            <h3>{r.title}</h3>
            <p className="pull">&ldquo;{r.pull}&rdquo;</p>
            <div className="foot">
              <span>{r.author}</span>
              <span>{r.hours}</span>
            </div>
          </article>
        </Link>
      ))}
    </section>
  )
}

// ─── Indie Spotlight ──────────────────────────────────────────────────────────

function IndieSpotlight({ data }: { data: IssueData }) {
  return (
    <section className="spotlight">
      <div className="spotlight-inner">
        <div className="art">
          {data.spotlight.image
            ? <img src={data.spotlight.image} alt={data.spotlight.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div className="ph" />
          }
        </div>
        <div>
          <div className="kicker">{data.spotlight.kicker}</div>
          <h2>{data.spotlight.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: data.spotlight.blurb }} />
          <div className="meta-row">
            <div><small>Developer</small><b>{data.spotlight.dev}</b></div>
            <div><small>Price</small><b>{data.spotlight.price}</b></div>
            <div><small>Platforms</small><b>{data.spotlight.platforms}</b></div>
            <div><small>Length</small><b>{data.spotlight.runtime}</b></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Discussion ───────────────────────────────────────────────────────────────

function Discussion({ data }: { data: IssueData }) {
  const issueNumber = data.issue.number
  const storageKey = `tgs-reactions-${issueNumber}`

  const [active, setActive] = useState<Set<string>>(new Set())
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(data.reactions.map(r => [r.key, r.count]))
  )
  const [reactionsLoaded, setReactionsLoaded] = useState(false)
  const [composeVal, setCompose] = useState('')
  const [comments, setComments] = useState<CommentItem[]>(data.comments)

  // Load real reaction counts + restore which ones this device toggled
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try { setActive(new Set(JSON.parse(saved))) } catch {}
    }

    fetch(`/api/reactions?issue=${issueNumber}`)
      .then(r => r.json())
      .then(d => {
        if (d.counts) setCounts(d.counts)
      })
      .catch(() => {})
      .finally(() => setReactionsLoaded(true))
  }, [issueNumber, storageKey])

  const toggle = useCallback(async (k: string) => {
    const isActive = active.has(k)
    const next = new Set(active)
    const newCounts = { ...counts }

    if (isActive) {
      next.delete(k)
      newCounts[k] = Math.max(0, (newCounts[k] || 0) - 1)
    } else {
      next.add(k)
      newCounts[k] = (newCounts[k] || 0) + 1
    }

    setActive(next)
    setCounts(newCounts)
    localStorage.setItem(storageKey, JSON.stringify([...next]))

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: issueNumber,
          key: k,
          action: isActive ? 'remove' : 'add',
        }),
      })
      const d = await res.json()
      if (d.counts) setCounts(d.counts)
    } catch {}
  }, [active, counts, issueNumber, storageKey])

  const submit = () => {
    if (!composeVal.trim()) return
    setComments([{
      name: 'You', handle: '@you', time: 'now', initials: 'YO',
      body: composeVal.trim(), replies: 0, likes: 0,
    }, ...comments])
    setCompose('')
  }

  return (
    <section className="discussion">
      <div className="section-head">
        <span className="num">§ 06</span>
        <h2>Discourse</h2>
        <span className="tag">{comments.length} readers chiming in</span>
      </div>
      <div className="reactions">
        {data.reactions.map(r => (
          <button
            key={r.key}
            className={`reaction${active.has(r.key) ? ' active' : ''}`}
            onClick={() => toggle(r.key)}
            disabled={!reactionsLoaded}
            title={active.has(r.key) ? `Remove ${r.label} reaction` : `React with ${r.label}`}
          >
            <span className="glyph">{r.glyph}</span>
            <span>{r.label}</span>
            <span className="count">{(counts[r.key] || 0).toLocaleString()}</span>
          </button>
        ))}
      </div>
      <div className="comments">
        <div className="comment-compose">
          <div className="av">YO</div>
          <textarea
            placeholder="Share a thought on this week's issue…"
            value={composeVal}
            onChange={e => setCompose(e.target.value)}
          />
          <button onClick={submit}>POST →</button>
        </div>
        {comments.map((c, i) => (
          <article className="comment" key={i}>
            <div className="comment-head">
              <div className="av">{c.initials}</div>
              <b>{c.name}</b>
              <span>{c.handle}</span>
              <span className="dot">·</span>
              <span>{c.time}</span>
            </div>
            <p>{c.body}</p>
            <div className="foot">
              <span>↑ {c.likes}</span>
              <span>↳ {c.replies} replies</span>
              <span>SHARE</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─── Subscribe Banner ─────────────────────────────────────────────────────────

function SubscribeBanner({ data }: { data: IssueData }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim() || !email.includes('@') || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="subscribe-banner">
      <div className="subscribe-banner-inner">
        <div className="subscribe-banner-text">
          <div className="subscribe-kicker">Free · Weekly · Independent</div>
          <h2>Join {data.issue.subscribers} readers who actually care about games.</h2>
          <p>Every Friday — news, reviews, the indie room, and a poll. No algorithm. No noise. Just the week in games, done right.</p>
        </div>
        <div className="subscribe-banner-form">
          {status === 'done' ? (
            <div className="subscribe-success">
              <span className="subscribe-check">✓</span>
              <div>
                <strong>You&apos;re in.</strong>
                <p>Check your inbox for a confirmation email.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="subscribe-form-row">
              <input
                type="email"
                placeholder="YOUR@EMAIL.COM"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'SENDING…' : 'SUBSCRIBE FREE →'}
              </button>
              {status === 'error' && (
                <p className="subscribe-error">Something went wrong — try again.</p>
              )}
            </form>
          )}
          <p className="subscribe-fine">No spam. Unsubscribe anytime. Published every Friday.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ data }: { data: IssueData }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="brand">The Gamer·Scene</div>
          <p>An independent gaming publication. Published Fridays. Read by {data.issue.subscribers} people who take games seriously.</p>
        </div>
        <div>
          <h4>Sections</h4>
          <ul>
            <li><a href="/">The Scene</a></li>
            <li><a href="/">Dispatch</a></li>
            <li><Link href="/reviews">Review Index</Link></li>
            <li><Link href="/issues">Issue Archive</Link></li>
            <li><a href="/feed.xml">RSS Feed</a></li>
          </ul>
        </div>
        <div>
          <h4>Archive</h4>
          <ul>
            <li><Link href="/issues">All Issues</Link></li>
            <li><a href="/issues">Issues 2026</a></li>
            <li><a href="/issues">Issues 2025</a></li>
            <li><a href="/issues">Best of 2024</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li><a href="https://thegamerscenedaily.substack.com" target="_blank" rel="noopener noreferrer">Newsletter</a></li>
            <li><a href="https://thegamerscenedaily.substack.com" target="_blank" rel="noopener noreferrer">Substack</a></li>
          </ul>
        </div>
        <div className="colophon">
          <span>© 2026 THE GAMER SCENE · EST. 2013 · SET IN FRAUNCES &amp; INTER TIGHT</span>
          <span>
            <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>ABOUT</Link>
            {' / '}
            <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>CONTACT</Link>
            {' / '}
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>PRIVACY</Link>
            {' / '}
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}


// ─── IssuePage (main export) ──────────────────────────────────────────────────

export default function IssuePage({ data }: { data: IssueData }) {
  const [tab, setTab] = useState('scene')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tgs-tab')
      if (saved) setTab(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('tgs-tab', tab) } catch {}
  }, [tab])

  // Global keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="app">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <Topbar data={data} onSearchOpen={() => setSearchOpen(true)} />
      <Masthead data={data} />
      <IssueTabs active={tab} setActive={setTab} data={data} />

      {/* The Scene — main hub */}
      <div className={`panel${tab === 'scene' ? ' active' : ''}`}>
        <Lead data={data} />
        <div className="columns">
          <News data={data} />
          <div className="sidebar">
            <Poll data={data} />
            <ReleaseCalendar data={data} />
          </div>
        </div>
        <IndieSpotlight data={data} />
        <Reviews data={data} />
        <Discussion data={data} />
      </div>

      {/* Dispatch */}
      <div className={`panel${tab === 'news' ? ' active' : ''}`}>
        <div style={{ padding: '32px 0' }}>
          <News data={data} />
        </div>
      </div>

      {/* Reviews */}
      <div className={`panel${tab === 'reviews' ? ' active' : ''}`}>
        <div style={{ padding: '32px 0' }}>
          <div className="section-head">
            <span className="num">§ 03</span>
            <h2>Reviews</h2>
            <span className="tag">This week&apos;s verdicts</span>
          </div>
          <Reviews data={data} />
        </div>
      </div>

      {/* Indie Room */}
      <div className={`panel${tab === 'indie' ? ' active' : ''}`}>
        <IndieSpotlight data={data} />
      </div>

      {/* Calendar */}
      <div className={`panel${tab === 'calendar' ? ' active' : ''}`}>
        <div style={{ padding: '32px 0', maxWidth: 720 }}>
          <ReleaseCalendar data={data} />
        </div>
      </div>

      {/* Discourse */}
      <div className={`panel${tab === 'discourse' ? ' active' : ''}`}>
        <Discussion data={data} />
      </div>

      <SubscribeBanner data={data} />
      <Footer data={data} />

    </div>
  )
}
