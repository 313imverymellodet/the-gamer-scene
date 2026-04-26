import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BASE_URL = 'https://thegamerscene.news'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface FeedItem {
  title: string
  link: string
  description: string
  pubDate: Date
  category: string
  guid: string
}

function getNewsItems(): FeedItem[] {
  const newsDir = path.join(process.cwd(), 'content', 'news')
  if (!fs.existsSync(newsDir)) return []

  return fs.readdirSync(newsDir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(newsDir, file), 'utf-8')
      const { data } = matter(raw)
      const slug = file.replace('.md', '')
      return {
        title: String(data.title || ''),
        link: `${BASE_URL}/news/${slug}`,
        description: String(data.blurb || ''),
        pubDate: data.date ? new Date(String(data.date) + 'T12:00:00Z') : new Date(),
        category: String(data.category || 'News'),
        guid: `${BASE_URL}/news/${slug}`,
      }
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
}

function getReviewItems(): FeedItem[] {
  const reviewsDir = path.join(process.cwd(), 'content', 'reviews')
  if (!fs.existsSync(reviewsDir)) return []

  return fs.readdirSync(reviewsDir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(reviewsDir, file), 'utf-8')
      const { data } = matter(raw)
      const slug = file.replace('.md', '')
      const score = data.score ? ` [${data.score}/10]` : ''
      return {
        title: `Review: ${String(data.title || '')}${score}`,
        link: `${BASE_URL}/reviews/${slug}`,
        description: String(data.pull || data.blurb || ''),
        pubDate: data.date ? new Date(String(data.date) + 'T12:00:00Z') : new Date(),
        category: 'Review',
        guid: `${BASE_URL}/reviews/${slug}`,
      }
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
}

export async function GET() {
  const news    = getNewsItems()
  const reviews = getReviewItems()

  // Interleave: merge + sort by date, take most recent 50
  const all = [...news, ...reviews]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50)

  const lastBuild = all[0]?.pubDate.toUTCString() || new Date().toUTCString()

  const items = all.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <category>${escapeXml(item.category)}</category>
      <source url="${BASE_URL}/feed.xml">The Gamer Scene</source>
    </item>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>The Gamer Scene</title>
    <link>${BASE_URL}</link>
    <description>An independent gaming publication. Reviews, news, and criticism published weekly.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <managingEditor>romello.morris@gmail.com (Romello Morris)</managingEditor>
    <webMaster>romello.morris@gmail.com (Romello Morris)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/icon.svg</url>
      <title>The Gamer Scene</title>
      <link>${BASE_URL}</link>
    </image>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
