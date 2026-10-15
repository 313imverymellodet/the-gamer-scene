import type { Metadata } from 'next'
import { getLatestIssue } from '@/lib/content'
import IssuePage from '@/components/IssuePage'
import JsonLd from '@/components/JsonLd'
import { homeStructuredData, pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
    absoluteTitle: true,
  })
}

export default async function Home() {
  const data = await getLatestIssue()
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <IssuePage data={data} />
    </>
  )
}
