/** Copy for the Get Early Access page (/early-access). */
export const earlyAccess = {
  title: 'Get Early Access',
  /** Short intro lines. An empty string renders the &nbsp; spacer paragraph. */
  description: [
    'Managing a treasury, a DAO, or a fund?',
    'Put idle SOL, BTC and ETH to work with price targets your team sets.',
    '',
    'Tell us your scope; we will set you up first.',
  ],
  fields: {
    firstName: { label: 'First Name', required: true },
    lastName: { label: 'Last Name', required: true },
    organisation: { label: 'Organisation', required: true },
    workEmail: { label: 'Work email', required: true },
    telegram: { label: 'Telegram', required: false },
    profile: { label: 'You are', required: true },
  },
  profiles: [
    { value: 'holder', label: 'Individual holder', checked: true },
    { value: 'dao', label: 'DAO or treasury' },
    { value: 'fund', label: 'Fund or family office' },
    { value: 'builder', label: 'Builder / protocol' },
    { value: 'other', label: 'Other' },
  ],
  disclaimer: {
    text: 'When you submit this form, you agree that BreezePocket may use the details you provide to follow up on your early access request. We never sell this information or pass it on for advertising. Read our',
    linkLabel: 'Privacy Policy',
    linkHref: '/privacy',
    readMore: 'Read more',
    details:
      'What we collect: your name, organisation, work email, Telegram handle and the profile you select. Requests are sent to our team through an email delivery service and kept for a maximum of 12 months.',
  },
  submitLabel: 'Submit',
} as const;
