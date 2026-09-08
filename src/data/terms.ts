import type { LegalSection } from './privacy';
import { site } from './site';

/** Terms of Service content. See src/data/privacy.ts for the section shape. */
export const termsMeta = {
  heroTitle: 'Terms of Service',
  heroText: 'These terms set out the rules for using the BreezePocket website and app. Please take a moment to read them before you continue.',
  navLabel: 'Terms of service navigation',
  updated: 'Last updated: September 2026',
  contactEmail: site.email,
} as const;

export const termsSections: readonly LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    nav: 'Acceptance of Terms',
    html: `
      <p>By visiting this website, joining the waitlist, or using the BreezePocket app or smart contracts offered by BreezePocket ("BreezePocket", "we" or "us"), you accept these Terms of Service together with our Privacy Policy. If you cannot accept them, please stop using the site and app and refrain from submitting information to us.</p>
      <p>Where a separate written agreement exists between you and BreezePocket, for example an early access or partnership agreement, that agreement controls if it conflicts with these terms.</p>
    `,
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    nav: 'Eligibility',
    html: `
      <p>BreezePocket is meant for adults: you need to be 18 or older and capable of forming a legally binding agreement before you use the app or submit information. You also confirm that you are not located in, and are not a resident or national of, any country or territory subject to comprehensive sanctions, and that you do not appear on any sanctions or restricted-party list.</p>
      <p>You are responsible for making sure that using BreezePocket is lawful where you live. We may restrict access from certain jurisdictions, and we may ask you to confirm eligibility before providing a service.</p>
      <p>If you use the site or app on behalf of a company, DAO or fund, you confirm that you have the authority to accept these terms for that organisation.</p>
    `,
  },
  {
    id: 'services',
    title: 'Description of Services',
    nav: 'Description of Services',
    html: `
      <p>BreezePocket is a non-custodial application on the Solana blockchain. It lets you deposit supported assets into on-chain contracts, set a price at which you would be willing to sell or buy, and receive income while you wait. If the market reaches your price by your chosen date, the trade settles at that price; if not, your deposit and the income remain yours.</p>
      <p><strong>Non-custodial.</strong> We never take possession of your funds or your private keys. Every deposit, target and settlement is an on-chain transaction that you authorise with your own wallet. You are responsible for keeping your wallet and keys secure.</p>
      <p><strong>No financial advice.</strong> BreezePocket provides software, not advice. Nothing on the site or in the app is a recommendation to buy, sell or hold any asset, and we do not know your personal circumstances. Decide for yourself, and consider speaking to a qualified adviser.</p>
      <p><strong>Availability.</strong> Joining the waitlist does not guarantee access, and requesting early access does not create a binding commitment. Features, supported assets and availability may change while the app is in development.</p>
    `,
  },
  {
    id: 'submissions',
    title: 'User Submissions',
    nav: 'User Submissions',
    html: `
      <p>When you send us information through a form or message, you represent that:</p>
      <ul>
        <li>The information is truthful, current and complete</li>
        <li>Any wallet address you share is one you control</li>
        <li>Nothing you submit infringes another person's rights or breaks the law</li>
      </ul>
      <p>You grant BreezePocket a non-exclusive licence to store and use what you submit for the purpose of providing our services. We may decline or remove any submission at our discretion.</p>
    `,
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    nav: 'Intellectual Property',
    html: `
      <p>The design, text, graphics, logos and software that make up this website and the app belong to BreezePocket or its licensors and are protected by copyright and trademark law.</p>
      <p>You may view and print pages for your own, non-commercial use. Copying, altering, redistributing or creating anything derived from the site or app is not allowed unless we have agreed to it in writing or the relevant code is released under an open-source licence.</p>
      <p>The BreezePocket name and logo are trademarks of BreezePocket. Solana, Seeker and other names appearing on the site belong to their respective owners.</p>
    `,
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    nav: 'Acceptable Use',
    html: `
      <p>While using the site and app you agree not to:</p>
      <ul>
        <li>Provide false, misleading or incomplete information</li>
        <li>Impersonate another person or organisation</li>
        <li>Use the app to launder money, finance terrorism or evade sanctions</li>
        <li>Exploit, attack or attempt to manipulate our smart contracts or the markets they interact with</li>
        <li>Upload malicious code or attempt to disrupt the service</li>
        <li>Scrape, crawl or harvest data from the site by automated means</li>
        <li>Try to gain access to systems or data you are not authorised to see</li>
        <li>Use the site or app for any unlawful, harassing or discriminatory purpose</li>
      </ul>
    `,
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    nav: 'Third-Party Services',
    html: `
      <p>BreezePocket relies on outside services, including the Solana network, wallet providers, price feeds, hosting, analytics and email delivery. Their terms and privacy practices apply to the parts of the process they handle, and we are not responsible for their content, availability or conduct.</p>
      <p>Blockchain networks and wallets are operated independently of us. We cannot reverse transactions, recover lost keys, or control network fees, congestion or downtime.</p>
      <p>Links to other websites are provided for convenience only and do not mean we endorse those sites.</p>
    `,
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers and Risk Disclosure',
    nav: 'Disclaimers',
    html: `
      <p>We offer the site, the app and our smart contracts on an "as is" and "as available" basis. To the fullest extent the law allows, BreezePocket disclaims all warranties, express or implied, including any warranty of merchantability, fitness for a particular purpose or non-infringement.</p>
      <p><strong>Using BreezePocket involves risk, and you may lose value.</strong> In particular:</p>
      <ul>
        <li><strong>Volatility:</strong> crypto prices move sharply and unpredictably; the value of what you deposit can fall while you wait</li>
        <li><strong>Targets may fill:</strong> if the market reaches your price, you will sell or buy at that price and give up any further move beyond it</li>
        <li><strong>Income is not guaranteed:</strong> the income offered depends on market conditions and may be lower than expected or unavailable</li>
        <li><strong>Smart-contract risk:</strong> code can contain bugs or be exploited, and blockchain transactions cannot be undone</li>
        <li><strong>Market and liquidity risk:</strong> settlement depends on counterparties, price feeds and network conditions outside our control</li>
      </ul>
      <p>We do not promise that the site or app will be uninterrupted, error-free or secure, or that any target, deposit or strategy will produce a particular result. Nothing on the site or in the app constitutes legal, tax, investment or financial advice.</p>
    `,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    nav: 'Limitation of Liability',
    html: `
      <p>To the extent permitted by law, BreezePocket and its officers, contributors and agents will not be liable for any indirect, incidental, consequential, special or punitive damages, or for lost profits, revenue, tokens or data, arising from your use of the site, the app or our smart contracts.</p>
      <p>Our total liability for any claim relating to the site, the app or these terms will not exceed one hundred US dollars (US$100) or the amount of fees you paid us in the twelve months before the claim, whichever is greater.</p>
      <p>Some jurisdictions do not allow certain limitations, so parts of this section may not apply to you.</p>
    `,
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    nav: 'Indemnification',
    html: `
      <p>You agree to defend, indemnify and hold harmless BreezePocket and its affiliates from any claims, losses, liabilities and expenses (including reasonable legal fees) that arise from your use of the site or app, your on-chain activity, your submissions, or your breach of these terms or of any law.</p>
    `,
  },
  {
    id: 'termination',
    title: 'Termination',
    nav: 'Termination',
    html: `
      <p>We may suspend or end your access to the site or app at any time, with or without notice, if we believe you have broken these terms, if we are required to by law, or if we discontinue a service. Because BreezePocket is non-custodial, ending access to our interface does not affect assets held in your own wallet, and open on-chain positions will settle according to their terms.</p>
      <p>Sections that by their nature should survive termination, including intellectual property, disclaimers, limitation of liability and governing law, will continue to apply.</p>
    `,
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    nav: 'Governing Law',
    html: `
      <p>These terms are governed by the laws of the jurisdiction in which BreezePocket is organised, without regard to conflict-of-law rules. If a disagreement cannot be settled informally, it must be brought in the courts of that jurisdiction, and you agree that those courts may hear the case.</p>
    `,
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    nav: 'Changes to These Terms',
    html: `
      <p>We may revise these terms occasionally. The updated version will be posted on this page with a new "last updated" date, and material changes will be announced on the site or in the app. Your continued use after a change takes effect means you accept the revised terms.</p>
    `,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    nav: 'Contact Us',
    html: `
      <p>If anything in these terms is unclear or you would like to raise a concern, reach us by email at the address below.</p>
    `,
  },
];
