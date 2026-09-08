/** Copy for the Our Mission page. */

export const missionHero = {
  title: 'Waiting should get paid.',
  text:
    'Most crypto holders are already waiting: for a price to sell at, a dip to buy, or simply for the long run to play out. BreezePocket turns that waiting into income, on Solana, without asking you to become a trader.',
  image: { src: '/img/mission-hero.svg', alt: 'Soft gradient waves suggesting a calm breeze', width: 3008, height: 1600 },
};

export const missionSubSection = {
  title: 'The real cost of idle crypto',
  body:
    'Coins sitting in a wallet do nothing while you wait for the price you want. The usual answers are active trading, DeFi strategies, or options and derivatives, all of which are hard to understand and need constant attention. Most people do not want a second job. They want something simple: name a price, get paid, and get on with their day. That is exactly what BreezePocket does.',
};

export interface DrawerBullet {
  title: string;
  text: string;
}

export const problem = {
  number: '01',
  title: 'The Problem',
  image: { src: '/img/mission-problem.svg', alt: 'Illustration of idle coins resting in a wallet', width: 400, height: 400 },
  subtitle: 'Idle assets, complicated tools, and no time to manage them.',
  description:
    'Crypto holders are stuck between two poor options: leave coins idle, or take on strategies built for professionals. Here is what we keep hearing:',
  bullets: [
    {
      title: 'Idle assets',
      text: 'Most people hold SOL, BTC or ETH and simply wait. The coins sit there earning nothing while the market decides what to do next.',
    },
    {
      title: 'Too much complexity',
      text: 'Active trading, DeFi strategies, options and derivatives all promise income, but they are difficult to understand and easy to get wrong.',
    },
    {
      title: 'Constant management',
      text: 'Even when a strategy works, it needs watching. Positions, rolls, expiries and rebalances turn a simple idea into a daily chore.',
    },
  ] satisfies DrawerBullet[],
};

export const engine = {
  number: '02',
  title: 'The BreezePocket Engine',
  image: { src: '/img/mission-engine.svg', alt: 'Illustration of a price target with income paid upfront', width: 400, height: 400 },
  subtitle: 'Name a price. Get paid. That is it.',
  body: [
    'BreezePocket takes the strategies professionals use to earn on assets they already hold and hides all of the machinery. You tell us the price you’d happily sell or buy at and a date; we handle the options mechanics on-chain.',
    'Your income arrives upfront. Your trade fills only at your price. Your funds never leave your wallet or the contracts you can see. Three things make it work:',
  ],
  features: [
    { title: 'Name your price', text: 'Pick the price you’d be happy to sell or buy at, and the date you are willing to wait until.' },
    { title: 'Get paid upfront', text: 'Income lands the moment your target is set, and it is yours whatever the market does next.' },
    { title: 'Filled only on your terms', text: 'If the market reaches your price, the trade executes at that price. If not, you keep your coins and go again.' },
  ] satisfies DrawerBullet[],
};

export const outcome = {
  number: '03',
  title: 'The Outcome',
  image: { src: '/img/mission-outcome.svg', alt: 'Illustration of a balance growing over time', width: 400, height: 400 },
  subtitle: 'Simple income for everyday holders',
  lead: 'With BreezePocket, your waiting finally works for you.',
  items: [
    {
      number: '01',
      title: 'Earn while holding',
      text: 'Keep your BTC, ETH or SOL and earn additional income on top, without selling and without watching charts.',
    },
    {
      number: '02',
      title: 'Earn while waiting',
      text: 'Name the price you’d sell or buy at and get paid while the market makes up its mind. Filled at your price, or free to go again.',
    },
    {
      number: '03',
      title: 'Accumulate on your terms',
      text: 'Prefer more coins to more cash? Auto-accumulate rolls your targets to build a position at prices you chose.',
    },
  ],
};

export const missionBridge = {
  lines: ['Waiting is the one thing ', 'every crypto holder does. ', 'Now it pays.'],
  text: 'BreezePocket is non-custodial, built on Solana, and coming to Seeker. Set a price, get paid, and let the market come to you.',
  ctas: [
    { label: 'Join Waitlist', href: '/waitlist', variant: 'glass' },
    { label: 'Get Early Access', href: '/early-access', variant: 'dark' },
  ] as const,
};
