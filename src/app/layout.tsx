import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LlmChat from '@/components/LlmChat'
import { personalInfo } from '@/lib/data'
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
        url: 'https://davit.yedigaryan.pro',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
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
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
                    >
                        Skip to content
                    </a>
                    <Header />
                    <main
                        id="main-content"
                        className="min-h-screen bg-background text-foreground transition-colors duration-200"
                    >
                        {children}
                    </main>
                    <Footer />
                    <LlmChat
                        title={`Chat with ${personalInfo.name.split(' ')[0]}'s Assistant`}
                        subtitle="Ask anything about my experience, skills, or projects."
                        welcomeMessage={`Hi! I'm an AI assistant trained on ${personalInfo.name}'s CV. Ask me about his experience, skills, or projects.`}
                        telegramUrl="https://t.me/mr_yedigaryan"
                    />
                </ThemeProvider>
            </body>
        </html>
    )
}
