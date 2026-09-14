export const LEGAL_LAST_UPDATED = 'September 14, 2026'

export const LEGAL_DOCUMENT_VERSIONS = {
  privacyNotice: '2026-09-14',
  termsOfService: '2026-09-14',
  dataProcessingAddendum: '2026-09-14',
} as const

export const legalDocumentLinks = [
  { href: '/privacy', label: 'Privacy Notice' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/data-processing-addendum', label: 'Data Processing Addendum' },
] as const

export function createLegalAcceptanceMetadata() {
  return {
    legalAcceptance: {
      privacyNoticeVersion: LEGAL_DOCUMENT_VERSIONS.privacyNotice,
      termsOfServiceVersion: LEGAL_DOCUMENT_VERSIONS.termsOfService,
      dataProcessingAddendumVersion:
        LEGAL_DOCUMENT_VERSIONS.dataProcessingAddendum,
      source: 'registration',
    },
  }
}
