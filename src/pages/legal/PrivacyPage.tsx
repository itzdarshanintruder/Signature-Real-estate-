import LegalPage from '@/pages/legal/LegalPage'

const SECTIONS = [
  {
    heading: 'Information We Collect',
    body: [
      'When you submit an enquiry on this website, we collect your name, phone number, email address (if provided), the nature of your interest and any message you choose to share.',
      'We use this information solely to respond to your enquiry, share project details you have requested, and — with your consent — keep you informed about Signature City developments.',
    ],
  },
  {
    heading: 'How We Use Your Data',
    body: [
      'Your details are used by our sales and customer relationship teams to assist with your enquiry. We do not sell, rent or trade your personal information with any third party.',
      'We may share necessary details with service providers (such as our lead-management and communication tools) strictly to operate this service, subject to confidentiality obligations.',
    ],
  },
  {
    heading: 'Your Choices',
    body: [
      'You may request a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it, at any time by writing to us at the address or email listed in the Contact section.',
      'If you no longer wish to receive communications from us, simply reply "STOP" to any message or contact our team directly.',
    ],
  },
  {
    heading: 'Cookies & Analytics',
    body: [
      'We use minimal cookies and privacy-friendly analytics to understand how visitors use the site and improve their experience. You can control cookies through your browser settings.',
    ],
  },
]

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="August 2026" sections={SECTIONS} />
}
