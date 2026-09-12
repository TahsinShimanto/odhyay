import axios from 'axios'

const api = axios.create({ withCredentials: true })

let isRefreshing = false
let queue = [] 

const processQueue = (error) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()))
  queue = []
}

api.interceptors.response.use((res) => res, async (error) => {
    const { config, response } = error

    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error)
    }

    if (config.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(config))
    }

    config._retry = true
    isRefreshing = true

    try {
      await api.post('/api/auth/refresh')
      processQueue(null)
      return api(config)

    } catch (refreshError) {
      processQueue(refreshError)
      return Promise.reject(refreshError)
      
    } finally {
      isRefreshing = false
    }
  }
)

export default api