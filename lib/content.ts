import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { IssueData, NewsItem, ReviewItem } from '@/types'

const contentDir = path.join(process.cwd(), 'content')

// ─── In-memory content cache ──────────────────────────────────────────────────
//
// Content is immutable between deploys. We read every file exactly once per
// process lifetime, parse frontmatter and markdown to HTML, then serve all
// subsequent requests entirely from memory.
//
// Cold-start cost (one-time): ~65 readFileSync + matter() + marked() calls.
// Warm-request cost: zero disk I/O, zero markdown parsing, pure RAM lookup.
//
// Cache invalidation: process restart (= Vercel redeploy). No TTL needed.

interface CachedEntry {
  slug: string
  data: Record<string, unknown>  // parsed frontmatter
  bodyHtml: string               // pre-rendered HTML (done once at cache-build)
}

interface ContentCache {
  news: CachedEntry[]
  reviews: CachedEntry[]
  opinion: CachedEntry[]
  builtAt: number
}

let _cache: ContentCache | null = null

function buildCache(): ContentCache {
  const read = (dir: string, stripFn?: (s: string) => string): CachedEntry[] => {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .map(file => {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
        const { data, content } = matter(raw)
        const body = stripFn ? stripFn(content) : content
        return {
          slug: file.replace('.md', ''),
          data: data as Record<string, unknown>,
          bodyHtml: marked(body) as string,
        }
      })
  }

  return {
    news:    read(path.join(contentDir, 'news')),
    reviews: read(path.join(contentDir, 'reviews')),
    opinion: read(path.join(contentDir, 'opinion'), stripSocialNotes),
    builtAt: Date.now(),
  }
}

/** Lazily build the cache on first access, then reuse forever. */
function cache(): ContentCache {
  if (!_cache) _cache = buildCache()
  return _cache
}

// ─── News ─────────────────────────────────────────────────────────────────────

