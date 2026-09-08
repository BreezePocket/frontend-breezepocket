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
    'We take your privacy seriously. This page describes the personal information we gather, the ways we use it, and the steps we take to keep it safe while you use the BreezePocket website and app.',
  navLabel: 'Privacy policy navigation',
  updated: 'Last updated: September 2026',
  contactEmail: site.privacyEmail,
} as const;

export const privacySections: readonly LegalSection[] = [
  {
    id: 'information-collected',
    title: 'Information We Collect',
    nav: 'Information We Collect',
    html: `
      <p><strong>Information you give us.</strong> Most of the personal information we hold is information you hand to us yourself, for example when you join the waitlist, request early access, or write to our team. Depending on the form you use, this can include:</p>
      <ul>
        <li>Your name and email address</li>
        <li>A Telegram or X handle, if you choose to share one</li>
        <li>The assets you hold and how you describe your experience with crypto</li>
        <li>A Solana wallet address, if you choose to share one</li>
        <li>Your organisation and role when you request early access on behalf of a team</li>
        <li>Anything else you choose to include in a message to us</li>
      </ul>
      <p><strong>Wallet and on-chain data.</strong> When you connect a wallet to the BreezePocket app, we see your public wallet address and the transactions you make through our contracts. Activity on the Solana blockchain is public by design and can be viewed by anyone; we do not control that ledger and cannot remove records from it. We never receive your private keys or seed phrase.</p>
      <p><strong>Information gathered automatically.</strong> We may use privacy-respecting analytics to understand how the site and app are used, such as which pages are visited and how features perform. Our hosting provider also records ordinary server logs (IP address, browser type, requested page and timestamp) for security and troubleshooting, and those logs are purged on a rolling basis.</p>
    `,
  },
  {
    id: 'how-we-use',
    title: 'How We Use Information',
    nav: 'How We Use Information',
    html: `
      <p>We use the information described above only for the purposes listed here:</p>
      <ul>
        <li><strong>Managing the waitlist:</strong> recording your place, opening spots in order and letting you know when yours is ready</li>
        <li><strong>Providing the app:</strong> displaying your positions, targets and income, and executing the on-chain actions you request</li>
        <li><strong>Early access:</strong> responding to requests from teams, treasuries and partners and setting them up</li>
        <li><strong>Keeping in touch:</strong> answering questions and sending product or service notices</li>
        <li><strong>Improving the product:</strong> understanding which features are used and where people get stuck</li>
        <li><strong>Security and compliance:</strong> protecting our systems, detecting misuse and meeting legal obligations, including eligibility checks where required</li>
        <li><strong>Marketing:</strong> occasionally telling you about BreezePocket updates; you can opt out whenever you like</li>
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
        <li><strong>Service providers:</strong> companies that host our site, deliver our email or run analytics act under contracts that restrict them to the work we hire them for</li>
        <li><strong>The Solana network:</strong> transactions you sign are broadcast to the public blockchain, where your wallet address and transaction details are visible to anyone</li>
        <li><strong>Legal reasons:</strong> when a law, court order or government request obliges us to disclose information, or when disclosure is needed to protect people or property</li>
        <li><strong>Corporate changes:</strong> if BreezePocket is merged, acquired or sells its assets, your information may transfer to the new owner under the same protections</li>
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
        <li><strong>Waitlist submissions:</strong> up to 24 months after submission, or until you ask us to remove you</li>
        <li><strong>Early access requests and general enquiries:</strong> up to 12 months after submission</li>
        <li><strong>App account and usage data:</strong> for as long as you use the app and up to 12 months afterwards</li>
        <li><strong>Server logs:</strong> purged on a rolling basis, typically within 90 days</li>
        <li><strong>Form progress saved in your browser:</strong> stored locally on your device only, until you submit the form or clear your browser data</li>
      </ul>
      <p>Records written to the Solana blockchain are permanent and outside our control. Where a legal hold, dispute or audit requires it, we may keep specific records for longer than the periods above.</p>
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
      <p>BreezePocket is non-custodial: we never hold your funds or your private keys, so there is nothing of that kind for us to lose. No online service can promise perfect security, however. If we learn of a breach affecting your information, we will notify you and the relevant authorities as the law requires.</p>
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
      <p>To make a request, email us at the address in the Contact section. We will confirm your identity before acting and reply within the time the law allows. Please note that we cannot alter or erase data that has been recorded on the Solana blockchain.</p>
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
        <li><strong>Right to limit sensitive information:</strong> we do not collect sensitive personal information as defined by the CPRA</li>
        <li><strong>Right to non-discrimination:</strong> exercising these rights will never affect the service you receive from us</li>
      </ul>
      <p><strong>Global Privacy Control.</strong> We treat the GPC browser signal as a valid opt-out request for any future sale or sharing of personal information.</p>
      <p><strong>Categories collected in the last 12 months:</strong> identifiers (name, email, social handle, wallet address); the assets you hold and your self-described experience; organisation details for early access requests; and internet activity such as pages visited and features used.</p>
      <p><strong>Submitting a request.</strong> You can exercise any of these rights by using our <a href="/privacy-request">privacy request page</a> or emailing us at the address below. You may also appoint an authorised agent to act for you; we will ask the agent for proof of their authority.</p>
    `,
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    nav: 'Third-Party Services',
    html: `
      <p>A small number of outside services help us run BreezePocket. Each one receives only the information needed for its task:</p>
      <ul>
        <li><strong>The Solana network:</strong> processes and records the transactions you sign; this data is public and not controlled by us</li>
        <li><strong>Wallet providers:</strong> apps such as Phantom, Solflare or the Seeker wallet hold your keys and sign transactions; their own privacy policies apply</li>
        <li><strong>Hosting and cloud services:</strong> serve this website and the app and process form submissions</li>
        <li><strong>Transactional email provider:</strong> delivers the forms you submit to our team and sends waitlist and service emails to you</li>
        <li><strong>Analytics:</strong> help us understand how the site and app are used, in aggregate</li>
      </ul>
      <p>These providers are bound by their own privacy policies as well as our contracts with them.</p>
    `,
  },
  {
    id: 'cookies',
    title: 'Cookies &amp; Tracking Technologies',
    nav: 'Cookies &amp; Tracking',
    html: `
      <p><strong>This website does not load advertising pixels and does not use cookies for tracking.</strong></p>
      <p><strong>Local storage.</strong> While you fill out a longer form, such as the waitlist or early access form, we save your progress in your browser's local storage so nothing is lost if the tab closes. That data never leaves your device and is cleared once you submit the form.</p>
      <p><strong>Preferences.</strong> We also use local storage to remember simple settings, such as whether you have muted the site's sound or which wallet you last connected.</p>
      <p><strong>Analytics.</strong> If we use analytics, we choose tools that do not build cross-site profiles. Should we add tools that require consent, we will update this policy, name them and ask before they load.</p>
      <p><strong>Global Privacy Control.</strong> We honour the GPC signal as an opt-out from any future sale or sharing of personal information.</p>
    `,
  },
  {
    id: 'children',
    title: 'Children&#39;s Privacy',
    nav: 'Children&#39;s Privacy',
    html: `
      <p>BreezePocket is intended for adults and we do not knowingly collect personal information from anyone under 18. If you believe a minor has provided information to us, please contact us and we will delete it promptly.</p>
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
        <li>Email you or place a notice on the site or in the app when the change is significant</li>
      </ul>
      <p>Continuing to use our services after a change takes effect means you accept the updated policy.</p>
    `,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    nav: 'Contact Us',
    html: `
      <p>Questions about this policy, requests to exercise your rights, or concerns about how we handle data can be sent by email to:</p>
    `,
  },
];
