import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { IssueData, NewsItem, ReviewItem } from '@/types'

const contentDir = path.join(process.cwd(), 'content')

// ─── News ─────────────────────────────────────────────────────────────────────

export function getNewsItems(limit = 6): NewsItem[] {
  const newsDir = path.join(contentDir, 'news')
  if (!fs.existsSync(newsDir)) return []

  return fs.readdirSync(newsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .slice(0, limit)
    .map((file, index) => {
      const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const { data } = matter(raw)
      return {
        n: String(index + 1).padStart(2, '0'),
        title: data.title as string,
        blurb: data.blurb as string,
        cat: data.category as string,
        time: getRelativeTime(data.date as string),
        slug: file.replace('.md', ''),
      }
    })
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function getReviews(issue?: string): ReviewItem[] {
  const reviewsDir = path.join(contentDir, 'reviews')
  if (!fs.existsSync(reviewsDir)) return []

  return fs.readdirSync(reviewsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .map(file => {
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      return {
        title: data.title as string,
        studio: data.studio as string,
        platforms: (data.platforms as string[]) ?? [],
        score: data.score as number,
        pull: data.pull as string,
        author: data.author as string,
        hours: `${data.hours}h played`,
        hot: Boolean(data.hot),
        slug: file.replace('.md', ''),
        issue: data.issue as string | undefined,
        image: data.image as string | undefined,
      }
    })
    .filter(r => !issue || r.issue === issue)
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export async function getLatestIssue(): Promise<IssueData> {
  const issuesDir = path.join(contentDir, 'issues')
  const files = fs.readdirSync(issuesDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()

  if (!files.length) throw new Error('No issues found in content/issues/')

  const raw = fs.readFileSync(path.join(issuesDir, files[0]), 'utf-8')
  const base = JSON.parse(raw) as Omit<IssueData, 'news' | 'reviews'>

  const issueNumber = base.issue.number

  return {
    ...base,
    news: getNewsItems(6),
    reviews: getReviews(issueNumber),
  }
}

export async function getIssue(slug: string): Promise<IssueData> {
  const filePath = path.join(contentDir, 'issues', `${slug}.json`)
  if (!fs.existsSync(filePath)) throw new Error(`Issue not found: ${slug}`)

  const raw = fs.readFileSync(filePath, 'utf-8')
  const base = JSON.parse(raw) as Omit<IssueData, 'news' | 'reviews'>

  return {
    ...base,
    news: getNewsItems(6),
    reviews: getReviews(base.issue.number),
  }
}

// ─── Single Article / Review ──────────────────────────────────────────────────

export interface FullNewsItem {
  title: string
  blurb: string
  category: string
  date: string
  image?: string
  slug: string
  bodyHtml: string
}

export interface FullReviewItem extends ReviewItem {
  date: string
  bodyHtml: string
}

export function getNewsItemBySlug(slug: string): FullNewsItem | null {
  const file = path.join(contentDir, 'news', `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  return {
    title: data.title as string,
    blurb: data.blurb as string,
    category: data.category as string,
    date: data.date ? String(data.date) : '',
    image: data.image as string | undefined,
    slug,
    bodyHtml: marked(content) as string,
  }
}

export function getReviewBySlug(slug: string): FullReviewItem | null {
  const file = path.join(contentDir, 'reviews', `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  return {
    title: data.title as string,
    studio: data.studio as string,
    platforms: (data.platforms as string[]) ?? [],
    score: data.score as number,
    pull: data.pull as string,
    author: data.author as string,
    hours: `${data.hours}h played`,
    hot: Boolean(data.hot),
    slug,
    issue: data.issue as string | undefined,
    image: data.image as string | undefined,
    date: data.date ? String(data.date) : '',
    bodyHtml: marked(content) as string,
  }
}

export function getAllNewsSlugs(): string[] {
  const newsDir = path.join(contentDir, 'news')
  if (!fs.existsSync(newsDir)) return []
  return fs.readdirSync(newsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}

export function getAllReviewSlugs(): string[] {
  const reviewsDir = path.join(contentDir, 'reviews')
  if (!fs.existsSync(reviewsDir)) return []
  return fs.readdirSync(reviewsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}

// ─── Related Content ──────────────────────────────────────────────────────────

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
 * Priority: same category → same issue → most recent. Excludes the current slug.
 */
export function getRelatedNews(currentSlug: string, category?: string, limit = 3): RelatedItem[] {
  const newsDir = path.join(contentDir, 'news')
  if (!fs.existsSync(newsDir)) return []

  const files = fs.readdirSync(newsDir)
    .filter(f => f.endsWith('.md') && f.replace('.md', '') !== currentSlug)
    .sort()
    .reverse()

  const items: Array<{ item: RelatedItem; priority: number }> = files.map(file => {
    const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
    const { data } = matter(raw)
    const slug = file.replace('.md', '')
    const item: RelatedItem = {
      type: 'news',
      title: String(data.title || ''),
      blurb: String(data.blurb || ''),
      category: String(data.category || ''),
      slug,
      href: `/news/${slug}`,
    }
    const sameCategory = category && data.category === category
    return { item, priority: sameCategory ? 1 : 0 }
  })

  return items
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(x => x.item)
}

/**
 * Returns up to `limit` related reviews, excluding the current slug.
 */
export function getRelatedReviews(currentSlug: string, limit = 2): RelatedItem[] {
  const reviewsDir = path.join(contentDir, 'reviews')
  if (!fs.existsSync(reviewsDir)) return []

  return fs.readdirSync(reviewsDir)
    .filter(f => f.endsWith('.md') && f.replace('.md', '') !== currentSlug)
    .slice(0, limit)
    .map(file => {
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      const slug = file.replace('.md', '')
      return {
        type: 'review' as const,
        title: String(data.title || ''),
        blurb: String(data.pull || data.blurb || ''),
        score: typeof data.score === 'number' ? data.score : undefined,
        slug,
        href: `/reviews/${slug}`,
      }
    })
}

export function getAllIssueSlugs(): string[] {
  const issuesDir = path.join(contentDir, 'issues')
  return fs.readdirSync(issuesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1d ago'
  return `${diffDays}d ago`
}
