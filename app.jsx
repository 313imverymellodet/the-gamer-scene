// The Gamer Scene — main app components

const { useState, useEffect, useRef } = React;
const D = window.TGS_DATA;

// ---------- Masthead ----------
function Topbar() {
  const items = [...D.ticker, ...D.ticker];
  return (
    <div className="topbar">
      <div className="left">TGS · Issue {D.issue.number}</div>
      <div className="ticker">
        <div className="ticker-track">
          {items.map((t, i) => (
            <span key={i}><em>{t.tag}</em>{t.text}</span>
          ))}
        </div>
      </div>
      <div className="right">
        <span>{D.issue.weekday}, {D.issue.date}</span>
        <span>·</span>
        <span>{D.issue.subscribers} readers</span>
      </div>
    </div>
  );
}

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-top">
        <div>Est. 2019 · {D.issue.volume} · No. {D.issue.number}</div>
        <div className="stamp">◆ TGS / 26 · THE GAMER SCENE</div>
        <div>{D.issue.weekday}, {D.issue.date}</div>
      </div>
      <div className="masthead-title">
        The Gamer<span className="amp">·</span>Scene
      </div>
      <div className="masthead-meta">
        <div><span>Issue</span><b>№ {D.issue.number} / 2026</b></div>
        <div><span>Read Time</span><b>{D.issue.readTime}</b></div>
        <div><span>Weather</span><b>{D.issue.weather}</b></div>
        <div><span>Dispatched From</span><b>{D.issue.location}</b></div>
      </div>
    </header>
  );
}

