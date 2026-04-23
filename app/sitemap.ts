import { MetadataRoute } from 'next'
import { getAllNewsSlugs, getAllReviewSlugs } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thegamerscene.news'
  const now = new Date()

  const newsSlugs = getAllNewsSlugs().map(slug => ({
    url: `${base}/news/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const reviewSlugs = getAllReviewSlugs().map(slug => ({
    url: `${base}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: base,              lastModified: now, changeFrequency: 'weekly',  priority: 1   },
    { url: `${base}/about`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    ...reviewSlugs,
    ...newsSlugs,
  ]
}
