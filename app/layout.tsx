import type { Metadata } from 'next'
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // No openGraph.url / twitter title here. Child pages that omit them would
  // otherwise inherit the homepage URL and the generic card text.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thegamerscene',
  },
  other: {
    'google-adsense-account': 'ca-pub-3986912390941751',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* RSS Feed autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Gamer Scene"
          href="/feed.xml"
        />
        {/* Ezoic Privacy Scripts — must load first for consent compliance */}
        <Script
          data-cfasync="false"
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
        />
        <Script
          data-cfasync="false"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
        />
        {/* Ezoic Header Script — initializes ad system */}
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="ezoic-standalone-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.ezstandalone = window.ezstandalone || {}; ezstandalone.cmd = ezstandalone.cmd || [];`,
          }}
        />
        <Script
          src="//ezoicanalytics.com/analytics.js"
          strategy="beforeInteractive"
        />
      </head>
      <body data-theme="newsprint">
        {children}
        <Analytics />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BXRRBXKLPX"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BXRRBXKLPX');
            `,
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3986912390941751"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Site analytics tracker */}
        <Script
          src="https://web-production-694ea.up.railway.app/tracker.js"
          data-site-id="a03e4831-0201-40bf-b858-eb29d4ab68b6"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
