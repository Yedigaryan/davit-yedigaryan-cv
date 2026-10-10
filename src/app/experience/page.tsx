import RedirectStub, { stubMetadata } from '@/components/RedirectStub'

export const metadata = stubMetadata('/#timeline')

export default function Experience() {
    return <RedirectStub to="/#timeline" label="Timeline" />
}
