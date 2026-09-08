/** Copy for the Apply page and the application modal. */

export interface ApplySection {
  title: string;
  text: string;
  image: { src: string; alt: string; width: number; height: number };
}

export const applyHero = {
  title: 'Great projects rely<br/>on great people.',
  text: 'We are always sourcing the best people in the industry, from engineers to precision millwrights, so that when a job kicks off the right crew is already lined up.',
  cta: 'Apply Now to Vectr',
} as const;

export const applySections: readonly ApplySection[] = [
  {
    title: 'The search never stops',
    text: 'We never wait for an outage before we go looking for a crew. Our scouting for top-tier tradespeople runs all year round. Whether you are free today or tied up on another site until spring, we still want your name on file.',
    image: { src: '/img/apply-search.webp', alt: 'Professional reviewing work in office environment', width: 1568, height: 2336 },
  },
  {
    title: 'Skill is our currency',
    text: 'We work in high-stakes settings: nuclear, gas, data infrastructure. Precision is never optional in these industries, so we put talent, experience and certification ahead of everything else. Craftspeople who hold themselves to that standard fit right in here.',
    image: { src: '/img/apply-skill.webp', alt: 'Industrial workers reviewing tablet at facility', width: 3072, height: 2048 },
  },
  {
    title: 'An open door for professionals',
    text: 'Applying here is not a one-off job application: it puts you in a shortlist of vetted specialists. Once you are part of the Vectr Network, a high-value contract opening means we already know to call you first.',
    image: { src: '/img/apply-door-square.webp', alt: 'Team of workers coordinating at industrial site', width: 2048, height: 2048 },
  },
];

export const applyCta = {
  lines: ['Get on our Radar'],
  subtitle: 'Tell the network who you are. Every profile is reviewed so we can pair your skills with the work that is coming up.',
  label: 'Apply Now to Vectr',
} as const;

export const tradeOptions = [
  { value: 'millwright', label: 'Millwright' },
  { value: 'turbines', label: 'Turbines' },
  { value: 'welders', label: 'Welders' },
  { value: 'electricians', label: 'Electricians' },
  { value: 'boilermakers', label: 'Boilermakers' },
  { value: 'other', label: 'Other' },
] as const;

export const experienceOptions = [
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'journeyman', label: 'Journeyman' },
  { value: 'master', label: 'Master' },
  { value: 'foreman', label: 'Foreman' },
] as const;

export const applyModal = {
  steps: {
    details: 'Your details',
    trade: 'Primary Trade & Specialty',
    experience: 'Experience Level',
    credentials: 'Your Credentials',
    review: 'Review your details',
  },
  errors: {
    fullName: 'Please enter your full name',
    email: 'Please enter a valid email address',
    trade: 'Please select at least one trade',
    experience: 'Please select your experience level',
    submit: 'Something went wrong. Please try again.',
    fileTooLarge: 'File exceeds 10 MB limit',
  },
  maxFileSize: 10485760,
  disclaimer:
    'By submitting this form you agree that Vectr may use the details you provide to assess your application and get in touch with you. Your information is never sold or shared for advertising. See our ',
  disclaimerDetails:
    'Information collected: name, contact details, trade, experience level, certifications and resume. Submissions reach our team through Postmark and are kept for up to 24 months. Your progress in this form is stored in your browser until you submit.',
  success: {
    title: 'Thanks for reaching out, {name}.',
    body: 'Your application has landed with us and we will be in touch soon!',
    home: 'Return to Home',
  },
} as const;
