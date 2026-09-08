export const site = {
  name: 'Vectr',
  legalName: 'Vectr, Inc.',
  url: 'https://www.vectrfl.com',
  description: 'AI driven precision staffing for critical outages',
  keywords: 'staffing, AI, workforce, outage response',
  email: 'hello@vectrfl.com',
  privacyEmail: 'privacy@vectrfl.com',
  address: {
    street: '480 N Orlando Ave, Suite 236',
    city: 'Winter Park',
    region: 'FL',
    postal: '32789',
    country: 'US',
    oneLine: '480 N Orlando Ave, Suite 236, Winter Park, FL 32789, United States',
  },
  year: 2026,
  nav: [
    { label: 'Our Industries', href: '/industries' },
    { label: 'Our Mission', href: '/our-mission' },
  ],
  ctas: {
    apply: { label: 'Apply', href: '/apply' },
    request: { label: 'Request Crews', href: '/request-crew' },
  },
  footerNav: [
    { label: 'Our Industries', href: '/industries' },
    { label: 'Our Mission', href: '/our-mission' },
    { label: 'Apply', href: '/apply' },
  ],
  footerLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'ToS', href: '/terms' },
  ],
  credit: { label: 'Made by Utsubo', href: 'https://utsubo.com' },
} as const;

export type NavLink = { label: string; href: string };
