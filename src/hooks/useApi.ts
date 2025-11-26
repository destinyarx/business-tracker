'use client'

import { useEffect, useMemo } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useAuth } from '@clerk/nextjs'

export function useApi(): AxiosInstance {
  const { getToken, userId } = useAuth()

  // Create axios instance once per component (memoized)
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

        // If token or userId is missing → throw axios-style error
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

  return api
}
