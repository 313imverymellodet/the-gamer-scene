import { notFound } from 'next/navigation'
import { getIssue, getAllIssueSlugs } from '@/lib/content'
import IssuePage from '@/components/IssuePage'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'

export async function generateStaticParams() {
  return getAllIssueSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await getIssue(slug)
    return pageMetadata({
      title: `Issue №${data.issue.number}`,
      description: data.lead.dek,
      path: `/issues/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function IssueSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const data = await getIssue(slug)
    return <IssuePage data={data} />
  } catch {
    notFound()
  }
}
