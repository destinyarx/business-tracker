'use client'

import { toast, type ExternalToast } from 'sonner'
import {
  AppToast,
  type AppToastVariant,
} from '@/components/ui/app-toast'

type ToastOptions = {
  title: string
  description?: string
}

type LoadingPromiseOptions = {
  loadingTitle: string
  loadingDescription?: string
  successTitle: string
  successDescription?: string
  errorTitle: string
  errorDescription?: string | ((error: Error) => string)
}

type ToastId = string | number

type AppToastApi = {
  success: (options: ToastOptions) => ToastId
  error: (options: ToastOptions) => ToastId
  loading: (options: ToastOptions) => ToastId
  loadingPromise: <Result>(
    promise: Promise<Result>,
    options: LoadingPromiseOptions,
  ) => Promise<Result>
}

const TRANSIENT_TOAST_DURATION = 2800

export function showAppToast(
  { title, description }: ToastOptions,
  variant: AppToastVariant = 'info',
  options?: ExternalToast,
): ToastId {
  return toast.custom(
    () => (
      <AppToast
        title={title}
        description={description}
        variant={variant}
      />
    ),
    {
      duration: TRANSIENT_TOAST_DURATION,
      unstyled: true,
      ...options,
    },
  )
}

export function useToast(): AppToastApi {
  function success(options: ToastOptions): ToastId {
    return showAppToast(options, 'success')
  }

  function error(options: ToastOptions): ToastId {
    return showAppToast(options, 'error')
  }

  function loading(options: ToastOptions): ToastId {
    return showAppToast(options, 'loading', { duration: Infinity })
  }

  async function loadingPromise<T>(
    promise: Promise<T>,
    {
      loadingTitle,
      loadingDescription,
      successTitle,
      successDescription,
      errorTitle,
      errorDescription,
    }: LoadingPromiseOptions,
  ): Promise<T> {
    const toastId = loading({
      title: loadingTitle,
      description: loadingDescription,
    })

    try {
      const result = await promise
      toast.dismiss(toastId)

      success({
        title: successTitle,
        description: successDescription,
      })

      return result
    } catch (caughtError) {
      toast.dismiss(toastId)

      const errorValue =
        caughtError instanceof Error
          ? caughtError
          : new Error('An unexpected error occurred.')

      error({
        title: errorTitle,
        description:
          typeof errorDescription === 'function'
            ? errorDescription(errorValue)
            : errorDescription,
      })

      throw errorValue
    }
  }

  return { success, error, loading, loadingPromise }
}
