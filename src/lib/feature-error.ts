import axios from 'axios'
import { ZodError } from 'zod'

export type FeatureErrorKind =
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'invalid_request'
  | 'invalid_response'
  | 'server'
  | 'network'
  | 'unexpected'

export class FeatureError extends Error {
  readonly kind: FeatureErrorKind
  readonly status?: number

  constructor(
    message: string,
    kind: FeatureErrorKind,
    status?: number,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'FeatureError'
    this.kind = kind
    this.status = status
  }
}

export function toFeatureError(featureName: string, error: Error): FeatureError {
  if (error instanceof FeatureError) return error

  if (error instanceof ZodError) {
    return new FeatureError(
      `The ${featureName} service returned data in an unexpected format.`,
      'invalid_response',
      undefined,
      { cause: error },
    )
  }

  if (!axios.isAxiosError<{ message?: string | string[] }>(error)) {
    return new FeatureError(
      `An unexpected ${featureName} error occurred.`,
      'unexpected',
      undefined,
      { cause: error },
    )
  }

  const status = error.response?.status
  const responseMessage = error.response?.data?.message
  const apiMessage = Array.isArray(responseMessage)
    ? responseMessage.join(' ')
    : responseMessage

  if (!status) {
    return new FeatureError(
      `The ${featureName} service could not be reached.`,
      'network',
      undefined,
      { cause: error },
    )
  }

  const kindByStatus: Partial<Record<number, FeatureErrorKind>> = {
    400: 'invalid_request',
    401: 'unauthenticated',
    403: 'forbidden',
    404: 'not_found',
    409: 'conflict',
    422: 'invalid_request',
  }

  const kind = kindByStatus[status] ?? (status >= 500 ? 'server' : 'unexpected')

  return new FeatureError(
    apiMessage?.trim() || `The ${featureName} request failed.`,
    kind,
    status,
    { cause: error },
  )
}

export function ensureFeatureError(featureName: string, error: Error | null): FeatureError {
  return error
    ? toFeatureError(featureName, error)
    : new FeatureError(`An unexpected ${featureName} error occurred.`, 'unexpected')
}
