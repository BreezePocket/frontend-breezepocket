/** Copy for the home page. */

export interface HeroCopy {
  /** Two lines of the h1 (the first keeps its trailing space so the lines read as one sentence). */
  title: readonly [string, string];
  /** Two spans of the subtitle; a `<br class="sp">` follows the first one. */
  subtitle: readonly [string, string];
  scrollLabel: string;
}

export interface FlowStep {
  number: string;
  title: string;
  /** HTML allowed (a `<br>` after the first sentence on step one). */
  description: string;
}

export interface FeatureItem {
  icon: string;
  iconAlt: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StandardsCopy {
  title: readonly string[];
  description: string;
  cta: { label: string; href: string };
}

export const hero: HeroCopy = {
  title: ['Get paid while waiting ', 'for the price you want.'],
  subtitle: [
    'The price you want, on your terms.',
    'Deposit SOL, USDC, TESLA, name a price you’d happily sell or buy at and earn upfront yield once you set your target.',
  ],
  scrollLabel: 'scroll to see how it works',
};

export const flowSteps: readonly FlowStep[] = [
  {
    number: '01',
    title: 'Pick your asset',
    description:
      'Deposit SOL, mSOL, TESLA or USDC straight from your wallet.<br> Nothing leaves your control. Your funds sit in on-chain escrow contracts. Connect, choose, and you are ready in a minute.',
  },
  {
    number: '02',
    title: 'Name your price',
    description:
      'Choose the price you’d happily sell at, or the price you’d happily buy at, and pick a date. That is the whole setup. No charts to watch, no positions to manage, no jargon to learn.',
  },
  {
    number: '03',
    title: 'Get paid while you wait',
    description:
      'Yield lands upfront, the moment your target is set. Earn your crypto or stocks yield without any hustle or babysitting.',
  },
  {
    number: '04',
    title: 'Filled or free to go again',
    description:
      'If the market reaches your price by your date, the trade executes at exactly that price. You get the upfront yield and token at the price you set. If it doesn’t, you keep your coins and the income, and you can set a new target right away.',
  },
];

/** HTML: the `<br class="pc">` only breaks on desktop. */
export const featuresTitle = 'Designed for holders,<br class="pc"> not for full-time traders.';

export const features: readonly FeatureItem[] = [
  {
    icon: '/icons/features/earn-holding.svg',
    iconAlt: 'Earn While Holding icon',
    title: 'Earn While Holding',
    description:
      'Deposit BTC, ETH or SOL and earn additional income without selling. Your coins keep working while you keep holding, with no trading and nothing to babysit.',
  },
  {
    icon: '/icons/features/earn-sell.svg',
    iconAlt: 'Earn While Waiting to Sell icon',
    title: 'Earn While Waiting to Sell',
    description:
      '“I’d happily sell my SOL at $250.” Set that price and get paid while you wait for it. If the market gets there, you sell at your number and keep the yield. If it doesn’t, you keep your SOL and the income.',
  },
  {
    icon: '/icons/features/earn-buy.svg',
    iconAlt: 'Earn While Waiting to Buy icon',
    title: 'Earn While Waiting to Buy',
    description:
      '“I’d happily buy ETH at $2,500.” Put your stablecoins to work while you wait for that price. If ETH gets there, you buy at your number and keep the yield. If not, you keep your cash and the income.',
  },
  {
    icon: '/icons/features/auto-accumulate.svg',
    iconAlt: 'Auto-Accumulate Crypto icon',
    title: 'Auto-Accumulate Crypto',
    description:
      'Rather than taking income, let BreezePocket roll your targets and accumulate more of an asset at prices you set. A patient, hands-off way to build a position over time.',
  },
];

export const standards: StandardsCopy = {
  title: ['Built on Solana. ', 'Coming to ', 'Seeker.'],
  description:
    'BreezePocket runs on Solana for fast, low-cost settlement and will ship on Seeker, the Solana mobile phone, so setting a price target is as easy as checking your balance.',
  cta: { label: 'Explore strategies', href: '/strategies' },
};

export const faqTitle = 'How BreezePocket works, and what to expect.';

export const faq: readonly FaqItem[] = [
  {
    question: 'How do I get paid while waiting?',
    answer:
      'You deposit an asset, name the price you’d happily sell or buy at, and pick a date. In return you receive income upfront, paid the moment your target is set. Behind the scenes this is a covered-call or cash-secured-put style position, handled for you, so you never touch an options interface. You just name a price and get paid while you wait.',
  },
  {
    question: 'What happens when the price hits my target?',
    answer:
      'If the market reaches your price on or before your date, your trade fills at that price: you sell your asset for stablecoins, or buy the asset with your stablecoins. You keep the income either way. If the price never gets there, nothing changes. Your deposit stays yours, the income stays yours, and you can set a new target whenever you like.',
  },
  {
    question: 'What are the risks?',
    answer:
      'If the price crosses your target, you sell or buy at that price and miss any further move beyond it. Crypto prices are volatile, and the value of what you hold can fall while you wait. Like any on-chain product, BreezePocket carries smart-contract and market risk, and income is never guaranteed. Nothing on this site is financial advice, so only deposit what you are comfortable holding.',
  },
  {
    question: 'Which assets and wallets are supported?',
    answer:
      'SOL, BTC, ETH and USDC to start, with more assets over time. BreezePocket works with Solana wallets such as Phantom and Solflare, and with Seeker’s built-in wallet once we ship on the phone. It is non-custodial: your funds stay in your wallet and in on-chain contracts, never in an account we hold.',
  },
];

export const cta = {
  lines: ['Stop waiting for free. ', 'Get paid while you wait.'] as const,
  href: '/waitlist',
  label: 'Join Waitlist',
};