export function getNewsItems(limit = 6): NewsItem[] {
  return cache().news
    .slice(0, limit)
    .map((entry, index) => ({
      n:     String(index + 1).padStart(2, '0'),
      title: String(entry.data.title  ?? ''),
      blurb: String(entry.data.blurb  ?? ''),
      cat:   String(entry.data.category ?? ''),
      time:  getRelativeTime(String(entry.data.date ?? '')),
      slug:  entry.slug,
    }))
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function getReviews(issue?: string): ReviewItem[] {
  return cache().reviews
    .filter(entry => !issue || entry.data.issue === issue)
    .map(entry => ({
      title:     String(entry.data.title    ?? ''),
      studio:    String(entry.data.studio   ?? ''),
      platforms: (entry.data.platforms as string[]) ?? [],
      score:     entry.data.score as number,
      pull:      String(entry.data.pull     ?? ''),
      author:    String(entry.data.author   ?? ''),
      hours:     `${entry.data.hours}h played`,
      hot:       Boolean(entry.data.hot),
      slug:      entry.slug,
      issue:     entry.data.issue as string | undefined,
      image:     entry.data.image as string | undefined,
    }))
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export async function getLatestIssue(): Promise<IssueData> {
  const issuesDir = path.join(contentDir, 'issues')
  const files = fs.readdirSync(issuesDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()

  if (!files.length) throw new Error('No issues found in content/issues/')

  const raw  = fs.readFileSync(path.join(issuesDir, files[0]), 'utf-8')
  const base = JSON.parse(raw) as Omit<IssueData, 'news' | 'reviews'>

  return {
    ...base,
    news:    getNewsItems(6),
    reviews: getReviews(base.issue.number),
  }
}

export async function getIssue(slug: string): Promise<IssueData> {
  const filePath = path.join(contentDir, 'issues', `${slug}.json`)
  if (!fs.existsSync(filePath)) throw new Error(`Issue not found: ${slug}`)

  const raw  = fs.readFileSync(filePath, 'utf-8')
  const base = JSON.parse(raw) as Omit<IssueData, 'news' | 'reviews'>

  return {
    ...base,
    news:    getNewsItems(6),
    reviews: getReviews(base.issue.number),
  }
}

// ─── Single article / review ──────────────────────────────────────────────────

export interface FullNewsItem {
  title: string
  blurb: string
  category: string
  date: string
  image?: string
  video?: string
  slug: string
  author: string
  bodyHtml: string
}

export interface FullReviewItem extends ReviewItem {
  date: string
  video?: string
  bodyHtml: string
}

export function getNewsItemBySlug(slug: string): FullNewsItem | null {
  const entry = cache().news.find(e => e.slug === slug)
  if (!entry) return null
  return {
    title:    String(entry.data.title    ?? ''),
    blurb:    String(entry.data.blurb    ?? ''),
    category: String(entry.data.category ?? ''),
    date:     entry.data.date ? String(entry.data.date) : '',
    image:    entry.data.image as string | undefined,
    video:    entry.data.video as string | undefined,
    slug,
    author:   entry.data.author ? String(entry.data.author) : 'Romello Morris',
    bodyHtml: entry.bodyHtml,
  }
}

export function getReviewBySlug(slug: string): FullReviewItem | null {
  const entry = cache().reviews.find(e => e.slug === slug)
  if (!entry) return null
  return {
    title:     String(entry.data.title  ?? ''),
    studio:    String(entry.data.studio ?? ''),
    platforms: (entry.data.platforms as string[]) ?? [],
    score:     entry.data.score as number,
    pull:      String(entry.data.pull   ?? ''),
    author:    String(entry.data.author ?? ''),
    hours:     `${entry.data.hours}h played`,
    hot:       Boolean(entry.data.hot),
    slug,
    issue:     entry.data.issue as string | undefined,
    image:     entry.data.image as string | undefined,
    video:     entry.data.video as string | undefined,
    date:      entry.data.date ? String(entry.data.date) : '',
    bodyHtml:  entry.bodyHtml,
  }
}

export function getAllNewsSlugs(): string[] {
  return cache().news.map(e => e.slug)
}

export function getAllReviewSlugs(): string[] {
  return cache().reviews.map(e => e.slug)
}

// ─── Related content ──────────────────────────────────────────────────────────

export interface RelatedItem {
  type: 'news' | 'review'
  title: string
  blurb: string
  category?: string
  score?: number
  slug: string
  href: string
}

/**
 * Returns up to `limit` related articles for a given news slug.
 * Priority: same category → most recent. Excludes the current slug.
 * Served entirely from cache — zero disk I/O.
 */
export function getRelatedNews(
  currentSlug: string,
  category?: string,
  limit = 3,
): RelatedItem[] {
  return cache().news
    .filter(e => e.slug !== currentSlug)
    .map(e => ({
      item: {
        type:     'news' as const,
        title:    String(e.data.title    ?? ''),
        blurb:    String(e.data.blurb    ?? ''),
        category: String(e.data.category ?? ''),
        slug:     e.slug,
        href:     `/news/${e.slug}`,
      },
      priority: category && e.data.category === category ? 1 : 0,
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(x => x.item)
}

/**
 * Returns up to `limit` related reviews, excluding the current slug.
 * Served entirely from cache — zero disk I/O.
 */
export function getRelatedReviews(currentSlug: string, limit = 2): RelatedItem[] {
  return cache().reviews
    .filter(e => e.slug !== currentSlug)
    .slice(0, limit)
    .map(e => ({
      type:  'review' as const,
      title: String(e.data.title ?? ''),
      blurb: String(e.data.pull  ?? e.data.blurb ?? ''),
      score: typeof e.data.score === 'number' ? e.data.score : undefined,
      slug:  e.slug,
      href:  `/reviews/${e.slug}`,
    }))
}

// ─── Opinion ──────────────────────────────────────────────────────────────────

export interface OpinionItem {
  slug: string
  title: string
  blurb: string
  date: string
  author: string
  image?: string
}

export interface FullOpinionItem extends OpinionItem {
  video?: string
  bodyHtml: string
}

export function getAllOpinionSlugs(): string[] {
  return cache().opinion.map(e => e.slug)
}

export function getAllOpinionItems(): OpinionItem[] {
  return cache().opinion.map(e => ({
    slug:   e.slug,
    title:  String(e.data.title  ?? ''),
    blurb:  String(e.data.blurb  ?? ''),
    date:   e.data.date   ? String(e.data.date)   : '',
    author: e.data.author ? String(e.data.author) : 'Romello Morris',
    image:  e.data.image as string | undefined,
  }))
}

export function getOpinionBySlug(slug: string): FullOpinionItem | null {
  const entry = cache().opinion.find(e => e.slug === slug)
  if (!entry) return null
  return {
    slug,
    title:   String(entry.data.title  ?? ''),
    blurb:   String(entry.data.blurb  ?? ''),
    date:    entry.data.date   ? String(entry.data.date)   : '',
    author:  entry.data.author ? String(entry.data.author) : 'Romello Morris',
    image:   entry.data.image as string | undefined,
    video:   entry.data.video as string | undefined,
    bodyHtml: entry.bodyHtml,
  }
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export function getAllIssueSlugs(): string[] {
  const issuesDir = path.join(contentDir, 'issues')
  return fs.readdirSync(issuesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse()
}

// ─── Search / trending index ───────────────────────────────────────────────────
//
// Flat map of slug → lightweight metadata. Used by /api/trending and
// /api/search so they never touch the filesystem at request time.

export interface ContentMeta {
  slug: string
  title: string
  blurb: string
  category: string
  type: 'news' | 'review' | 'opinion'
  score?: number
  date: string
  href: string
}

export function getAllContentMeta(): Record<string, ContentMeta> {
  const c = cache()
  const out: Record<string, ContentMeta> = {}

  for (const e of c.news) {
    out[e.slug] = {
      slug:     e.slug,
      title:    String(e.data.title    ?? ''),
      blurb:    String(e.data.blurb    ?? ''),
      category: String(e.data.category ?? 'NEWS'),
      type:     'news',
      date:     e.data.date ? String(e.data.date) : '',
      href:     `/news/${e.slug}`,
    }
  }

  for (const e of c.reviews) {
    out[e.slug] = {
      slug:     e.slug,
      title:    String(e.data.title ?? ''),
      blurb:    String(e.data.pull  ?? e.data.blurb ?? ''),
      category: 'REVIEW',
      type:     'review',
      score:    typeof e.data.score === 'number' ? e.data.score : undefined,
      date:     e.data.date ? String(e.data.date) : '',
      href:     `/reviews/${e.slug}`,
    }
  }

  for (const e of c.opinion) {
    out[e.slug] = {
      slug:     e.slug,
      title:    String(e.data.title ?? ''),
      blurb:    String(e.data.blurb ?? ''),
      category: 'OPINION',
      type:     'opinion',
      date:     e.data.date ? String(e.data.date) : '',
      href:     `/opinion/${e.slug}`,
    }
  }

  return out
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip social-media copy blocks appended to opinion markdown. */
function stripSocialNotes(markdown: string): string {
  return markdown
    .replace(/\n\*🎬[^\n]*/g, '')
    .replace(/\n\*📱[^\n]*/g, '')
    .trimEnd()
}

function getRelativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now   = new Date()
  const diffMs    = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1_000 * 60 * 60))
  const diffDays  = Math.floor(diffHours / 24)

  if (diffHours < 1)  return 'just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1d ago'
  return `${diffDays}d ago`
}
