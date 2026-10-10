import RedirectStub, { stubMetadata } from '@/components/RedirectStub'

export const metadata = stubMetadata('/#contact')

export default function Contact() {
    return <RedirectStub to="/#contact" label="Contact" />
}
