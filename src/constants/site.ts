export const SITE = {
  name: 'Signature City',
  tagline: 'Premium DTCP Approved Residential Plots',
  shortTagline: 'DTCP Approved Residential Plots',
  phone: '+91 90479 53000',
  phoneHref: 'tel:+919047953000',
  whatsapp: '919047953000',
  email: 'dtcpplotsale@gmail.com',
  address: ['Signature City, Near Sulur', 'Coimbatore, Tamil Nadu 641402'],
  hours: 'Mon – Sun · 9:30 AM – 7:30 PM',
  mapUrl: 'https://maps.google.com/?q=Signature+City+Sulur+Coimbatore',
  socials: {
    instagram: '#',
    facebook: '#',
    youtube: '#',
    linkedin: '#',
  },
} as const

export const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
] as const
