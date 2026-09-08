export const site = {
  name: 'BreezePocket',
  legalName: 'BreezePocket',
  /** Canonical origin; set PUBLIC_SITE_URL to point at a custom domain. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://breezepocket.pages.dev',
  description: 'Get paid while waiting for the crypto price you want.',
  keywords: 'crypto yield, Solana, earn while holding, price targets, SOL, BTC, ETH, Seeker',
  email: 'hello@breezepocket.com',
  privacyEmail: 'privacy@breezepocket.com',
  year: 2026,
  nav: [
    { label: 'Strategies', href: '/strategies' },
    { label: 'Our Mission', href: '/our-mission' },
  ],
  ctas: {
    apply: { label: 'Join Waitlist', href: '/waitlist' },
    request: { label: 'Get Early Access', href: '/early-access' },
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
    full: { src: '/brand/logo-full.png', width: 806, height: 321 },
    fullWhite: { src: '/brand/logo-full-white.png', width: 806, height: 321 },
    wordmark: { src: '/brand/logo-wordmark.png', width: 806, height: 92 },
    wordmarkWhite: { src: '/brand/logo-wordmark-white.png', width: 806, height: 92 },
    mark: { src: '/brand/logo-mark.png', width: 353, height: 182 },
    markWhite: { src: '/brand/logo-mark-white.png', width: 353, height: 182 },
  },
} as const;

export type NavLink = { label: string; href: string };
