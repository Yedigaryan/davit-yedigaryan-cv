import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { personalInfo } from '@/lib/data'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: `${personalInfo.name} - ${personalInfo.title} | Angular, React, .NET`,
    description: personalInfo.bio,
    keywords: ['Angular Developer', 'React Developer', 'Full Stack Developer', '.NET', 'C#', 'Frontend Engineer'],
    authors: [{ name: personalInfo.name }],
    openGraph: {
        title: `${personalInfo.name} - ${personalInfo.title}`,
        description: personalInfo.bio,
        type: 'website',
        url: 'https://yourportfolio.com',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    )
}
