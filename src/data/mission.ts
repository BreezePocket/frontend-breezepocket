/** Copy for the Our Mission page. Headings match the reference; paragraph copy is original. */

export const missionHero = {
  title: 'Operational Velocity',
  text:
    'Each day a piece of critical infrastructure stands idle or short-handed, it quietly bleeds capital. Vectr shortens conventional workforce mobilization timelines by 70%, placing certified, specialized technical crews on Nuclear, Gas, and Data Center projects before a delay ever reaches your bottom line.',
  image: { src: '/img/mission-hero.webp', alt: 'Abstract blue dynamic motion graphic', width: 3008, height: 1600 },
};

export const missionSubSection = {
  title: 'The Real Cost of an Empty Job Site',
  body:
    'A stalled specialized project is never just an unfilled seat. It is a financial leak that compounds by the hour: every hour spent waiting on specialized people eats budget, slips your commercial operation date, and puts your ROI at risk. We never sit back and wait for talent to show up, and we never bury your desk under piles of unscreened resumes. We treat every open slot as a critical operational bottleneck that calls for immediate, precise resolution.',
};

export interface DrawerBullet {
  title: string;
  text: string;
}

export const friction = {
  number: '01',
  title: 'The Friction',
  image: { src: '/img/middleman.webp', alt: 'Silhouette of person walking through industrial corridor', width: 400, height: 400 },
  subtitle: 'The Hidden Cost of "The Middleman": a systemic inefficiency.',
  description:
    'It drags high-velocity industries—Nuclear, Gas, Data Centers—down to the pace of paperwork and inboxes. For decades the sector has tolerated a broken model. The usual way of mobilizing workforce resources is built on wasted motion:',
  bullets: [
    {
      title: 'Zero "Rolodex" Guesswork',
      text: 'Conventional agencies lean on hand-typed email threads, personal contacts, and stale databases while your site stays dark. We never guess; we map data on the spot to match the specialized skills you need.',
    },
    {
      title: 'Direct Access with No Layering',
      text: 'You work directly with mobilization specialists who are backed by clean data. No stacked account managers, no game of telephone, and no paperwork bottlenecks holding up gate access.',
    },
    {
      title: 'Predictive Crew Pipeline',
      text: 'Rather than scrambling after a specialized technician walks off or fails a background check, our pipelines keep a standby roster actively maintained around your outage schedules.',
    },
  ] satisfies DrawerBullet[],
};

export const engine = {
  number: '02',
  title: 'The Vectr Engine',
  image: { src: '/img/vectr-engine.webp', alt: 'Hands typing on laptop keyboard', width: 400, height: 400 },
  subtitle: 'Precision Through Automation',
  body: [
    'Vectr swaps manual friction for computational speed. To us, workforce mobilization is a data problem, not a networking exercise.',
    'With advanced AI and automation we cut out the administrative lag that weighs down traditional vendors. Our technology carries the heavy lifting, which lets us:',
  ],
  features: [
    { title: 'Identify Signals', text: 'Our systems read technical capability data in an instant to pinpoint the expertise complex projects demand.' },
    { title: 'Automate Validation', text: 'Automated checks on our platform confirm qualifications and pair talent with roles in short order.' },
    { title: 'Instant Deployment', text: 'We shrink the gap between spotting a workforce need and putting fully prepared technical teams on site.' },
  ] satisfies DrawerBullet[],
};

export const outcome = {
  number: '03',
  title: 'The Outcome',
  image: { src: '/img/outcome-worker.webp', alt: 'Industrial worker in safety gear at facility', width: 400, height: 400 },
  subtitle: 'Engineered for Execution',
  lead: 'Working with Vectr is an investment in operational continuity.',
  items: [
    {
      number: '01',
      title: 'Shield Your Margins',
      text: 'We remove the idle hours that drain capital. You pay for work getting done, not for weeks spent waiting on a vendor to staff a crew.',
    },
    {
      number: '02',
      title: 'Protect Critical Timelines',
      text: 'Keep your critical path intact. Move between phases confident that your specialized labor will arrive on site, fully badged, and ready to go.',
    },
    {
      number: '03',
      title: 'Pay for Value, Not Overhead',
      text: 'We strip out the internal administrative bloat that traditional brokerages hand down to you as inflated markup rates.',
    },
  ],
};

export const missionBridge = {
  lines: ['We are the bridge between digital ', 'intelligence and real world ', 'infrastructure.'],
  text: 'Bureaucracy has no right to slow the industries that keep the world running. This is not resource supply. It is engineered speed.',
  ctas: [
    { label: 'Apply', href: '/apply', variant: 'glass' },
    { label: 'Request Crews', href: '/request-crew', variant: 'dark' },
  ] as const,
};
