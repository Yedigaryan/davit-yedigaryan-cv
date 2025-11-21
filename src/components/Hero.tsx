'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-hero justify-center transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
              Hi, I&apos;m <span className="text-link">{personalInfo.name}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-foreground mb-6">
              {personalInfo.title} | Angular & React Specialist
            </h2>
            <p className="text-lg text-foreground mb-8 leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              <a href={personalInfo.linkedin}
                className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
                aria-label="LinkedIn">
                <FaLinkedin className="text-2xl text-primary-foreground" />
              </a>
              <a href={personalInfo.github}
                className="p-3 bg-secondary text-secondary-foreground rounded-full hover:opacity-90 transition"
                aria-label="GitHub">
                <FaGithub className="text-2xl" />
              </a>
              <a href={`mailto:${personalInfo.email}`}
                className="p-3 bg-destructive text-destructive-foreground rounded-full hover:opacity-90 transition"
                aria-label="Email">
                <FaEnvelope className="text-2xl" />
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                View My Work
              </Link>
              <a
                href="/resume.pdf"
                download
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-muted transition"
              >
                Download Resume
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src="/images/workspace.jpeg"
                alt="Profile"
                className="rounded-full shadow-xl w-64 h-64 object-cover"
                width="512"
                height="512"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