// ---------- Tabs ----------
function Tabs({ active, setActive }) {
  return (
    <nav className="tabs" role="tablist">
      {D.tabs.map(t => (
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
  );
}

// ---------- Lead ----------
function Lead({ onPlay }) {
  return (
    <section className="lead">
      <div className="lead-art" onClick={onPlay} role="button" tabIndex={0}>
        <div className="placeholder">[ COVER · EDITORIAL ILLUSTRATION ]</div>
        <div className="hero-tag">{D.lead.tag}</div>
        <div className="hero-play">▶</div>
        <div className="hero-runtime">{D.lead.videoTag}</div>
      </div>
      <div className="lead-text">
        <div className="kicker">{D.lead.kicker}</div>
        <h1 dangerouslySetInnerHTML={{ __html: D.lead.title }} />
        <p className="dek">{D.lead.dek}</p>
        <div className="byline">
          <div className="avatar">{D.lead.initials}</div>
          <div>
            <b>{D.lead.author}</b> · <span>{D.lead.role}</span>
          </div>
          <div style={{ marginLeft: "auto" }}>{D.lead.readTime}</div>
        </div>
      </div>
    </section>
  );
}

// ---------- News ----------
function News() {
  return (
    <div>
      <div className="section-head">
        <span className="num">§ 02</span>
        <h2>The Dispatch</h2>
        <span className="tag">Filed this week</span>
      </div>
      {D.news.map((n) => (
        <article className="news-row" key={n.n}>
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
      ))}
    </div>
  );
}

// ---------- Poll ----------
function Poll() {
  const [voted, setVoted] = useState(null);
  const opts = D.poll.options;
  return (
    <div className="poll">
      <div className="label">Reader Poll · 24H</div>
      <h3>{D.poll.question}</h3>
      <div className="opts">
        {opts.map((o, i) => (
          <button
            key={i}
            className={`opt${voted !== null ? " voted" : ""}${voted === i ? " selected" : ""}`}
            onClick={() => voted === null && setVoted(i)}
            disabled={voted !== null}
          >
            <div className="fill" style={{ width: voted !== null ? `${o.pct}%` : "0%" }} />
            <span>{o.label}{voted === i ? " ✓" : ""}</span>
            <span className="pct">{voted !== null ? `${o.pct}%` : ""}</span>
          </button>
        ))}
      </div>
      <div className="total">
        <span>{D.poll.total} votes</span>
        <span>{D.poll.closes}</span>
      </div>
    </div>
  );
}

// ---------- Calendar ----------
function Calendar() {
  return (
    <div>
      <div className="section-head">
        <span className="num">§ 05</span>
        <h2>On Deck</h2>
        <span className="tag">Next 4 weeks</span>
      </div>
      <div className="calendar">
        {D.calendar.map((c, i) => (
          <div className="cal-row" key={i}>
            <div className="date">{c.day}<b>{c.date}</b></div>
            <div className="title">{c.title}<small>{c.sub}</small></div>
            <div className="platform">{c.platform}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Reviews ----------
function Reviews() {
  return (
    <section className="reviews">
      {D.reviews.map((r, i) => (
        <article className="review" key={i}>
          <div className="cover">
            <div className="placeholder">[ KEY ART ]</div>
            <div className={`score${r.hot ? " hot" : ""}`}>
              <b>{r.score}</b>
              <span className="outof">/ 10</span>
            </div>
          </div>
          <div className="meta">
            <span>{r.studio}</span>
            <span>· {r.platforms.join(" · ")}</span>
          </div>
          <h3>{r.title}</h3>
          <p className="pull">"{r.pull}"</p>
          <div className="foot">
            <span>{r.author}</span>
            <span>{r.hours}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

// ---------- Indie Spotlight ----------
function Spotlight() {
  return (
    <section className="spotlight">
      <div className="spotlight-inner">
        <div className="art">
          <div className="ph">[ INDIE SPOTLIGHT · KEY ART ]</div>
        </div>
        <div>
          <div className="kicker">{D.spotlight.kicker}</div>
          <h2>{D.spotlight.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: D.spotlight.blurb }} />
          <div className="meta-row">
            <div><small>Developer</small><b>{D.spotlight.dev}</b></div>
            <div><small>Price</small><b>{D.spotlight.price}</b></div>
            <div><small>Platforms</small><b>{D.spotlight.platforms}</b></div>
            <div><small>Length</small><b>{D.spotlight.runtime}</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Discussion ----------
function Discussion() {
  const [active, setActive] = useState(new Set());
  const [counts, setCounts] = useState(
    Object.fromEntries(D.reactions.map(r => [r.key, r.count]))
  );
  const [composeVal, setCompose] = useState("");
  const [comments, setComments] = useState(D.comments);

  const toggle = (k) => {
    const next = new Set(active);
    const newCounts = { ...counts };
    if (next.has(k)) { next.delete(k); newCounts[k]--; }
    else { next.add(k); newCounts[k]++; }
    setActive(next); setCounts(newCounts);
  };

  const submit = () => {
    if (!composeVal.trim()) return;
    setComments([{
      name: "You", handle: "@you", time: "now", initials: "YO",
      body: composeVal.trim(), replies: 0, likes: 0
    }, ...comments]);
    setCompose("");
  };

  return (
    <section className="discussion">
      <div className="section-head">
        <span className="num">§ 06</span>
        <h2>Discourse</h2>
        <span className="tag">{comments.length} readers chiming in</span>
      </div>
      <div className="reactions">
        {D.reactions.map(r => (
          <button
            key={r.key}
            className={`reaction${active.has(r.key) ? " active" : ""}`}
            onClick={() => toggle(r.key)}
          >
            <span className="glyph">{r.glyph}</span>
            <span>{r.label}</span>
            <span className="count">{counts[r.key].toLocaleString()}</span>
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
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="brand">The Gamer·Scene</div>
          <p>An independent gaming newsletter. Published Saturdays. Read by {D.issue.subscribers} people who take games seriously.</p>
          <div className="subscribe">
            <input type="email" placeholder="YOUR@EMAIL.COM" />
            <button>SUBSCRIBE</button>
          </div>
        </div>
        <div>
          <h4>Sections</h4>
          <ul>
            <li>The Scene</li><li>Dispatch</li><li>Reviews</li>
            <li>Indie Room</li><li>Discourse</li>
          </ul>
        </div>
        <div>
          <h4>Archive</h4>
          <ul>
            <li>Issues 2026</li><li>Issues 2025</li><li>Best of 2024</li>
            <li>Longreads</li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li>RSS</li><li>Bluesky</li><li>Mastodon</li>
            <li>YouTube</li>
          </ul>
        </div>
        <div className="colophon">
          <span>© 2026 THE GAMER SCENE · SET IN FRAUNCES &amp; INTER TIGHT</span>
          <span>MANIFESTO / ETHICS / CONTACT</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Video Modal ----------
function VideoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-inner" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕ CLOSE</button>
        <div className="fake-video">
          <div className="play-lg">▶</div>
          <div style={{ position: "absolute", bottom: 20, left: 24, color: "white", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em" }}>
            {D.lead.videoTitle.toUpperCase()} · 2:14
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Tweaks Panel ----------
const THEMES = [
  { id: "newsprint", label: "Newsprint", swatch: "oklch(0.97 0.008 85)" },
  { id: "midnight",  label: "Midnight",  swatch: "oklch(0.14 0.02 260)" },
  { id: "riso",      label: "Risograph", swatch: "oklch(0.7 0.2 25)" },
  { id: "heat",      label: "Heat",      swatch: "oklch(0.6 0.24 28)" },
];

function Tweaks({ theme, setTheme, density, setDensity, tone, setTone, open, setOpen }) {
  return (
    <>
      {!open && (
        <button className="tweaks-fab" onClick={() => setOpen(true)} title="Tweaks">✦</button>
      )}
      <div className={`tweaks${open ? " open" : ""}`}>
        <div className="tweaks-head">
          <span>◆ TWEAKS</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="tweaks-body">
          <div className="tweak-group">
            <div className="lbl">Visual Theme</div>
            <div className="opts">
              {THEMES.map(t => (
                <button key={t.id}
                  className={`opt${theme === t.id ? " active" : ""}`}
                  onClick={() => setTheme(t.id)}>
                  <div className="swatch" style={{ background: t.swatch }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="tweak-group">
            <div className="lbl">Density</div>
            <div className="opts">
              {["Editorial", "Compact"].map(d => (
                <button key={d}
                  className={`opt${density === d ? " active" : ""}`}
                  onClick={() => setDensity(d)}>
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="tweak-group">
            <div className="lbl">Editorial Tone</div>
            <div className="opts">
              {["Measured", "Punchy"].map(t => (
                <button key={t}
                  className={`opt${tone === t ? " active" : ""}`}
                  onClick={() => setTone(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- App ----------
function App() {
  const initial = (() => {
    try { return JSON.parse(localStorage.getItem("tgs-state") || "{}"); }
    catch { return {}; }
  })();

  const [tab, setTab] = useState(initial.tab || "scene");
  const [theme, setTheme] = useState(initial.theme || "newsprint");
  const [density, setDensity] = useState(initial.density || "Editorial");
  const [tone, setTone] = useState(initial.tone || "Measured");
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-density", density.toLowerCase());
    document.body.setAttribute("data-tone", tone.toLowerCase());
    localStorage.setItem("tgs-state", JSON.stringify({ tab, theme, density, tone }));
  }, [tab, theme, density, tone]);

  // Edit-mode protocol
  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="app">
      <Topbar />
      <Masthead />
      <Tabs active={tab} setActive={setTab} />

      <div className={`panel${tab === "scene" ? " active" : ""}`} data-screen-label="01 Scene">
        <Lead onPlay={() => setVideo(true)} />
        <div className="columns">
          <News />
          <div className="sidebar">
            <Poll />
            <Calendar />
          </div>
        </div>
        <Spotlight />
        <Reviews />
        <Discussion />
      </div>

      <div className={`panel${tab === "news" ? " active" : ""}`} data-screen-label="02 Dispatch">
        <div style={{ padding: "32px 0" }}>
          <News />
        </div>
      </div>

      <div className={`panel${tab === "reviews" ? " active" : ""}`} data-screen-label="03 Reviews">
        <div style={{ padding: "32px 0" }}>
          <div className="section-head">
            <span className="num">§ 03</span>
            <h2>Reviews</h2>
            <span className="tag">This week's verdicts</span>
          </div>
          <Reviews />
        </div>
      </div>

      <div className={`panel${tab === "indie" ? " active" : ""}`} data-screen-label="04 Indie">
        <Spotlight />
      </div>

      <div className={`panel${tab === "calendar" ? " active" : ""}`} data-screen-label="05 Calendar">
        <div style={{ padding: "32px 0", maxWidth: 720 }}>
          <Calendar />
        </div>
      </div>

      <div className={`panel${tab === "discourse" ? " active" : ""}`} data-screen-label="06 Discourse">
        <Discussion />
      </div>

      <Footer />

      <Tweaks
        theme={theme} setTheme={setTheme}
        density={density} setDensity={setDensity}
        tone={tone} setTone={setTone}
        open={open} setOpen={setOpen}
      />
      <VideoModal open={video} onClose={() => setVideo(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
