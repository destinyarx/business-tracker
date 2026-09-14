import type { Metadata } from 'next'
import {
  LegalDocumentLayout,
  LegalList,
  LegalSection,
} from '@/features/legal/components/LegalDocumentLayout'
import { LEGAL_DOCUMENT_VERSIONS } from '@/features/legal/legal.constants'

export const metadata: Metadata = {
  title: 'Privacy Notice | NegosyoTracker',
  description: 'How NegosyoTracker collects, uses, stores, and protects personal data.',
}

export default function PrivacyNoticePage() {
  return (
    <LegalDocumentLayout
      title="Privacy Notice"
      summary="This notice explains how NegosyoTracker handles account information and the business records users place in the service under the Philippine Data Privacy Act of 2012."
      version={LEGAL_DOCUMENT_VERSIONS.privacyNotice}
    >
      <LegalSection title="1. Scope and our roles">
        <p>
          This notice applies to the NegosyoTracker website and authenticated business-management workspace. NegosyoTracker acts as a personal information controller for account administration, authentication coordination, service security, and direct communications with its users.
        </p>
        <p>
          When a business user records information about customers, staff, suppliers, or other individuals, that business decides why and how the information is used. For that processing, the business is generally the personal information controller and NegosyoTracker acts as its personal information processor, subject to the Data Processing Addendum.
        </p>
      </LegalSection>

      <LegalSection title="2. Personal data we process">
        <LegalList>
          <li><strong>Account data:</strong> owner or business name, email address, Clerk user identifier, authentication status, and legal-acceptance time. Passwords and Google credentials are handled by Clerk and are not made available to NegosyoTracker.</li>
          <li><strong>Business records:</strong> customer names and optional contact details, customer types, notes, products, suppliers, product images, stock levels, orders, order items, sales, and expenses.</li>
          <li><strong>Technical data:</strong> authentication tokens, security and request logs, device or browser details, IP-derived security information, and essential cookies used to operate and protect the service.</li>
          <li><strong>Support data:</strong> information a user includes when asking for technical, privacy, or account assistance.</li>
        </LegalList>
        <p>Users must avoid entering sensitive personal information unless it is necessary, lawful, and appropriate for their business purpose.</p>
      </LegalSection>

      <LegalSection title="3. Why we process personal data">
        <LegalList>
          <li>To create and secure accounts and provide the requested service.</li>
          <li>To store, organize, retrieve, and calculate the user&apos;s business records.</li>
          <li>To prevent abuse, investigate failures, maintain availability, and protect accounts.</li>
          <li>To answer support and data-subject requests.</li>
          <li>To comply with Philippine legal obligations and enforce the Terms of Service.</li>
          <li>To provide AI-supported insights only when that feature is introduced and the related processing has been disclosed.</li>
        </LegalList>
        <p>
          Processing is based on performance of the service contract, legitimate business and security interests, compliance with law, or consent where consent is specifically required. Optional marketing will require separate permission.
        </p>
      </LegalSection>

      <LegalSection title="4. Service providers and disclosures">
        <p>NegosyoTracker uses service providers only as needed to operate the service. Current provider categories include:</p>
        <LegalList>
          <li>Clerk for authentication, account management, and legal-acceptance records.</li>
          <li>Application hosting and network providers that deliver the frontend and API.</li>
          <li>PostgreSQL infrastructure for business records and Redis infrastructure for short-lived application caching.</li>
          <li>Supabase Storage for product images uploaded by users.</li>
          <li>Email infrastructure when the service sends account or operational messages.</li>
        </LegalList>
        <p>
          Information may also be disclosed when required by law, to protect users or the service, during a lawful business transfer, or on the documented instruction of the business that supplied the information. NegosyoTracker does not sell personal data.
        </p>
      </LegalSection>

      <LegalSection title="5. International processing">
        <p>
          Some providers may process or store information outside the Philippines. NegosyoTracker will use contractual and organizational safeguards appropriate to the processing and will remain accountable for providers processing personal data on its behalf.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention and deletion">
        <p>
          Account and business data are retained while the account is active and afterward only for a period reasonably needed for recovery, security, legal compliance, dispute handling, or the operator&apos;s documented retention schedule. Backups may retain deleted information for a limited recovery cycle before being overwritten.
        </p>
        <p>
          Clerk provides authentication-account deletion. Business records and uploaded images are stored in separate systems, so deleting only the Clerk identity does not by itself confirm deletion from every NegosyoTracker system. Before closing an account, users should export needed records and submit a deletion request through the contact in this notice so removal can be confirmed across the API, database, cache, backups, and storage, subject to lawful retention requirements.
        </p>
      </LegalSection>

      <LegalSection title="7. Your privacy rights">
        <p>Subject to the Data Privacy Act and applicable exceptions, individuals may request:</p>
        <LegalList>
          <li>Information about and access to their personal data.</li>
          <li>Correction of inaccurate or incomplete information.</li>
          <li>Objection to or restriction of certain processing.</li>
          <li>Erasure or blocking when the legal conditions are met.</li>
          <li>A portable copy of eligible data in a commonly used format.</li>
          <li>Withdrawal of consent without affecting earlier lawful processing.</li>
        </LegalList>
        <p>
          Individuals may also lodge a complaint with the Philippine National Privacy Commission. When NegosyoTracker processes an individual&apos;s information for a business user, the request should normally be directed first to that business; NegosyoTracker will assist the business as required.
        </p>
      </LegalSection>

      <LegalSection title="8. Security and incidents">
        <p>
          NegosyoTracker uses account authentication, owner-scoped API access, transport encryption, access controls, validation, backups, and monitoring appropriate to the service. No online system can guarantee absolute security. Qualifying personal data breaches will be assessed and reported to the National Privacy Commission and affected individuals within the periods required by Philippine law.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          NegosyoTracker is intended for people at least 18 years old who can enter into a business agreement. It is not designed to collect information directly from children. Business users are responsible for having a lawful basis before entering any minor&apos;s information in their records.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this notice">
        <p>
          Material changes will be identified by a new version and effective date. Where a change materially affects the purpose, scope, method, or extent of processing, users will receive appropriate notice and a new consent request when consent is required.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  )
}
