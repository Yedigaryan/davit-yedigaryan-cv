'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { GA_ID, CLARITY_ID, getConsent, updateConsent } from '@/lib/analytics'

export default function Analytics() {
    const pathname = usePathname()

    useEffect(() => {
        const consent = getConsent()
        if (consent) updateConsent(consent === 'granted')
    }, [])

    useEffect(() => {
        if (!GA_ID || typeof window === 'undefined') return
        window.gtag?.('event', 'page_view', {
            page_path: pathname,
            page_location: window.location.href,
        })
    }, [pathname])

    if (!GA_ID && !CLARITY_ID) return null

    return (
        <>
            {GA_ID && (
                <>
                    <Script
                        id="ga-loader"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga-init" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('consent', 'default', {
                                analytics_storage: 'denied',
                                ad_storage: 'denied',
                                ad_user_data: 'denied',
                                ad_personalization: 'denied',
                            });
                            gtag('js', new Date());
                            gtag('config', '${GA_ID}', { send_page_view: false });
                        `}
                    </Script>
                </>
            )}

            {CLARITY_ID && (
                <Script id="clarity-init" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            c[a]('consent', false);
                            t=l.createElement(r);t.async=1;
                            t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window,document,"clarity","script","${CLARITY_ID}");
                    `}
                </Script>
            )}
        </>
    )
}
