import RedirectStub, { stubMetadata } from '@/components/RedirectStub'

export const metadata = stubMetadata('/#stack')

export default function Skills() {
    return <RedirectStub to="/#stack" label="Stack" />
}
