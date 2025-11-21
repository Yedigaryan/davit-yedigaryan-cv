import Hero from '@/components/Hero'
import { FaAngular, FaReact } from 'react-icons/fa'
import { SiDotnet } from 'react-icons/si'
import Link from 'next/link'

export default function Home() {
    return (
        <>
            <Hero />

            {/* Quick Skills Overview */}
            <section className="py-20 bg-muted/30 transition-colors duration-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Core Expertise</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-card rounded-lg transition-colors shadow-sm">
                            <FaAngular className="text-6xl text-red-600 dark:text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2 text-card-foreground">Angular Expert</h3>
                            <p className="text-muted-foreground">6+ years building enterprise applications</p>
                        </div>
                        <div className="text-center p-6 bg-card rounded-lg transition-colors shadow-sm">
                            <FaReact className="text-6xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2 text-card-foreground">React Specialist</h3>
                            <p className="text-muted-foreground">Modern component architecture & hooks</p>
                        </div>
                        <div className="text-center p-6 bg-card rounded-lg transition-colors shadow-sm">
                            <SiDotnet className="text-6xl text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2 text-card-foreground">Full Stack</h3>
                            <p className="text-muted-foreground">C# and .NET backend development</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-background transition-colors duration-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Work Together?</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Let&apos;s discuss how my expertise can benefit your next project
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition"
                    >
                        Get In Touch
                    </Link>
                </div>
            </section>
        </>
    )
}
