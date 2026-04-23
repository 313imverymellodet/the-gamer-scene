import type { Metadata } from 'next'
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
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
  metadataBase: new URL('https://thegamerscene.news'),
  title: {
    default: 'The Gamer Scene',
    template: '%s — The Gamer Scene',
  },
  description: 'An independent gaming publication. Reviews, news, and criticism published weekly.',
  openGraph: {
    title: 'The Gamer Scene',
    description: 'An independent gaming publication. Reviews, news, and criticism published weekly.',
    type: 'website',
    siteName: 'The Gamer Scene',
    url: 'https://thegamerscene.news',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Gamer Scene',
    description: 'An independent gaming publication.',
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
        {/* PropellerAds — Service Worker Push Notifications */}
        <Script
          id="propellerads-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .catch(function(err) { console.log('SW registration failed:', err); });
                navigator.serviceWorker.register('/sw2.js', { scope: '/sw2-scope/' })
                  .catch(function(err) { console.log('SW2 registration failed:', err); });
              }
            `,
          }}
        />
        {/* PropellerAds — Zone Tag */}
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="232885"
          async
          data-cfasync="false"
          strategy="afterInteractive"
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3986912390941751"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
