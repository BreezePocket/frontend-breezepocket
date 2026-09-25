export const site = {
  name: 'PAYtience',
  legalName: 'PAYtience',
  /** Canonical origin; set PUBLIC_SITE_URL to point at a custom domain. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://paytience.app',
  description: 'Get paid while waiting for the crypto price you want.',
  keywords: 'crypto yield, Solana, earn while holding, price targets, SOL, BTC, ETH, Seeker',
  email: 'hello@paytience.app',
  privacyEmail: 'privacy@paytience.app',
  year: 2026,
  nav: [
    { label: 'Strategies', href: '/strategies' },
    { label: 'Our Mission', href: '/our-mission' },
  ],
  ctas: {
    apply: { label: 'Join Waitlist', href: '/waitlist' },
    /** Points at the live prototype app, not a page on this site. */
    request: { label: 'View Early Prototype', href: 'https://app.paytience.app/' },
  },
  footerNav: [
    { label: 'Strategies', href: '/strategies' },
    { label: 'Our Mission', href: '/our-mission' },
    { label: 'Join Waitlist', href: '/waitlist' },
  ],
  footerLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'ToS', href: '/terms' },
  ],
  credit: { label: 'Built on Solana', href: 'https://solana.com' },
  /** Logo bitmaps live in public/brand (generated from the master PNG). */
  logo: {
    full: { src: '/brand/logo-full.png', width: 1214, height: 300 },
    fullWhite: { src: '/brand/logo-full-white.png', width: 1214, height: 300 },
    wordmark: { src: '/brand/logo-wordmark.png', width: 878, height: 146 },
    wordmarkWhite: { src: '/brand/logo-wordmark-white.png', width: 878, height: 146 },
    mark: { src: '/brand/logo-mark.png', width: 456, height: 518 },
    markWhite: { src: '/brand/logo-mark-white.png', width: 456, height: 518 },
  },
} as const;

export type NavLink = { label: string; href: string };
