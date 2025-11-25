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

    if (!token && !userId) {
      // Throw an axios-style error
      return Promise.reject({
        message: 'Authentication token missing',
        status: 401,
        config
      })
    }
  
    config.headers.Authorization = `Bearer ${token}`

    switch(config.method) {
      case 'post': 
        config.data = {
          ...(config.data || {}),
          createdBy: userId,
        }
        break;
      
      case 'get': {
        config.params = {
          ...(config.params || {}),
          createdBy: userId,
        }
        break;
      }

      case 'patch': {
        config.data = {
          ...(config.data || {}),
          createdBy: userId
        }
        break;
      }

      case 'delete': {
        config.params = {
          ...(config.params || {}),
          createdBy: userId
        }
        break;
      }
    }

    return config
  })

  return api
}
