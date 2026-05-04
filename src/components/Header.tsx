'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/skills', label: 'Skills' },
        { href: '/experience', label: 'Experience' },
        { href: '/projects', label: 'Projects' },
        { href: '/contact', label: 'Contact' }
    ];

    return (
        <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors duration-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-primary transition-colors">
                        {personalInfo.name}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'} transition-colors font-medium`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Theme Toggle and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <ThemeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden text-muted-foreground hover:text-primary transition-colors"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-nav"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav id="mobile-nav" className="md:hidden py-4 border-t border-border transition-colors duration-200">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`${pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'} transition-colors font-medium py-2`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
