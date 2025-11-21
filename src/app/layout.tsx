import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { personalInfo } from '@/lib/data'
import RouteFixer from '@/components/RouteFixer'
import { ThemeProvider } from '@/context/ThemeContext'

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
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <RouteFixer />
                    <Header />
                    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
                        {children}
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
