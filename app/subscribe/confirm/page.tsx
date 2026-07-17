import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import TrackPageView from '@/components/TrackPageView'

export const metadata: Metadata = {
  title: 'Check your inbox',
  description: 'One more step to finish subscribing to The Weekly Drop.',
  // This page is only meaningful right after a submission, and it must never rank or be shared
  // as though it were a subscription confirmation in itself.
  robots: { index: false, follow: false },
}

export default function SubscribeConfirmPage() {
  return (
    <div className="subscribe-page">
      {/* Instructions viewed — NOT a confirmed subscriber. Confirmation comes from beehiiv. */}
      <TrackPageView event="newsletter_confirmation_instructions_viewed" />
      <SiteHeader />

      <main id="main-content" className="sp-main sp-main--narrow">
        <section className="sp-confirm">
          <p className="sp-kicker">Almost there</p>

          {/* Deliberately not "you're subscribed" — with double opt-in they are not a subscriber
              until they click the link in that email. */}
          <h1 className="sp-headline">One more step: check your inbox.</h1>

          <p className="sp-sub">
            Click the confirmation button in the email from TheGamerScene to complete your
            subscription. You are not subscribed until you confirm.
          </p>

          <div className="sp-confirm-help">
            <h2 className="sp-what-heading">Didn&apos;t get it?</h2>
            <ul className="sp-what-list">
              <li>Give it a minute — it usually arrives within a few.</li>
              <li>Check spam or promotions, and mark it &ldquo;not spam&rdquo; if it landed there.</li>
              <li>
                Still nothing?{' '}
                <Link href="/subscribe">Try again</Link> in case of a typo, or email{' '}
                <a href="mailto:news@thegamerscene.news">news@thegamerscene.news</a>.
              </li>
            </ul>
          </div>

          <p className="sp-signoff">
            <Link href="/">← Back to the latest issue</Link>
          </p>
        </section>
      </main>
    </div>
  )
}
