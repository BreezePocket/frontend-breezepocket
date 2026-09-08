/** Copy and image metadata for the Strategies page. */
export interface Strategy {
  id: 'hold' | 'sell' | 'buy' | 'accumulate';
  navLabel: string;
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Short benefit phrases rendered as the card list. */
  services: readonly string[];
}

export const strategiesPage = {
  hero: {
    title: 'Four ways to get paid<br/>while you wait',
    text: 'Whether you are holding, waiting to sell, waiting to buy, or building a position, there is a BreezePocket strategy that pays you for your patience.',
  },
  sectionTitle: 'Our Strategies',
  heroImage: {
    src: '/img/strategies-hero.svg',
    alt: 'Abstract flowing lines representing a price moving toward a target',
    width: 2688,
    height: 1536,
  },
  cta: {
    lines: ['Pick a price. ', 'Get paid while the market gets there.'],
    href: '/waitlist',
    label: 'Join Waitlist',
  },
} as const;

export const strategies: readonly Strategy[] = [
  {
    id: 'hold',
    navLabel: 'Earn while holding',
    title: 'Earn extra income on the coins you already hold',
    image: { src: '/img/strategy-hold.svg', alt: 'Illustration of coins earning income while they are held', width: 1600, height: 1000 },
    services: [
      'Deposit SOL, BTC or ETH',
      'Income paid upfront',
      'No need to sell',
      'Set a target well above today’s price',
      'Keep your coins if the price isn’t hit',
      'Set it and forget it',
      'Non-custodial',
      'Runs on Solana',
      'Cancel anytime before the date',
    ],
  },
  {
    id: 'sell',
    navLabel: 'Waiting to sell',
    title: '“I’d happily sell my SOL at $250.” Get paid while you wait for it',
    image: { src: '/img/strategy-sell.svg', alt: 'Illustration of a sell target above the current price', width: 1600, height: 1000 },
    services: [
      'Choose your sell price',
      'Pick a date',
      'Income paid the moment you set it',
      'Filled at your price if the market gets there',
      'Keep your coins and the income if it doesn’t',
      'Sell into stablecoins automatically',
      'Set a new target anytime',
      'Non-custodial',
      'Runs on Solana',
    ],
  },
  {
    id: 'buy',
    navLabel: 'Waiting to buy',
    title: '“I’d happily buy ETH at $2,500.” Put your cash to work while you wait',
    image: { src: '/img/strategy-buy.svg', alt: 'Illustration of a buy target below the current price', width: 1600, height: 1000 },
    services: [
      'Deposit USDC or other stablecoins',
      'Choose your buy price',
      'Pick a date',
      'Income paid upfront',
      'Buy at your price if the market dips to it',
      'Keep your cash and the income if it doesn’t',
      'No limit orders to babysit',
      'Non-custodial',
      'Runs on Solana',
    ],
  },
  {
    id: 'accumulate',
    navLabel: 'Auto-accumulate',
    title: 'Build a bigger position, one favourable price at a time',
    image: { src: '/img/strategy-accumulate.svg', alt: 'Illustration of a balance growing step by step', width: 1600, height: 1000 },
    services: [
      'Skip the income, stack the asset',
      'Targets roll automatically',
      'Accumulate at prices you set',
      'Works with SOL, BTC and ETH',
      'Nothing to manage day to day',
      'Switch back to income anytime',
      'Full history on-chain',
      'Non-custodial',
      'Runs on Solana',
    ],
  },
];
