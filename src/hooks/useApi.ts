'use client'

import { useEffect, useMemo } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

export function useApi(): AxiosInstance {
  const { getToken, userId } = useAuth()

  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    })
  }, [])

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        const token = await getToken({
          template: 'supabase-jwt',
          skipCache: true
        })

        if (!token || !userId) {
          return Promise.reject({
            message: 'Authentication token missing',
            status: 401,
            config
          })
        }

        config.headers.Authorization = `Bearer ${token}`

        return config
      }
    )

    return () => {
      api.interceptors.request.eject(interceptor)
    }
  }, [api, getToken, userId])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      res => res,
      error => {
        const status = error?.response?.status
        const message = error?.message

        const isColdStart =
          error.code === "ECONNABORTED" ||                // timeout
          message?.includes("Network Error") ||           // network fail
          status === 502 || status === 503 || status === 504 // cold-start statuses
          
        if (isColdStart) {
          toast("⏳ Server Waking Up…", {
            description:
              "Our backend is cold starting on free-tier hosting. Please wait 10–30 seconds.",
          })
        }

        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [api])

  return api
}
