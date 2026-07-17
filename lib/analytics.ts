'use client'

/**
 * Newsletter funnel events.
 *
 * Deliberately absent: `newsletter_signup_confirmed`. With double opt-in, a form submission is
 * not a subscriber — only beehiiv can establish that someone confirmed. Firing a "confirmed"
 * event from the browser would silently count submissions as confirmations and inflate every
 * downstream decision, including ad spend. That event is owned by the verified webhook at
 * app/api/webhooks/beehiiv/route.ts instead.
 */
export type FunnelEvent =
  | 'newsletter_landing_view'
  | 'newsletter_signup_started'
  | 'newsletter_signup_submitted'
  | 'newsletter_confirmation_instructions_viewed'
  | 'sample_issue_viewed'
  | 'referral_cta_clicked'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void
  }
}

/**
 * Sends a funnel event to GA4.
 *
 * Pushes onto `dataLayer` rather than calling `window.gtag`. gtag.js is injected
 * `afterInteractive`, so it does not exist yet when a page's mount effect runs — calling it
 * directly dropped every landing-page view on the floor. dataLayer is a queue by design: entries
 * pushed before gtag.js loads are processed once it does, which is exactly the behaviour we want.
 *
 * Consent is handled upstream by the CMP and GA's own consent mode, not here.
 *
 * Params must never carry personal data. Email addresses in particular must not reach analytics;
 * pass attribution (utm_source and similar) only.
 */
export function track(event: FunnelEvent, params: Record<string, string | number> = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // Same shape gtag() itself pushes: an arguments-like ['event', name, params].
  window.dataLayer.push(['event', event, params])
}
