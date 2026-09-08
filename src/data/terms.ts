import type { LegalSection } from './privacy';
import { site } from './site';

/** Terms of Service content. See src/data/privacy.ts for the section shape. */
export const termsMeta = {
  heroTitle: 'Terms of Service',
  heroText: 'These terms set out the rules for using the Vectr website and services. Please take a moment to read them before you continue.',
  navLabel: 'Terms of service navigation',
  updated: 'Last updated: June 2026',
  contactEmail: site.email,
} as const;

export const termsSections: readonly LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    nav: 'Acceptance of Terms',
    html: `
      <p>By visiting this website or using any of the services offered by Vectr, Inc. ("Vectr", "we" or "us"), you accept these Terms of Service together with our Privacy Policy. If you cannot accept them, please stop using the site and refrain from submitting information to us.</p>
      <p>Where a separate written agreement exists between you and Vectr, for example a staffing or placement contract, that agreement controls if it conflicts with these terms.</p>
    `,
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    nav: 'Eligibility',
    html: `
      <p>Our site and services are meant for adults: you need to be 18 or older and capable of forming a legally binding agreement before you apply or submit information. By applying for work, you confirm that you are authorised to work in the United States and that the information you give us is accurate.</p>
      <p>If you use the site on behalf of a company, you confirm that you have the authority to accept these terms for that company.</p>
    `,
  },
  {
    id: 'services',
    title: 'Description of Services',
    nav: 'Description of Services',
    html: `
      <p>Vectr connects skilled trades professionals with clients that need crews for outages, shutdowns and other time-critical projects. Through this site you can submit an application, request a crew or contact our team.</p>
      <p>Submitting an application does not guarantee a placement, and requesting a crew does not create a binding order. Any engagement is subject to a separate agreement and to our verification and screening processes.</p>
    `,
  },
  {
    id: 'submissions',
    title: 'User Submissions',
    nav: 'User Submissions',
    html: `
      <p>When you send us information through a form, upload or message, you represent that:</p>
      <ul>
        <li>The information is truthful, current and complete</li>
        <li>You own or have permission to share any document you upload</li>
        <li>Nothing you submit infringes another person's rights or breaks the law</li>
      </ul>
      <p>You grant Vectr a non-exclusive licence to store and use what you submit for the purpose of providing our services. We may decline or remove any submission at our discretion.</p>
    `,
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    nav: 'Intellectual Property',
    html: `
      <p>The design, text, graphics, logos and software that make up this website belong to Vectr or its licensors and are protected by copyright and trademark law.</p>
      <p>You may view and print pages for your own, non-commercial use. Copying, altering, redistributing or creating anything derived from the site is not allowed unless we have agreed to it in writing.</p>
      <p>The Vectr name and logo are trademarks of Vectr, Inc. Other names appearing on the site belong to their respective owners.</p>
    `,
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    nav: 'Acceptable Use',
    html: `
      <p>While using the site you agree not to:</p>
      <ul>
        <li>Provide false, misleading or incomplete information</li>
        <li>Impersonate another person or organisation</li>
        <li>Upload malicious code or attempt to disrupt the service</li>
        <li>Scrape, crawl or harvest data from the site by automated means</li>
        <li>Try to gain access to systems or data you are not authorised to see</li>
        <li>Use the site for any unlawful, harassing or discriminatory purpose</li>
        <li>Reverse-engineer any part of the site or its underlying software</li>
      </ul>
    `,
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    nav: 'Third-Party Services',
    html: `
      <p>Our services rely on outside providers for hosting, email delivery, background screening and payments. Their terms and privacy practices apply to the parts of the process they handle, and we are not responsible for their content or conduct.</p>
      <p>Links to other websites are provided for convenience only and do not mean we endorse those sites.</p>
    `,
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    nav: 'Disclaimers',
    html: `
      <p>We offer the site and our services on an "as is" and "as available" basis. To the fullest extent the law allows, Vectr disclaims all warranties, express or implied, including any warranty of merchantability, fitness for a particular purpose or non-infringement.</p>
      <p>We do not promise that the site will be uninterrupted, error-free or secure, or that any placement or crew request will lead to a particular result.</p>
      <p>Nothing on the site constitutes legal, financial or employment advice.</p>
    `,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    nav: 'Limitation of Liability',
    html: `
      <p>To the extent permitted by law, Vectr and its officers, employees and agents will not be liable for any indirect, incidental, consequential, special or punitive damages, or for lost profits, revenue or data, arising from your use of the site or services.</p>
      <p>Our total liability for any claim relating to the site or these terms will not exceed one hundred US dollars (US$100) or the amount you paid us in the twelve months before the claim, whichever is greater.</p>
      <p>Some jurisdictions do not allow certain limitations, so parts of this section may not apply to you.</p>
    `,
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    nav: 'Indemnification',
    html: `
      <p>You agree to defend, indemnify and hold harmless Vectr and its affiliates from any claims, losses, liabilities and expenses (including reasonable legal fees) that arise from your use of the site, your submissions, or your breach of these terms or of any law.</p>
    `,
  },
  {
    id: 'termination',
    title: 'Termination',
    nav: 'Termination',
    html: `
      <p>We may suspend or end your access to the site or services at any time, with or without notice, if we believe you have broken these terms or if we discontinue a service. Sections that by their nature should survive termination, including intellectual property, disclaimers, limitation of liability and governing law, will continue to apply.</p>
    `,
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    nav: 'Governing Law',
    html: `
      <p>Florida law applies to these terms, ignoring any rules that would point to another jurisdiction. If a disagreement cannot be settled informally, it must be filed in a state or federal court sitting in Orange County, Florida, and you agree that those courts may hear the case.</p>
    `,
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    nav: 'Changes to These Terms',
    html: `
      <p>We may revise these terms occasionally. The updated version will be posted on this page with a new "last updated" date, and material changes will be announced on the site. Your continued use after a change takes effect means you accept the revised terms.</p>
    `,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    nav: 'Contact Us',
    html: `
      <p>If anything in these terms is unclear or you would like to raise a concern, reach us at the details below.</p>
    `,
  },
];
