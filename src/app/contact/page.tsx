import { Metadata } from 'next'
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import ContactForm from '@/components/ContactForm'
import { personalInfo } from '@/lib/data'

export const metadata: Metadata = {
  title: `Contact | ${personalInfo.name}`,
  description: 'Get in touch for collaboration opportunities and engineering roles.',
}

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">Let&apos;s Connect</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl">
          Always open to engineering roles, collaboration, and interesting systems / backend / cryptography problems.
        </p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-12">
          {/* Direct channels */}
          <aside>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Direct channels</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-4">
                <FaEnvelope className="text-2xl text-primary shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-base sm:text-lg text-foreground hover:text-primary transition-colors break-all"
                >
                  {personalInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaPhone className="text-2xl text-primary shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                  className="text-base sm:text-lg text-foreground hover:text-primary transition-colors"
                >
                  {personalInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaLinkedin className="text-2xl text-primary shrink-0" aria-hidden="true" />
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg text-foreground hover:text-primary transition-colors break-all"
                >
                  {personalInfo.linkedin.replace('https://', '')}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaGithub className="text-2xl text-primary shrink-0" aria-hidden="true" />
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg text-foreground hover:text-primary transition-colors break-all"
                >
                  {personalInfo.github.replace('https://', '')}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-2xl text-primary shrink-0" aria-hidden="true" />
                <span className="text-base sm:text-lg text-foreground">
                  {personalInfo.location} · {personalInfo.locationNote}
                </span>
              </li>
            </ul>

            <div className="rounded-lg bg-muted p-5">
              <h3 className="font-bold mb-2 text-foreground">Available for</h3>
              <ul className="space-y-1.5 text-muted-foreground text-sm">
                <li>• Full-time engineering roles (C++ / C# / full-stack)</li>
                <li>• Freelance and contract work</li>
                <li>• Consulting on systems &amp; performance</li>
                <li>• Technical mentorship</li>
              </ul>
            </div>
          </aside>

          {/* Inbound form */}
          <section
            aria-labelledby="contact-form-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm"
          >
            <h2 id="contact-form-heading" className="text-xl sm:text-2xl font-bold mb-2 text-card-foreground">
              Send a message
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Faster than opening your email client — replies usually within a day.
            </p>
            <ContactForm />
          </section>
        </div>
      </div>
    </div>
  )
}
