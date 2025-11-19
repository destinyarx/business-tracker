import axios from 'axios'
import { useAuth } from '@clerk/nextjs'

export const useApi = () => {
  const { getToken, userId } = useAuth()

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
  })

  // Attach token to every request
  api.interceptors.request.use(async (config) => {
    const token = await getToken({ template: "supabase-jwt", skipCache: true })

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (userId && config.method === 'post') {
        config.data = {
            ...(config.data || {}),
            createdBy: userId,
        }
    }

    if (userId && config.method === 'get') {
        config.params = {
          ...(config.params || {}),
          createdBy: userId,
        }
    }

    return config
  })

  return api
}
