# Newsletter → Site Workflow

The newsletter exists to drive visits to thegamerscene.news. Every "read more at
thegamerscene.news →" link in a newsletter MUST point at a real article. This is
the repeatable process to make that true.

## The One-Step Version

Open Claude Code in this repo and say:

> **"Publish this newsletter"** — then paste the full newsletter copy.

Claude follows the checklist below. Total time: ~5 minutes, then Vercel
auto-deploys on push.

## What "Publish" Means (the checklist)

1. **Split the newsletter into articles.** Each major section with its own
   "Read more →" link becomes one news article in `content/news/`:
   - Filename: `YYYY-MM-DD-short-slug.md` (newsletter send date)
   - Follow `templates/news.md` field format exactly
   - 500+ words each (AdSense thin-content floor)
   - Cross-link the articles to each other with relative links
     (`/news/other-slug`) — this is the internal-link mesh Google rewards

2. **Create the next issue JSON** in `content/issues/NNN.json`:
   - Copy the previous issue's JSON as the structural template
   - `lead` = the newsletter's headline story, `readLink` → its article
   - `ticker` = 5 items from the newsletter's biggest beats
   - `poll` = the newsletter's question of the day (5 options)
   - `calendar` = upcoming dates mentioned in the newsletter
   - `spotlight` = any indie-adjacent item from the newsletter
   - `comments` = 4 seeded reader comments themed to the issue

3. **Images.** Check `public/images/news/` for reusable images first.
   - Image exists → use it
   - No image → leave `image:` blank (the site renders a styled fallback)
   - NEVER point frontmatter at an image file that doesn't exist — that's
     the broken-hero bug
   - The issue `lead.image` must always point at a real file

4. **Reviews.** If the newsletter recommends games ("What to Play This Week")
   that have reviews on the site, retag those reviews' `issue:` field to the
   new issue number so the issue's Reviews section isn't empty.

5. **Validate and ship.**
   - `python3 -c "import json; json.load(open('content/issues/NNN.json'))"`
   - `npx tsc --noEmit`
   - Commit, push — Vercel rebuilds automatically (~2 min)

## Why Issues Auto-Update

The homepage calls `getLatestIssue()`, which picks the highest-numbered JSON in
`content/issues/`. Dropping in `049.json` makes it the live issue on the next
deploy. No other wiring needed.

## Writing the Newsletter First? Reverse It

If you write site articles first, the newsletter becomes excerpts + links:
1. Publish articles on the site (steps above)
2. In the newsletter, use the article `blurb` as each section's opener
3. Link each section to its article URL
4. The newsletter teases; the site delivers. Never put the full story
   only in the newsletter.
