import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

import '@/css/tailwind.css'

import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'

export default function App({ Component, pageProps }) {
    const router = useRouter()

    useEffect(() => {
        // Initialize Fathom when the app loads
        Fathom.load('ICJIJBJL', {
            includedDomains: ['fidum.uk']
        })

        function onRouteChangeComplete() {
            Fathom.trackPageview()
        }
        // Record a pageview when route changes
        router.events.on('routeChangeComplete', onRouteChangeComplete)

        // Unassign event listener
        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete)
        }
    }, [])

  return (
    <div className="antialiased grid grid-cols-1">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Head>
      <SectionContainer classes="border-b-2 border-gray-200 md:border-0 md:border-white md:rounded-t-lg">
        <Header />
      </SectionContainer>
      <SectionContainer classes="md:rounded-b-lg">
        <main>
          <Component {...pageProps} />
        </main>
      </SectionContainer>
    </div>
  )
}
