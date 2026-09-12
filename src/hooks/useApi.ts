'use client'

import { useEffect, useMemo } from 'react'
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { useAuth } from '@clerk/nextjs'
import { showAppToast } from '@/hooks/useToast'

export function useApi(): AxiosInstance {
  const { getToken, userId } = useAuth()

  const api = useMemo(
    () =>
      axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      }),
    [],
  )

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken()

      if (!token || !userId) {
        return Promise.reject({
          message: 'Authentication token missing',
          status: 401,
          config,
        })
      }

      config.headers.Authorization = `Bearer ${token}`

      // Ownership is derived by the backend from this verified token.
      // Never attach browser-controlled createdBy, userId, or orgId fields here.

      return config
    })

    return () => {
      api.interceptors.request.eject(interceptor)
    }
  }, [api, getToken, userId])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status
        const isColdStart =
          error.code === 'ECONNABORTED' ||
          error.message.includes('Network Error') ||
          status === 502 ||
          status === 503 ||
          status === 504

        if (isColdStart) {
          showAppToast(
            {
              title: 'Server waking up...',
              description: 'The backend is starting. Please wait 10 to 30 seconds.',
            },
            'loading',
          )
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [api])

  return api
}
