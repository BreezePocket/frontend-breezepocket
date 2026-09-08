/** Copy for the home page. Headings/labels mirror the reference; body text is original. */

export interface HeroCopy {
  /** Two lines of the h1 (the first keeps its trailing space, as in the reference). */
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
  image: { src: string; alt: string; width: number; height: number };
  title: readonly string[];
  description: string;
  cta: { label: string; href: string };
}

export const hero: HeroCopy = {
  title: ['The New Standard ', 'in Staffing'],
  subtitle: [
    'Speed powered by AI. Curated by experts.',
    'We deploy vetted crews that keep your timeline and your budget intact on sites where the stakes are highest.',
  ],
  scrollLabel: 'scroll to discover our process',
};

export const flowSteps: readonly FlowStep[] = [
  {
    number: '01',
    title: 'Activation, simplified',
    description:
      'A single call sets mobilization in motion.<br> Your brief — trade, headcount and start date — goes straight to our vetted crews. No middle layers. No chasing. Just people on site within minutes.',
  },
  {
    number: '02',
    title: 'Cleared to count',
    description:
      'Every worker is screened and verified by our team ahead of dispatch. Background, compliance, certifications and fitness-for-duty are all checked under a zero-fail standard, so each person clears the gate on their first day.',
  },
  {
    number: '03',
    title: 'Proven field match',
    description:
      'Availability alone is not enough. We send crews with a track record. By screening for prior performance, role fit and dependability, we build teams that last the distance — keeping your project at full strength from the first shift to the last.',
  },
  {
    number: '04',
    title: 'Seamless arrival',
    description:
      'We handle the final leg of every mobilization. Crews show up ready to work, with reporting instructions already confirmed. Live arrival tracking and hands-on coordination keep your shift starting on schedule, even as conditions in the field change.',
  },
];

/** HTML: the `<br class="pc">` only breaks on desktop. */
export const featuresTitle = 'Designed for today&#39;s operations,<br class="pc"> beyond legacy staffing workflows.';

export const features: readonly FeatureItem[] = [
  {
    icon: '/icons/features/rapid-activation.svg',
    iconAlt: 'Rapid Activation icon',
    title: 'Rapid Activation',
    description:
      'Speed is a discipline we practice. Machine learning turns our staffing process into on-demand logistics, placing an accurately matched workforce the instant a need arises.',
  },
  {
    icon: '/icons/features/rigorous-selection.svg',
    iconAlt: 'Rigorous Selection icon',
    title: 'Rigorous Selection',
    description:
      'Location matters as much as skill. Our AI engine locates and reaches qualified workers inside a set radius, locking in the best local contractors first and weighing both cost and capability.',
  },
  {
    icon: '/icons/features/verified.svg',
    iconAlt: '100% Verified Before Arrival icon',
    title: '100% Verified Before Arrival',
    description:
      'A Zero-Trust verification model, backed by secure API integrations, automates background checks and drug screening and withholds dispatch until every worker is fully cleared.',
  },
  {
    icon: '/icons/features/controlled-outcomes.svg',
    iconAlt: 'Controlled Outcomes icon',
    title: 'Controlled Outcomes',
    description:
      'We keep results predictable by controlling the two variables that matter most in staffing—cost and compliance—favoring local mobilization and automating safety checks on every dispatch.',
  },
];

export const standards: StandardsCopy = {
  image: {
    src: '/img/apply-door-wide.webp',
    alt: 'Crew in safety vests coordinating on an industrial site',
    width: 800,
    height: 400,
  },
  title: ['Nuclear-grade ', 'standards across ', 'every site.'],
  description:
    'Built for nuclear-grade settings, our process demands strict badge compliance, safeguarded schedules and no tolerance for error.',
  cta: { label: 'Explore our industries', href: '/industries' },
};

export const faqTitle = 'How we work and how we deliver industrial-grade staffing.';

export const faq: readonly FaqItem[] = [
  {
    question: 'How fast can crews be mobilized?',
    answer:
      'We work to your timeline, not ours. Because our platform keeps a large pool of verified industrial craft on hand, the weeks lost to conventional hiring cycles disappear. A single call starts our mobilization engine, which sources and dispatches precisely matched crews within hours rather than days, keeping your critical path fully staffed.',
  },
  {
    question: 'How do you handle compliance & background checks?',
    answer:
      'Our approach is a Zero-Fail Compliance model. Well before anyone is approved for dispatch, our system automatically verifies background checks, drug screening (FFD) and the certifications specific to your site, nuclear-grade requirements included. Nobody who isn’t completely cleared reaches the gate, so your badging office starts Day 1 without a single surprise.',
  },
  {
    question: 'What is the coverage during outages?',
    answer:
      'Outages run around the clock, and so does our coordination. We cover the complete spectrum of outage trades, from general labor and painting through specialized repair work and scheduling. Just as important, we own the final leg of arrival, tracking every deployment live so both day and night shifts stay fully crewed even when conditions on site change.',
  },
  {
    question: 'How does Vectr differ from traditional staffing vendors?',
    answer:
      'Conventional vendors react; Vectr operates as an engine. Where legacy agencies lean on hand-sorted resumes and whoever happens to be free, we combine intelligent workflows with expert curation to deliver precision that has been proven in the field. Rather than simply finding people who want work, we dispatch tested crews built for the relentless pace of a critical-path environment.',
  },
];

export const cta = {
  lines: ['Staff your outage with fast response, ', 'and crews you can rely on.'] as const,
  href: '/request-crew',
  label: 'Request Crews',
};
