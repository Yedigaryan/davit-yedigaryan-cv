import { Metadata } from 'next'
import Image from 'next/image'
import { FaCode, FaGraduationCap, FaAward, FaHeart } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

export const metadata: Metadata = {
  title: `About | ${personalInfo.name}`,
  description: 'Learn about my background, education, and passion for full-stack development',
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">About Me</h1>
        
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Full Stack Developer</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I&apos;m a passionate full-stack developer with 6+ years of experience building 
              scalable web applications. My journey began with frontend development using 
              Angular and React, and has evolved to include backend development with C# and .NET.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I believe in writing clean, maintainable code and creating user experiences 
              that make a difference. When I&apos;m not coding, you&apos;ll find me exploring new 
              technologies, contributing to open source projects, or mentoring fellow developers.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/images/about-image.png"
              alt="Professional headshot"
              width={400}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <FaGraduationCap className="text-blue-600 mr-3" />
            Education & Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <Image
                  src="/images/universities/paul_sabatier.png"
                  alt="Paul Saboteur University"
                  width={50}
                  height={70}
                  className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">
                Master&apos;s in Computer Science in Aerospace
              </h3>
              <p className="text-gray-600 mb-2">Universit&#0233; Paul Sabatier Toulouse III, 2017</p>
              <p className="text-sm text-gray-500">
                Focusing on computer science fundamentals necessary for Aerospace
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image
                  src="/images/universities/nasra.png"
                  alt="Armenian National Academy of Sciences"
                  width={70}
                  height={70}
                  className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Master&apos;s in Computer Science</h3>
              <p className="text-gray-600 mb-2">
                Armenian National Academy of Sciences, 2017</p>
              <p className="text-sm text-gray-500">
                Focus on software engineering and data analysis
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image
                  src="/images/universities/vinetti.png"
                  alt="Paul Saboteur University"
                  width={50}
                  height={70}
                  className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Certified Frontend developer</h3>
              <p className="text-gray-600 mb-2">Vineti Armenia, 2018</p>
              <p className="text-sm text-gray-500">
                Focus on web development and Quality Assurance
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image
                  src="/images/universities/synopsys.png"
                  alt="Vineti Armenia"
                  width={90}
                  height={70}
                  className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Bachelor&apos;s in Computer Science</h3>
              <p className="text-gray-600 mb-2">SYNOPSYS EDA, 2013</p>
              <p className="text-sm text-gray-500">
                Focus on hardware engineering and embedded systems
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Image
                  src="/images/universities/polytechnic.png"
                  alt="State Engineering University of Armenia"
                  width={110}
                  height={70}
                  className="rounded-lg shadow-lg mb-4 bg-black"
              />
              <h3 className="text-xl font-bold mb-2">Bachelor&apos;s in Computer Science</h3>
              <p className="text-gray-600 mb-2">State Engineering University of Armenia, 2013</p>
              <p className="text-sm text-gray-500">
                Overall focus on computer science principles and practices, Object-Oriented Programming
              </p>
            </div>
          </div>
        </div>

        {/* Values & Approach */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <FaHeart className="text-red-500 mr-3" />
            My Approach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCode className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Clean Code</h3>
              <p className="text-gray-600">
                Writing maintainable, well-documented code that stands the test of time
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-gray-600">
                Delivering high-quality solutions that exceed expectations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Continuous Learning</h3>
              <p className="text-gray-600">
                Always staying current with the latest technologies and best practices
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Fun Facts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">When I&apos;m not coding:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Researching new tech</li>
                <li>• Reading tech blogs and books</li>
                <li>• Contributing to open source projects</li>
                <li>• Teaching others to code</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Current interests:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Machine Learning and AI</li>
                <li>• Cloud Architecture</li>
                <li>• DevOps practices</li>
                <li>• Researching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
