/** Copy for the Submit a Privacy Request page. */
export const privacyRequest = {
  heroTitle: 'Submit a Privacy Request',
  heroText:
    'If you live in California you can exercise your CCPA/CPRA rights by getting in touch with us. Everyone else can use the same route to access, correct or delete the details we hold. We reply to every request within 45 days.',
  intro: {
    title: 'How this works',
    paragraphs: [
      'You may ask us to tell you what personal information we hold about you, to delete or correct it, or to opt you out of any sale or sharing. This covers details such as your waitlist entry, your contact details and any wallet address you shared with us.',
      'Before we act on a request we confirm who you are, usually by matching details you have previously given us, such as the email address you joined with. Requests made through an authorised agent must be accompanied by written proof that the agent is acting for you. Please note that records on the Solana blockchain are public and permanent, and we cannot alter or remove them.',
    ],
  },
  alternatives: {
    title: 'How to contact us',
    text: 'Send your request by email. Tell us which right you are exercising (know, delete, correct or opt-out), your full name, and the email address you used with us.',
    emailSubject: 'Privacy Request',
    emailNote: 'Include "Privacy Request" in the subject line.',
    disclaimerLabel: 'Privacy Policy',
  },
} as const;
