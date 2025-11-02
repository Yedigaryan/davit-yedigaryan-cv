import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export const metadata: Metadata = {
  title: `Contact | ${personalInfo.name}`,
  description: 'Get in touch for collaboration opportunities and project inquiries',
}

export default function Contact() {
  return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">Let&apos;s Connect</h1>
        <p className="text-xl text-gray-600 mb-12">
          I&apos;m always open to discussing new projects and opportunities
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-2xl text-blue-600" />
                <a href={`mailto:${personalInfo.email}`} className="text-lg hover:text-blue-600">
                  {personalInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <FaLinkedin className="text-2xl text-blue-600" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-blue-600">
                  {personalInfo.linkedin.replace('https://', '')}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <FaGithub className="text-2xl text-blue-600" />
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-blue-600">
                  {personalInfo.github.replace('https://', '')}
                </a>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Available For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Full-time opportunities</li>
                <li>✓ Freelance projects</li>
                <li>✓ Consulting engagements</li>
                <li>✓ Technical mentorship</li>
              </ul>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
  )
}
