import { site } from './site';

/**
 * Privacy Policy content. `nav` is the sidebar label, `title` the section heading,
 * `html` the section body (rendered with set:html).
 */
export interface LegalSection {
  id: string;
  title: string;
  nav: string;
  html: string;
}

export const privacyMeta = {
  heroTitle: 'Privacy Policy',
  heroText:
    'We take your privacy seriously. This page describes the personal information we gather, the ways we use it, and the steps we take to keep it safe while you use our services.',
  navLabel: 'Privacy policy navigation',
  updated: 'Last updated: June 2026',
  contactEmail: site.privacyEmail,
} as const;

export const privacySections: readonly LegalSection[] = [
  {
    id: 'information-collected',
    title: 'Information We Collect',
    nav: 'Information We Collect',
    html: `
      <p><strong>Information you give us.</strong> Most of the personal information we hold is information you hand to us yourself, for example when you apply for work, ask us to staff a project, or write to our team. Depending on the form you use, this can include:</p>
      <ul>
        <li>Your name, email address, phone number and the state you live in</li>
        <li>Your trade, years of experience and the certifications or licences you hold</li>
        <li>A resume or a short written summary of your credentials</li>
        <li>Your consent to background checks and drug screening where a placement requires them</li>
        <li>Company name, job title and business contact details when you request a crew</li>
        <li>Anything else you choose to include in a message to us</li>
      </ul>
      <p><strong>Sensitive information.</strong> A resume or certification file can occasionally contain details that privacy laws treat as sensitive, such as a driver's licence number or a union membership. We only use such details to evaluate your suitability for work and never for any unrelated purpose.</p>
      <p><strong>Information gathered automatically.</strong> This website does not run analytics scripts, advertising pixels or tracking cookies. Our hosting provider records ordinary server logs (IP address, browser type, requested page and timestamp) for security and troubleshooting, and those logs are purged on a rolling basis.</p>
    `,
  },
  {
    id: 'how-we-use',
    title: 'How We Use Information',
    nav: 'How We Use Information',
    html: `
      <p>We use the information described above only for the purposes listed here:</p>
      <ul>
        <li><strong>Placing workers:</strong> reviewing applications, confirming qualifications, running required screenings and matching people to open roles</li>
        <li><strong>Serving clients:</strong> responding to crew requests, scoping projects and managing ongoing engagements</li>
        <li><strong>Keeping in touch:</strong> answering questions, sending job opportunities and delivering account or service notices</li>
        <li><strong>Meeting obligations:</strong> verifying credentials, completing mandated checks and satisfying employment, tax and safety regulations</li>
        <li><strong>Running the business:</strong> protecting our systems, detecting misuse and understanding how our services are used</li>
        <li><strong>Marketing:</strong> occasionally telling you about our services; you can opt out whenever you like</li>
      </ul>
    `,
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing',
    nav: 'Information Sharing',
    html: `
      <p><strong>We never sell personal information, and we do not share it for targeted advertising.</strong> The situations in which we pass information to someone else are limited to the following:</p>
      <ul>
        <li><strong>Hiring clients:</strong> once you are being considered for a role, we share the professional details a client needs to make a decision, and we let you know before we do so</li>
        <li><strong>Vendors working for us:</strong> companies that host our site, deliver our email or perform screenings act under contracts that restrict them to the work we hire them for</li>
        <li><strong>Legal reasons:</strong> when a law, court order or government request obliges us to disclose information, or when disclosure is needed to protect people or property</li>
        <li><strong>Corporate changes:</strong> if Vectr is merged, acquired or sells its assets, your information may transfer to the new owner under the same protections</li>
      </ul>
    `,
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    nav: 'Data Retention',
    html: `
      <p>We keep personal information only for as long as we need it for the purpose it was collected, then delete or anonymise it. Our typical retention periods are:</p>
      <ul>
        <li><strong>Website applications:</strong> up to 24 months after submission, unless you remain an active candidate or are placed</li>
        <li><strong>Crew requests and general enquiries:</strong> up to 12 months after submission</li>
        <li><strong>Placed workers:</strong> employment and payroll records for seven years after an assignment ends, as required by law</li>
        <li><strong>Screening results:</strong> for the period required by applicable federal and state rules</li>
        <li><strong>Client contacts:</strong> for the life of the relationship and seven years afterwards</li>
        <li><strong>Form progress saved in your browser:</strong> stored locally on your device only, until you submit the form or clear your browser data</li>
      </ul>
      <p>Where a legal hold, dispute or audit requires it, we may keep specific records for longer than the periods above.</p>
    `,
  },
  {
    id: 'data-security',
    title: 'Data Security',
    nav: 'Data Security',
    html: `
      <p>We use reasonable technical and organisational safeguards to protect personal information, including:</p>
      <ul>
        <li>Encrypted connections (TLS) for every page and form on this site</li>
        <li>Encryption of stored data with our hosting and email providers</li>
        <li>Access limited to team members who need it to do their job</li>
        <li>Written agreements with every vendor that processes data for us</li>
        <li>Periodic review of our systems and practices</li>
      </ul>
      <p>No online service can promise perfect security. If we learn of a breach affecting your information, we will notify you and the relevant authorities as the law requires.</p>
    `,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    nav: 'Your Rights',
    html: `
      <p>Wherever you live, you can ask us to do the following with your personal information:</p>
      <ul>
        <li><strong>Access:</strong> receive a copy of the information we hold about you</li>
        <li><strong>Correction:</strong> fix details that are wrong or out of date</li>
        <li><strong>Deletion:</strong> erase your information, except where we must keep it by law</li>
        <li><strong>Portability:</strong> get your information in a format you can take elsewhere</li>
        <li><strong>Opt out:</strong> stop marketing messages using the unsubscribe link or by contacting us</li>
        <li><strong>Withdraw consent:</strong> revoke any consent you have given, at any time</li>
      </ul>
      <p>To make a request, email us at the address in the Contact section. We will confirm your identity before acting and reply within the time the law allows.</p>
    `,
  },
  {
    id: 'california',
    title: 'California Privacy Rights',
    nav: 'California Privacy Rights',
    html: `
      <p>If you are a California resident, the CCPA and CPRA give you additional rights over your personal information:</p>
      <ul>
        <li><strong>Right to know:</strong> learn the categories and specific pieces of information we have collected, where it came from, why we collected it and who we shared it with</li>
        <li><strong>Right to delete:</strong> ask us to remove information we collected from you, subject to the exceptions in the law</li>
        <li><strong>Right to correct:</strong> have inaccurate information amended</li>
        <li><strong>Right to opt out of sale or sharing:</strong> we do not sell or share personal information for behavioural advertising; if that ever changes we will add a clear opt-out first</li>
        <li><strong>Right to limit sensitive information:</strong> ask us to use any sensitive details in your application only for the purposes strictly needed to provide our services</li>
        <li><strong>Right to non-discrimination:</strong> exercising these rights will never affect the service or opportunities you receive from us</li>
      </ul>
      <p><strong>Global Privacy Control.</strong> We treat the GPC browser signal as a valid opt-out request for any future sale or sharing of personal information.</p>
      <p><strong>Categories collected in the last 12 months:</strong> identifiers (name, email, phone); professional and employment details (trade, experience, certifications, resume, employer); consent records for screenings; and, where it appears in the documents you send, sensitive information such as government ID numbers.</p>
      <p><strong>Submitting a request.</strong> You can exercise any of these rights by using our <a href="/privacy-request">privacy request page</a>, emailing us at the address below, or writing to our postal address. You may also appoint an authorised agent to act for you; we will ask the agent for proof of their authority.</p>
    `,
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    nav: 'Third-Party Services',
    html: `
      <p>A small number of outside companies help us run our business. Each one receives only the information needed for its task:</p>
      <ul>
        <li><strong>Transactional email provider:</strong> delivers the forms you submit to our team's inbox</li>
        <li><strong>Hosting and cloud services:</strong> serve this website and process form submissions</li>
        <li><strong>Background check providers:</strong> verify employment history and credentials for candidates moving toward placement</li>
        <li><strong>Drug testing facilities:</strong> carry out screenings that particular sites or clients require</li>
        <li><strong>Payment processors:</strong> handle payroll for placed workers and invoicing for clients</li>
      </ul>
      <p>These providers are bound by their own privacy policies as well as our contracts with them.</p>
    `,
  },
  {
    id: 'cookies',
    title: 'Cookies &amp; Tracking Technologies',
    nav: 'Cookies &amp; Tracking',
    html: `
      <p><strong>This website does not currently set cookies, run analytics or load advertising pixels.</strong></p>
      <p><strong>Local storage.</strong> While you fill out a longer form, such as the Apply or Request Crew form, we save your progress in your browser's local storage so nothing is lost if the tab closes. That data never leaves your device and is cleared once you submit the form.</p>
      <p><strong>Preferences.</strong> We also use local storage to remember simple settings, such as whether you have muted the site's sound.</p>
      <p><strong>Future changes.</strong> Should we add analytics or advertising tools later, we will update this policy, name the tools involved and, where required, ask for your consent before they load.</p>
      <p><strong>Global Privacy Control.</strong> We honour the GPC signal as an opt-out from any future sale or sharing of personal information.</p>
    `,
  },
  {
    id: 'children',
    title: 'Children&#39;s Privacy',
    nav: 'Children&#39;s Privacy',
    html: `
      <p>Our services are intended for adults and we do not knowingly collect personal information from anyone under 18. If you believe a minor has provided information to us, please contact us and we will delete it promptly.</p>
    `,
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    nav: 'Changes to This Policy',
    html: `
      <p>We may revise this policy as our services or the law change. When we do, we will:</p>
      <ul>
        <li>Update the date shown at the top of this page</li>
        <li>Post the new version here</li>
        <li>Email you or place a notice on the site when the change is significant</li>
      </ul>
      <p>Continuing to use our services after a change takes effect means you accept the updated policy.</p>
    `,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    nav: 'Contact Us',
    html: `
      <p>Questions about this policy, requests to exercise your rights, or concerns about how we handle data can be sent to:</p>
    `,
  },
];
