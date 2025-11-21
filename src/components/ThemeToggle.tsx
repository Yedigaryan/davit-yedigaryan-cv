'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa'

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder
    }

    return (
        <div className="flex items-center bg-muted/20 border border-border rounded-lg p-1">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="Light mode"
                title="Light mode"
            >
                <FaSun size={16} />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md transition-all ${theme === 'system'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="System preference"
                title="System preference"
            >
                <FaDesktop size={16} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="Dark mode"
                title="Dark mode"
            >
                <FaMoon size={16} />
            </button>
        </div>
    )
}
