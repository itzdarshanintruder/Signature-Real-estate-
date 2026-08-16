import LegalPage from '@/pages/legal/LegalPage'

const SECTIONS = [
  {
    heading: 'Informational Purposes Only',
    body: [
      'The content of this website, including project descriptions, prices, plot sizes and imagery, is provided for general information only and does not constitute an offer, contract or legal commitment.',
      'Prices and availability are indicative and subject to change without notice. Please verify all details with our sales team before making any decision.',
    ],
  },
  {
    heading: 'Intellectual Property',
    body: [
      'All content on this site — text, layout, design, graphics and branding — is the property of Signature City and its group companies and may not be reproduced without written permission.',
    ],
  },
  {
    heading: 'RERA & Approval Status',
    body: [
      'Signature City is a DTCP approved residential layout. Project approvals and registration details can be verified at our site office. Nothing on this website should be read as a guarantee of future appreciation or returns.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'While we take care to keep the information on this website accurate and current, we make no representations or warranties of any kind regarding its completeness or accuracy and accept no liability for reliance placed on it.',
    ],
  },
]

export default function TermsPage() {
  return <LegalPage title="Terms of Use" updated="August 2026" sections={SECTIONS} />
}
