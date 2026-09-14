import assert from 'node:assert/strict'
import test from 'node:test'
import { signUpSchema } from '../src/features/auth/auth.schema.ts'
import {
  LEGAL_DOCUMENT_VERSIONS,
  createLegalAcceptanceMetadata,
} from '../src/features/legal/legal.constants.ts'

const validSignUp = {
  ownerName: 'Sample Business',
  emailAddress: 'owner@example.com',
  password: 'secure-password',
  acceptsTerms: true,
}

test('registration requires an express legal agreement', () => {
  assert.equal(signUpSchema.safeParse(validSignUp).success, true)
  assert.equal(
    signUpSchema.safeParse({ ...validSignUp, acceptsTerms: false }).success,
    false,
  )
})

test('legal acceptance metadata records every accepted document version', () => {
  assert.deepEqual(createLegalAcceptanceMetadata(), {
    legalAcceptance: {
      privacyNoticeVersion: LEGAL_DOCUMENT_VERSIONS.privacyNotice,
      termsOfServiceVersion: LEGAL_DOCUMENT_VERSIONS.termsOfService,
      dataProcessingAddendumVersion:
        LEGAL_DOCUMENT_VERSIONS.dataProcessingAddendum,
      source: 'registration',
    },
  })
})
