import RedirectStub, { stubMetadata } from '@/components/RedirectStub'

export const metadata = stubMetadata('/#profile')

export default function About() {
    return <RedirectStub to="/#profile" label="Profile" />
}
