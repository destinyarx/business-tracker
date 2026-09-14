import type { Metadata } from 'next'
import {
  LegalDocumentLayout,
  LegalList,
  LegalSection,
} from '@/features/legal/components/LegalDocumentLayout'
import { LEGAL_DOCUMENT_VERSIONS } from '@/features/legal/legal.constants'

export const metadata: Metadata = {
  title: 'Data Processing Addendum | NegosyoTracker',
  description: 'Data-processing terms for businesses using NegosyoTracker.',
}

export default function DataProcessingAddendumPage() {
  return (
    <LegalDocumentLayout
      title="Data Processing Addendum"
      summary="This Addendum governs NegosyoTracker’s processing of personal data entered by a business user and forms part of the Terms of Service."
      version={LEGAL_DOCUMENT_VERSIONS.dataProcessingAddendum}
    >
      <LegalSection title="1. Parties and application">
        <p>
          This Data Processing Addendum applies when a NegosyoTracker account holder submits personal data concerning customers, employees, suppliers, or other individuals. The account holder is the “Customer,” and the operator of NegosyoTracker is the “Processor.”
        </p>
        <p>
          The Customer generally acts as the personal information controller because it determines the business purpose and lawful basis for its records. NegosyoTracker processes that data on the Customer&apos;s documented instructions to provide the service. Each party remains responsible for obligations assigned to it by Republic Act No. 10173, its Implementing Rules and Regulations, and applicable National Privacy Commission issuances.
        </p>
      </LegalSection>

      <LegalSection title="2. Processing details">
        <LegalList>
          <li><strong>Subject:</strong> operation of the NegosyoTracker business-management workspace.</li>
          <li><strong>Duration:</strong> the Customer&apos;s use of the service plus the documented deletion, backup, security, and lawful-retention periods.</li>
          <li><strong>Nature:</strong> collection, recording, organization, storage, retrieval, calculation, display, transmission, correction, restriction, export, and deletion.</li>
          <li><strong>Purpose:</strong> managing customers, products, stock, orders, sales, expenses, reports, and related support and security.</li>
          <li><strong>Data subjects:</strong> the Customer&apos;s customers, contacts, staff, suppliers, account users, and other people included in submitted records.</li>
          <li><strong>Data:</strong> names, email addresses, phone numbers, classifications, business notes, transaction associations, order details, and other information the Customer chooses to submit.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Customer instructions and responsibilities">
        <p>The Customer instructs NegosyoTracker to process submitted data only to provide, secure, maintain, and support the service. The Customer must:</p>
        <LegalList>
          <li>Collect and use personal data lawfully, fairly, transparently, and proportionately.</li>
          <li>Provide required privacy notices and obtain consent when consent is the applicable legal basis.</li>
          <li>Limit submitted data to what is necessary for legitimate business operations.</li>
          <li>Keep records accurate and respond to the individuals whose data it controls.</li>
          <li>Avoid sensitive personal information unless the Customer has established a lawful need and appropriate safeguards.</li>
          <li>Use the service consistently with the Terms of Service and applicable Philippine law.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Processor obligations">
        <p>NegosyoTracker will:</p>
        <LegalList>
          <li>Process Customer personal data only on documented instructions, including these Terms and the Customer&apos;s use of service features, unless Philippine law requires otherwise.</li>
          <li>Require people authorized to handle the data to maintain confidentiality.</li>
          <li>Maintain reasonable organizational and technical safeguards appropriate to the processing risks.</li>
          <li>Notify the Customer if an instruction appears to violate applicable data-protection law.</li>
          <li>Provide reasonable assistance with data-subject requests, privacy assessments, security obligations, and qualifying breach notifications.</li>
          <li>Delete or return Customer personal data after termination according to the Privacy Notice and lawful-retention requirements.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Security measures">
        <p>Measures appropriate to the current service include:</p>
        <LegalList>
          <li>Clerk authentication and bearer-token verification for protected API operations.</li>
          <li>Owner-scoped database queries intended to separate each account&apos;s business records.</li>
          <li>Transport encryption provided by production HTTPS infrastructure.</li>
          <li>Input validation, request throttling, cache scoping, and restricted storage paths.</li>
          <li>Access limitation, dependency maintenance, logging, backups, recovery controls, and incident handling appropriate to the free release.</li>
        </LegalList>
        <p>The Customer remains responsible for its devices, credentials, user access, exports, and secure handling of information outside NegosyoTracker.</p>
      </LegalSection>

      <LegalSection title="6. Subprocessors">
        <p>
          The Customer authorizes subprocessors reasonably required to operate NegosyoTracker. Current categories include Clerk for authentication, application and network hosting, PostgreSQL database infrastructure, Redis caching infrastructure, Supabase Storage for uploaded product images, and email delivery infrastructure.
        </p>
        <p>
          NegosyoTracker will require relevant providers to protect personal data consistently with their role and will remain responsible for its processor obligations. Material changes that create a meaningful new privacy risk will be disclosed through an updated notice or service communication.
        </p>
      </LegalSection>

      <LegalSection title="7. International processing">
        <p>
          The Customer authorizes processing in locations where approved infrastructure providers operate. NegosyoTracker will use appropriate contractual and operational safeguards for processing outside the Philippines and will identify the geographic scope of processing when reasonably available or legally required.
        </p>
      </LegalSection>

      <LegalSection title="8. Data-subject requests">
        <p>
          The Customer is primarily responsible for responding to requests involving Customer-controlled records. NegosyoTracker will provide reasonable assistance through existing access, correction, deletion, and export capabilities or through the legal contact. If NegosyoTracker receives a request directly, it may refer the individual to the Customer unless prohibited by law.
        </p>
      </LegalSection>

      <LegalSection title="9. Security incidents">
        <p>
          NegosyoTracker will inform the Customer without undue delay after confirming a personal data breach affecting Customer personal data and will provide available information reasonably needed for assessment and notification. The Customer, as controller, remains responsible for notifications assigned to controllers, including applicable 72-hour reporting duties, while NegosyoTracker will provide reasonable cooperation.
        </p>
      </LegalSection>

      <LegalSection title="10. Return, deletion, and verification">
        <p>
          On termination, the Customer should export required records and request deletion across the application database, caches, backups, and file storage. Clerk account deletion alone does not confirm deletion from those separate systems. NegosyoTracker may retain data where Philippine law requires it or where narrowly necessary to establish, exercise, or defend legal claims, and will restrict such retained data to that purpose.
        </p>
      </LegalSection>

      <LegalSection title="11. Review and precedence">
        <p>
          On reasonable request, NegosyoTracker will provide information needed to demonstrate compliance with this Addendum, subject to confidentiality, security, and proportionality. If this Addendum conflicts with the Terms of Service on processing Customer personal data, this Addendum controls for that processing.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  )
}
