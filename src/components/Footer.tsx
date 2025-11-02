import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{personalInfo.name}</h3>
                        <p className="text-gray-300 mb-4">
                            {personalInfo.title} specializing in Angular, React, and .NET
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href={personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={24} />
                            </a>
                            <a
                                href={personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="GitHub"
                            >
                                <FaGithub size={24} />
                            </a>
                            <a
                                href={`mailto:${personalInfo.email}`}
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Email"
                            >
                                <FaEnvelope size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/skills" className="text-gray-300 hover:text-white transition-colors">
                                    Skills
                                </Link>
                            </li>
                            <li>
                                <Link href="/experience" className="text-gray-300 hover:text-white transition-colors">
                                    Experience
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
                        <div className="space-y-2 text-gray-300">
                            <p>{personalInfo.email}</p>
                            <p>Available for opportunities</p>
                            <p>{personalInfo.location}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                    <p>&copy; 2025 {personalInfo.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

