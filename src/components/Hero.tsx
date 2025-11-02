'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Hi, I&apos;m <span className="text-blue-600">{personalInfo.name}</span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-gray-700 mb-6">
                            {personalInfo.title} | Angular & React Specialist
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {personalInfo.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mb-8">
                            <a href={personalInfo.linkedin}
                               className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                               aria-label="LinkedIn">
                                <FaLinkedin className="text-2xl" />
                            </a>
                            <a href={personalInfo.github}
                               className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
                               aria-label="GitHub">
                                <FaGithub className="text-2xl" />
                            </a>
                            <a href={`mailto:${personalInfo.email}`}
                               className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                               aria-label="Email">
                                <FaEnvelope className="text-2xl" />
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/projects"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                View My Work
                            </Link>
                            <a
                                href="/resume.pdf"
                                download
                                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                            >
                                Download Resume
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-full h-96 md:h-[500px]">
                            <Image
                                src="/images/workspace.jpeg"
                                alt="Developer workspace"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
