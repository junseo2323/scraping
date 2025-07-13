import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { Noto_Sans } from 'next/font/google'
import { Noto_Sans_KR } from 'next/font/google'

import './globals.css';
import {AuthProvider} from '@/context/AuthContext'
import Navigation from '@/components/Navigation'
import { usePathname } from 'next/navigation'

const inter = Noto_Sans_KR({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Scraping',
    description: '매일의 나를 남기는 일, 기록',

}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" style={{ overflowX: 'hidden' }}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="google-site-verification" content="lVeoww_Qsl09sLaSLcUP2h7_O_1HdFGEmDXCy2jVAZI" />
            </head>
            <body className={inter.className}>
                <SpeedInsights/>
                <Analytics/>
                <AuthProvider>
                    <Navigation />
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
