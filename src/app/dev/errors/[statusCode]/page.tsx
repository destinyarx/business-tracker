import { forbidden, notFound, unauthorized } from 'next/navigation'

interface ErrorPreviewPageProps {
  params: Promise<{ statusCode: string }>
}

// Fires the real Next.js triggers so each custom error page renders with its true HTTP status.
// ponytail: disabled in production builds unless ENABLE_ERROR_PREVIEW=true.
export default async function ErrorPreviewPage({ params }: ErrorPreviewPageProps) {
  const { statusCode } = await params

  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_ERROR_PREVIEW !== 'true') {
    notFound()
  }

  if (statusCode === '401') unauthorized()
  if (statusCode === '403') forbidden()
  if (statusCode === '500') throw new Error('Error preview: simulated server error.')

  notFound()
}
