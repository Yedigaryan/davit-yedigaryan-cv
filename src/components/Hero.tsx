'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-hero transition-colors duration-200"
    >
      {/* Dark overlay restores AA contrast on the gradient background. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"
      />

      <div className="container relative mx-auto px-4 py-16">
        <div className="grid md:grid-cols-[3fr_2fr] gap-10 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="inline-flex items-center gap-2 mb-4 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <FaMapMarkerAlt aria-hidden="true" /> {personalInfo.location}
            </p>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-white drop-shadow-sm"
            >
              Hi, I&apos;m <span className="text-sky-300">{personalInfo.name}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-semibold">
              {personalInfo.title} <span className="text-white/60">|</span> {personalInfo.tagline}
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
              {personalInfo.shortBio}
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/95 text-slate-900 rounded-full hover:bg-white transition shadow-sm focus:outline-none focus:ring-4 focus:ring-white/40"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin className="text-2xl" />
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/95 text-slate-900 rounded-full hover:bg-white transition shadow-sm focus:outline-none focus:ring-4 focus:ring-white/40"
                aria-label="GitHub profile"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="p-3 bg-white/95 text-slate-900 rounded-full hover:bg-white transition shadow-sm focus:outline-none focus:ring-4 focus:ring-white/40"
                aria-label="Send email"
              >
                <FaEnvelope className="text-2xl" />
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/40"
              >
                View My Work
              </Link>
              <a
                href="/resume.pdf"
                download
                className="px-6 sm:px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                Download Resume
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-400/40 to-fuchsia-500/30 blur-2xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about-image.png"
                alt={`Portrait of ${personalInfo.name}`}
                className="relative rounded-full shadow-2xl w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 object-cover ring-4 ring-white/30"
                width={512}
                height={512}
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
