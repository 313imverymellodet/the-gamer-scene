import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SubscribeForm from '@/components/SubscribeForm'
import TrackPageView from '@/components/TrackPageView'

export const metadata: Metadata = {
  title: 'Subscribe to The Weekly Drop',
  description:
    'The five biggest gaming stories, releases, deals, and culture moments delivered once a week. Free, sharp, and readable in under five minutes.',
  openGraph: {
    title: 'Subscribe to The Weekly Drop — TheGamerScene',
    description:
      'Know what matters in gaming without living on your timeline. One email a week, about five minutes.',
  },
}

const PREVIEW_ITEMS = [
  'The biggest gaming story',
  'The release worth watching',
  'The deal worth knowing',
  'What the community is talking about',
  'What to play this weekend',
]

export default function SubscribePage() {
  return (
    <div className="subscribe-page">
      <TrackPageView event="newsletter_landing_view" />
      <SiteHeader />

      <main id="main-content" className="sp-main">
        <section className="sp-hero">
          <p className="sp-kicker">The Weekly Drop · Free · Once a week</p>
          <h1 className="sp-headline">
            Know what matters in gaming without living on your timeline.
          </h1>
          <p className="sp-sub">
            The five biggest gaming stories, releases, deals, and culture moments delivered once a
            week. Free, sharp, and readable in under five minutes.
          </p>

          <SubscribeForm />
        </section>

        <section className="sp-preview" aria-labelledby="sp-preview-heading">
          <h2 className="sp-preview-heading" id="sp-preview-heading">
            The Weekly Drop
          </h2>
          <ol className="sp-preview-list">
            {PREVIEW_ITEMS.map((item, i) => (
              <li key={item}>
                <span className="sp-preview-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="sp-what" aria-labelledby="sp-what-heading">
          <h2 className="sp-what-heading" id="sp-what-heading">
            What you get
          </h2>
          <ul className="sp-what-list">
            <li>
              <strong>One focused issue each week.</strong> No inbox flooding, no duplicate sends.
            </li>
            <li>
              <strong>Five stories worth knowing</strong>, explained — not a link dump.
            </li>
            <li>
              <strong>Releases, deals, and community picks</strong> you can act on.
            </li>
            <li>
              <strong>About a five-minute read.</strong> That is the whole promise.
            </li>
          </ul>
          <p className="sp-signoff">
            Written by Romello Morris. Replies go to a real inbox — tell us what you are playing.
          </p>
        </section>
      </main>
    </div>
  )
}
