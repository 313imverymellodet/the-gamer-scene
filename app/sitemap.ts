import { MetadataRoute } from 'next'
import { getAllNewsSlugs, getAllReviewSlugs, getAllIssueSlugs, getAllOpinionSlugs } from '@/lib/content'

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

  const opinionSlugs = getAllOpinionSlugs().map(slug => ({
    url: `${base}/opinion/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const issueSlugs = getAllIssueSlugs().map(slug => ({
    url: `${base}/issues/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: base,                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/issues`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/reviews`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/opinion`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/about`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/contact`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    ...issueSlugs,
    ...reviewSlugs,
    ...opinionSlugs,
    ...newsSlugs,
  ]
}
