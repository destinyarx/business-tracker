import type { Metadata } from 'next'
import {
  LegalDocumentLayout,
  LegalList,
  LegalSection,
} from '@/features/legal/components/LegalDocumentLayout'
import { LEGAL_DOCUMENT_VERSIONS } from '@/features/legal/legal.constants'

export const metadata: Metadata = {
  title: 'Terms of Service | NegosyoTracker',
  description: 'Terms governing use of the NegosyoTracker business-management service.',
}

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout
      title="Terms of Service"
      summary="These Terms govern access to NegosyoTracker, a Philippine-focused business-management service for customers, products, inventory, orders, sales, expenses, and business reporting."
      version={LEGAL_DOCUMENT_VERSIONS.termsOfService}
    >
      <LegalSection title="1. Agreement and eligibility">
        <p>
          By creating an account or using NegosyoTracker, you agree to these Terms, acknowledge the Privacy Notice, and, when you enter personal data for your business, agree to the Data Processing Addendum. You must be at least 18 years old and legally able to enter this agreement for yourself or the business you represent.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          NegosyoTracker provides tools for maintaining customer, product, inventory, order, sale, and expense records and for displaying operational summaries. Features may be added, changed, suspended, or removed as the service develops.
        </p>
        <p>
          The service is currently offered without a subscription fee. Free availability is not a promise that every feature or future version will remain free. NegosyoTracker will provide notice and request agreement to applicable commercial terms before charging for a paid plan.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts and access">
        <LegalList>
          <li>Provide accurate registration information and keep it current.</li>
          <li>Protect account credentials and devices and promptly report suspected unauthorized access.</li>
          <li>Use only accounts and business records you are authorized to access.</li>
          <li>Remain responsible for activity performed through your account unless applicable law provides otherwise.</li>
        </LegalList>
        <p>Authentication and authentication-account deletion are provided through Clerk.</p>
      </LegalSection>

      <LegalSection title="4. Your business data">
        <p>
          You retain ownership of the information and files you submit. You give NegosyoTracker a limited, non-exclusive right to host, copy, process, transmit, and display that content only as needed to provide, secure, maintain, and improve the service in accordance with the Privacy Notice and Data Processing Addendum.
        </p>
        <p>
          You are responsible for the accuracy, legality, and quality of your records; obtaining required notices or permissions from customers and other individuals; maintaining records required by your business; and exporting information you need to retain.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>You must not:</p>
        <LegalList>
          <li>Use the service for unlawful, fraudulent, deceptive, or abusive activity.</li>
          <li>Enter personal data you have no authority or lawful basis to process.</li>
          <li>Attempt to access another user&apos;s workspace or bypass authentication, authorization, rate limits, or security controls.</li>
          <li>Upload malware, infringing material, or content that disrupts the service.</li>
          <li>Reverse engineer or probe the service except to the extent a restriction is prohibited by law.</li>
          <li>Represent a NegosyoTracker order summary or report as a BIR-registered invoice when it is not one.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Business, tax, and AI limitations">
        <p>
          NegosyoTracker is a record-management tool. It is not an accounting system, point-of-sale accreditation, tax filing service, legal service, or substitute for professional advice. Reports and calculations may contain incomplete or inaccurate information when source records are incomplete or incorrect.
        </p>
        <p>
          NegosyoTracker does not currently issue BIR-registered tax invoices. Users remain responsible for issuing and preserving invoices and accounting records required by Philippine law.
        </p>
        <p>
          Any future AI-generated insight is informational, may be inaccurate, and must be reviewed before it is used for a financial, employment, legal, credit, or other consequential decision.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          NegosyoTracker may experience maintenance, provider outages, defects, or data-recovery events. Reasonable efforts will be made to operate and secure the service, but the current free release does not include a guaranteed service level, uninterrupted availability, or permanent storage commitment.
        </p>
      </LegalSection>

      <LegalSection title="8. Suspension and termination">
        <p>
          Access may be limited or suspended when reasonably necessary to address security threats, unlawful activity, material breach of these Terms, provider requirements, or risks to other users. You may stop using the service and delete your Clerk account at any time.
        </p>
        <p>
          Because business records and uploaded images are stored separately from Clerk, follow the Privacy Notice&apos;s deletion process to request confirmed deletion across NegosyoTracker systems. Provisions concerning data, intellectual property, liability, disputes, and lawful retention survive termination where their nature requires it.
        </p>
      </LegalSection>

      <LegalSection title="9. Intellectual property">
        <p>
          NegosyoTracker&apos;s software, branding, interface, and original content are protected by applicable intellectual-property laws. These Terms give you a limited, revocable, non-transferable right to use the service for your internal business operations; they do not transfer ownership of the service or its source code.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimers and responsibility">
        <p>
          To the extent allowed by Philippine law, the service is provided on an “as available” basis during its free release. NegosyoTracker does not exclude warranties or liabilities that cannot lawfully be excluded. Where liability may lawfully be limited, NegosyoTracker is not responsible for indirect or consequential losses caused by user-entered data, unauthorized account use, third-party services, or decisions made from reports or AI output.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the Republic of the Philippines. Before filing a formal claim, the parties should attempt in good faith to resolve the concern through the contact listed below. Nothing in these Terms removes rights or remedies that cannot be waived under applicable Philippine law.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these Terms">
        <p>
          NegosyoTracker may update these Terms as the service or law changes. Material revisions will receive a new version and effective date and, when appropriate, notice inside the service. Continued use after the effective date constitutes acceptance only to the extent permitted by law; a new express agreement will be requested when required.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  )
}
