/** Copy for the Waitlist page and the waitlist modal. */

export interface WaitlistSection {
  title: string;
  text: string;
  image: { src: string; alt: string; width: number; height: number };
}

export const waitlistHero = {
  title: 'Be first when<br/>the breeze arrives.',
  text: 'BreezePocket is launching soon on Solana, with Seeker right after. Join the waitlist and we will let you know the moment your spot opens.',
  cta: 'Join the Waitlist',
} as const;

export const waitlistSections: readonly WaitlistSection[] = [
  {
    title: 'Set a price. Get paid.',
    text: 'Deposit SOL, BTC, ETH or stablecoins, name the price you’d happily sell or buy at, and pick a date. Income lands upfront. If the market reaches your price, the trade fills at your number; if not, you keep your coins and the income and set a new target.',
    image: { src: '/img/waitlist-price.svg', alt: 'Illustration of a price target with income paid upfront', width: 1600, height: 1000 },
  },
  {
    title: 'Built for holders, not traders.',
    text: 'No charts, no jargon, no positions to babysit. BreezePocket takes the strategies professionals use to earn on assets they already hold and turns them into a single question: what price would make you happy? Everything else is handled for you.',
    image: { src: '/img/waitlist-holders.svg', alt: 'Illustration of a relaxed holder with coins at rest', width: 1600, height: 1000 },
  },
  {
    title: 'Solana first. Seeker next.',
    text: 'BreezePocket runs on Solana for fast, low-cost settlement and stays non-custodial: your funds live in your wallet and in on-chain contracts you can see. We are launching on Solana first and shipping on Seeker, the Solana mobile phone, right after.',
    image: { src: '/img/waitlist-seeker.svg', alt: 'Illustration of the BreezePocket app on a Seeker phone', width: 1600, height: 1000 },
  },
];

export const waitlistCta = {
  lines: ['Get on the list'],
  subtitle: 'Tell us what you hold and what you’d like to earn on. We open spots in order and email you when yours is ready.',
  label: 'Join the Waitlist',
} as const;

export const assetOptions = [
  { value: 'sol', label: 'SOL' },
  { value: 'btc', label: 'BTC' },
  { value: 'eth', label: 'ETH' },
  { value: 'stables', label: 'Stablecoins (USDC/USDT)' },
  { value: 'other', label: 'Other' },
] as const;

export const experienceOptions = [
  { value: 'new', label: 'New to crypto' },
  { value: 'holder', label: 'Long-term holder' },
  { value: 'defi', label: 'DeFi user' },
  { value: 'trader', label: 'Active trader' },
] as const;

export const waitlistModal = {
  steps: {
    details: 'Your details',
    assets: 'What do you hold?',
    experience: 'How would you describe yourself?',
    wallet: 'Your wallet',
    review: 'Review your details',
  },
  errors: {
    fullName: 'Please enter your full name',
    email: 'Please enter a valid email address',
    assets: 'Please select at least one asset',
    experience: 'Please tell us how you’d describe yourself',
    wallet: 'That doesn’t look like a Solana wallet address',
    submit: 'Something went wrong. Please try again.',
  },
  disclaimer:
    'By joining the waitlist you agree that BreezePocket may use the details you provide to manage the waitlist and contact you about early access. Your information is never sold or shared for advertising. See our ',
  disclaimerDetails:
    'Information collected: name, email, Telegram or X handle, the assets you hold, how you describe yourself, and an optional Solana wallet address. Submissions reach our team through an email provider and are kept for up to 24 months. Your progress in this form is stored in your browser until you submit.',
  success: {
    title: 'Thanks, {name}. You’re on the list.',
    body: 'We’ll email you when your spot opens. Solana first, Seeker right after.',
    home: 'Return to Home',
  },
} as const;
