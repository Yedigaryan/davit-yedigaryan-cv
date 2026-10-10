import Hero from '@/components/Hero'
import ProfileSection from '@/components/home/ProfileSection'

/** One numbered page (spec 005 Req 10). Section ids are anchors other specs rely on. */
export default function Home() {
    return (
        <>
            <Hero />
            <ProfileSection />
        </>
    )
}
