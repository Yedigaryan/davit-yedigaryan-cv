import { Metadata } from 'next'
// import ContactForm from '@/components/ContactForm'
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export const metadata: Metadata = {
  title: `Contact | ${personalInfo.name}`,
  description: 'Get in touch for collaboration opportunities and project inquiries',
}

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-4 text-foreground">Let&apos;s Connect</h1>
      <p className="text-xl text-muted-foreground mb-12">
        I&apos;m always open to discussing new projects and opportunities
      </p>

      <div className="fllex justify-center ">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Get In Touch</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-primary" />
              <a href={`mailto:${personalInfo.email}`} className="text-lg hover:text-primary text-foreground transition-colors">
                {personalInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <FaLinkedin className="text-2xl text-primary" />
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary text-foreground transition-colors">
                {personalInfo.linkedin.replace('https://', '')}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <FaGithub className="text-2xl text-primary" />
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary text-foreground transition-colors">
                {personalInfo.github.replace('https://', '')}
              </a>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg transition-colors">
            <h3 className="font-bold mb-2 text-foreground">Available For:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Full-time opportunities</li>
              <li>✓ Freelance projects</li>
              <li>✓ Consulting engagements</li>
              <li>✓ Technical mentorship</li>
            </ul>
          </div>

          <div className="flex gap-4 mt-8">
            <a href={`mailto:${personalInfo.email}`} className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 px-6 rounded-lg text-center transition">
              <FaEnvelope className="inline mr-2" />
              Email Me
            </a>
            <a href={`tel:${personalInfo.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition">
              <FaPhone className="inline mr-2" />
              Call Me
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
