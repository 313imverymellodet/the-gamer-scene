import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface SearchItem {
  type: 'news' | 'review'
  title: string
  blurb: string
  category?: string
  score?: number
  slug: string
  href: string
  date?: string
}

// GET /api/search
// Returns all articles and reviews as a flat searchable array
export async function GET() {
  const contentDir = path.join(process.cwd(), 'content')
  const items: SearchItem[] = []

  // News articles
  const newsDir = path.join(contentDir, 'news')
  if (fs.existsSync(newsDir)) {
    for (const file of fs.readdirSync(newsDir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const { data } = matter(raw)
      const slug = file.replace('.md', '')
      items.push({
        type: 'news',
        title: String(data.title || ''),
        blurb: String(data.blurb || ''),
        category: String(data.category || ''),
        slug,
        href: `/news/${slug}`,
        date: data.date ? String(data.date) : undefined,
      })
    }
  }

  // Reviews
  const reviewsDir = path.join(contentDir, 'reviews')
  if (fs.existsSync(reviewsDir)) {
    for (const file of fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      const slug = file.replace('.md', '')
      items.push({
        type: 'review',
        title: String(data.title || ''),
        blurb: String(data.pull || data.blurb || ''),
        score: typeof data.score === 'number' ? data.score : undefined,
        slug,
        href: `/reviews/${slug}`,
        date: data.date ? String(data.date) : undefined,
      })
    }
  }

  // Sort newest first
  items.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return NextResponse.json(items)
}
