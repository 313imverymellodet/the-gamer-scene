import type { Metadata } from 'next'
import { getLatestIssue } from '@/lib/content'
import IssuePage from '@/components/IssuePage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLatestIssue()
  return {
    title: `Issue ${data.issue.number} — ${data.issue.date}`,
    description: data.lead.dek,
    openGraph: {
      title: `The Gamer Scene — Issue ${data.issue.number}`,
      description: data.lead.dek,
    },
  }
}

export default async function Home() {
  const data = await getLatestIssue()
  return <IssuePage data={data} />
}
