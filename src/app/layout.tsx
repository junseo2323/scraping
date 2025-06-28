import type { Metadata } from 'next'

import { Noto_Sans } from 'next/font/google'
import { Noto_Sans_KR } from 'next/font/google'

import './globals.css'
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
            <body className={inter.className}>
                <AuthProvider>
                    <Navigation />
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
