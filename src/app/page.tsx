import Hero from '@/components/Hero'
import ProfileSection from '@/components/home/ProfileSection'
import ProofSection from '@/components/home/ProofSection'
import StackSection from '@/components/home/StackSection'
import TimelineSection from '@/components/home/TimelineSection'
import TeachingSection from '@/components/home/TeachingSection'

/** One numbered page (spec 005 Req 10). Section ids are anchors other specs rely on. */
export default function Home() {
    return (
        <>
            <Hero />
            <ProfileSection />
            <ProofSection />
            <StackSection />
            <TimelineSection />
            <TeachingSection />
        </>
    )
}
