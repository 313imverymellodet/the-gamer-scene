# The Gamer Scene — Publishing Guide

## Posting a News Item

Create a new file in `content/news/`. Name it `YYYY-MM-DD-short-title.md`.

**Example:** `content/news/2026-04-19-halo-infinite-update.md`

```markdown
---
title: "Halo Infinite drops biggest update in two years"
blurb: "Season 5 adds 12 maps, a new weapon, and a long-requested ranking overhaul."
category: Update
date: 2026-04-19
---

(Optional) Write the full article here. This isn't shown on the homepage yet
but will be used when individual article pages are added.
```

**Fields:**
| Field | What it does |
|---|---|
| `title` | Headline shown on the site |
| `blurb` | 1-2 sentence summary shown under the headline |
| `category` | Label tag — use: `Industry`, `Hardware`, `Reveal`, `Interview`, `Exclusive`, `Update`, `Rumor`, `Deal`, `Patch` |
| `date` | Publication date `YYYY-MM-DD` — controls sort order |

The **6 most recent news items** by date always show on the homepage. Just save the file and push.

---

## Posting a Review

Create a new file in `content/reviews/`. Name it `game-title.md`.

**Example:** `content/reviews/halo-infinite.md`

```markdown
---
title: Halo Infinite
studio: 343 Industries
platforms: [PC, XSX]
score: 8.1
pull: "A return to form that earns its nostalgia."
author: R. Morris
hours: 20
hot: false
date: 2026-04-19
issue: "043"
---

Write the full review here. Go as long as you want.
```

**Fields:**
| Field | What it does |
|---|---|
| `title` | Game title |
| `studio` | Developer name |
| `platforms` | List: `[PC, PS5, XSX, Switch 2, Multi]` |
| `score` | Number out of 10 (e.g. `9.2`, `7.5`) |
| `pull` | Pull quote — your one-sentence verdict |
| `author` | Your name or initials |
| `hours` | Hours played (number only) |
| `hot` | `true` = green score badge. Use for your top pick of the week |
| `issue` | Issue number this review belongs to (e.g. `"043"`) |

Reviews are shown for the current issue number. Set `issue` to match the current issue JSON.

---

## Updating the Issue (Weekly)

Edit `content/issues/042.json` — or copy it and rename to `043.json` for a new issue.

**Things to update each week:**
- `issue.number`, `issue.date`, `issue.weekday` — the issue metadata
- `ticker` — the scrolling breaking news headlines at the top
- `lead` — the cover story (title, author, dek/summary)
- `poll` — the reader poll question and options
- `calendar` — upcoming game releases
- `spotlight` — the indie spotlight pick

The site always loads the **highest-numbered JSON file** as the current issue.

---

## Publishing Workflow

1. Create/edit your markdown files locally
2. Run `npm run dev` to preview at `http://localhost:3000`
3. When ready: `git add . && git commit -m "Issue 043: add news and reviews" && git push`
4. Vercel auto-deploys in ~30 seconds — your site is live

---

## Quick Cheat Sheet

```bash
# Start local preview
npm run dev

# Publish to live site
git add .
git commit -m "brief description"
git push
```

That's it. No build commands needed — Vercel handles everything on push.
