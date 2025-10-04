import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { Noto_Sans } from 'next/font/google'
import { Noto_Sans_KR } from 'next/font/google'

import '../styles/global.scss';
import {AuthProvider} from '@/context/AuthContext'
import Navigation from '@/components/Navigation'
import { usePathname } from 'next/navigation'

const inter = Noto_Sans_KR({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Scraping - 스크래핑과 나의 기록을 남겨보세요',
    description: '매일의 나를 남기는 일, 기록. 당신의 이야기를 다양한 플렛폼에서 스크래핑으로 모아보세요.',
    openGraph: {
        type: 'website',
        url: 'https://jscraping.vercel.app/',  // Add the URL of the page
        title: 'Scraping - 스크래핑과 나의 기록을 남겨보세요',
        description: '매일의 나를 남기는 일, 기록. 당신의 이야기를 다양한 플렛폼에서 스크래핑으로 모아보세요.',
        images: [
            {
                url: 'https://nr38fsf9m048ia4h.public.blob.vercel-storage.com/icon.ico', // URL to an image
                width: 800,
                height: 600,
                alt: 'Scraping!! ICON'
            }
        ],
    },
    twitter: {
        title: 'Scraping - 스크래핑과 나의 기록을 남겨보세요',
        description: '매일의 나를 남기는 일, 기록. 당신의 이야기를 다양한 플렛폼에서 스크래핑으로 모아보세요.',
    },

}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" style={{ overflowX: 'hidden' }}>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
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
