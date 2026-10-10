import { personalInfo } from '@/lib/data'
import HomeSection from './HomeSection'

/** #profile (spec 005 Req 13). Fully opaque; the scroll reveal is spec 007. */
export default function ProfileSection() {
    return (
        <HomeSection id="profile" label="01 / Profile" title="The short version.">
            <p className="max-w-[68ch] font-serif text-[length:var(--fs-d5)] leading-[1.55] text-primary">{personalInfo.bio}</p>
        </HomeSection>
    )
}
