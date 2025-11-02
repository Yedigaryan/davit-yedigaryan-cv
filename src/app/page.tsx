import Hero from '@/components/Hero'
import { FaAngular, FaReact } from 'react-icons/fa'
import { SiDotnet } from 'react-icons/si'
import Link from 'next/link'

export default function Home() {
    return (
        <>
            <Hero />

            {/* Quick Skills Overview */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Core Expertise</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <FaAngular className="text-6xl text-red-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Angular Expert</h3>
                            <p className="text-gray-600">6+ years building enterprise applications</p>
                        </div>
                        <div className="text-center p-6">
                            <FaReact className="text-6xl text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">React Specialist</h3>
                            <p className="text-gray-600">Modern component architecture & hooks</p>
                        </div>
                        <div className="text-center p-6">
                            <SiDotnet className="text-6xl text-purple-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Full Stack</h3>
                            <p className="text-gray-600">C# and .NET backend development</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Let&apos;s discuss how my expertise can benefit your next project
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Get In Touch
                    </Link>
                </div>
            </section>
        </>
    )
}
