import { Metadata } from 'next'
import { FaAward, FaCode, FaGraduationCap, FaHeart } from 'react-icons/fa'
import { personalInfo, studies } from '@/lib/data'

export const metadata: Metadata = {
    title: `About | ${personalInfo.name}`,
    description: 'Learn about my background, education, and passion for full-stack development',
}

export default function About() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-8 text-foreground">About Me</h1>

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-foreground">Full Stack Developer</h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            I&apos;m a passionate full-stack developer with 6+ years of experience building
                            scalable web applications. My journey began with frontend development using
                            Angular and React, and has evolved to include backend development with C# and .NET.
                        </p>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            I believe in writing clean, maintainable code and creating user experiences
                            that make a difference. When I&apos;m not coding, you&apos;ll find me exploring new
                            technologies, contributing to open source projects, or mentoring fellow developers.
                        </p>
                    </div>
                    <div className="relative">
                        <img
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
                    <h2 className="text-3xl font-bold mb-8 flex items-center text-foreground">
                        <FaGraduationCap className="text-blue-600 dark:text-blue-400 mr-3 transition-colors" />
                        Education & Certifications
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {studies.map((stud, index) => (
                            <div key={index} className="border border-border p-6 rounded-lg shadow bg-card transition-colors">
                                <img
                                    src={stud.logo}
                                    alt={stud.university}
                                    width={stud.width ?? 50}
                                    height="70"
                                    className={`rounded-lg shadow-lg mb-4` + stud.bgBlack}
                                />
                                <h3 className="text-xl font-bold mb-2 text-card-foreground">
                                    {stud.university}
                                </h3>
                                <p className="text-muted-foreground mb-2">{stud.studyFieldAndDegree}</p>
                                <p className="text-sm text-muted-foreground">
                                    {stud.description}
                                </p>
                            </div>))}
                    </div>
                </div>

                {/* Values & Approach */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center text-foreground">
                        <FaHeart className="text-red-500 dark:text-red-400 mr-3 transition-colors" />
                        My Approach
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div
                                className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                <FaCode className="text-2xl text-blue-600 dark:text-blue-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">Clean Code</h3>
                            <p className="text-muted-foreground">
                                Writing maintainable, well-documented code that stands the test of time
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                <FaAward className="text-2xl text-green-600 dark:text-green-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">Quality First</h3>
                            <p className="text-muted-foreground">
                                Delivering high-quality solutions that exceed expectations
                            </p>
                        </div>
                        <div className="text-center">
                            <div
                                className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                <FaGraduationCap className="text-2xl text-purple-600 dark:text-purple-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">Continuous Learning</h3>
                            <p className="text-muted-foreground">
                                Always staying current with the latest technologies and best practices
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fun Facts */}
                <div className="bg-muted/30 p-8 rounded-lg transition-colors">
                    <h2 className="text-3xl font-bold mb-6 text-foreground">Fun Facts</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold mb-2 text-foreground">When I&apos;m not coding:</h3>
                            <ul className="text-muted-foreground space-y-1">
                                <li>• Researching new tech</li>
                                <li>• Reading tech blogs and books</li>
                                <li>• Contributing to open source projects</li>
                                <li>• Teaching others to code</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2 text-foreground">Current interests:</h3>
                            <ul className="text-muted-foreground space-y-1">
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
