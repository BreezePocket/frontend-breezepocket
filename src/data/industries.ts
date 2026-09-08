/** Copy and image metadata for the Industries page. */
export interface Industry {
  id: 'nuclear' | 'gas' | 'data-centers' | 'semiconductors';
  navLabel: string;
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  services: readonly string[];
}

export const industriesPage = {
  hero: {
    title: "Staffing the World's<br/>Critical Systems",
    text: 'We staff the highest-stakes environments: Nuclear Power, Gas Turbines, Data Centers, and Semiconductors.',
  },
  sectionTitle: 'Our Industries',
  heroImage: {
    src: '/img/industries-hero.webp',
    alt: 'Power transmission lines at sunset over a river',
    width: 2688,
    height: 1536,
  },
  cta: {
    lines: ['Staff your outage with fast response, ', 'and crews you can rely on.'],
    href: '/request-crew',
    label: 'Request Crews',
  },
} as const;

export const industries: readonly Industry[] = [
  {
    id: 'nuclear',
    navLabel: 'Nuclear Power',
    title: 'Precision staffing for nuclear facilities and outages',
    image: { src: '/img/industry-nuclear.webp', alt: 'Nuclear power plant cooling towers', width: 1568, height: 2336 },
    services: [
      'Schedulers',
      'Welders',
      'Radiation Protection',
      'Scaffolders',
      'Administrative',
      'Boilermakers',
      'Electricians',
      'Decontamination',
      'Planners P6',
    ],
  },
  {
    id: 'gas',
    navLabel: 'Gas',
    title: 'Staffing for high-output, time-critical turbine operations',
    image: { src: '/img/industry-gas.webp', alt: 'Gas turbine facility', width: 2048, height: 2048 },
    services: ['Schedulers', 'Welders', 'Scaffolders', 'Laborers', 'Administrative', 'Boilermakers', 'Electricians', 'Planners P6'],
  },
  {
    id: 'data-centers',
    navLabel: 'Data Centers',
    title: 'Precision staffing for data center build-outs and uptime',
    image: { src: '/img/industry-datacenter.webp', alt: 'Data center server room', width: 2048, height: 2048 },
    services: [
      'Low Voltage Techs',
      'HVAC Techs',
      'Electricians',
      'Environmental Electricians',
      'Commissioning Agents',
      'Laborers',
      'Scaffolders',
      'Planners P6',
      'Welders',
    ],
  },
  {
    id: 'semiconductors',
    navLabel: 'Semiconductors',
    title: 'Precision staffing for semiconductor fabs and facilities',
    image: { src: '/img/industry-semiconductor.webp', alt: 'Semiconductor fabrication facility', width: 2496, height: 1664 },
    services: ['Cleanroom Techs', 'Orbital Welders', 'Tool Installers', 'Hook Up Techs', 'Pipe Fitters', 'Welders', 'Electricians', 'Planners P6'],
  },
];
