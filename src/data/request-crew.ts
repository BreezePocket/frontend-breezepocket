/** Copy for the Request Crews page (/request-crew). */
export const requestCrew = {
  title: 'Request Crews',
  /** Short intro lines. An empty string renders the &nbsp; spacer paragraph. */
  description: [
    'Outages never run on a schedule.',
    'Reach Vectr any hour of the day and we will get a specialized crew moving to your site right away.',
    '',
    'Give us the scope of work; we take care of the headcount.',
  ],
  fields: {
    firstName: { label: 'First Name', required: true },
    lastName: { label: 'Last Name', required: true },
    companyName: { label: 'Company Name', required: true },
    workEmail: { label: 'Work email', required: true },
    contactNumber: { label: 'Contact Number', required: false },
    industry: { label: 'Industry', required: true },
  },
  industries: [
    { value: 'nuclear', label: 'Nuclear', checked: true },
    { value: 'gas', label: 'Gas' },
    { value: 'data-centers', label: 'Data Centers' },
    { value: 'semiconductor', label: 'Semiconductors' },
    { value: 'other', label: 'Other' },
  ],
  disclaimer: {
    text: 'When you submit this form, you agree that Vectr may use the details you provide to follow up on your staffing request. We never sell this information or pass it on for advertising. Read our',
    linkLabel: 'Privacy Policy',
    linkHref: '/privacy',
    readMore: 'Read more',
    details:
      'What we collect: your name, company, email address, phone number and industry. Requests are sent to our team through an email delivery service and kept for a maximum of 12 months.',
  },
  submitLabel: 'Submit',
} as const;
