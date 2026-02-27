import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/auth.store'
import toast from 'react-hot-toast'
import { getErrorMessage } from './api-error.util'

export const axiosClient = axios.create({
    baseURL: '',
    withCredentials: true,
})

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // NOTE: Evita loops infinitos: não intercepta 401s dos endpoints de login ou refresh.
        const isAuthEndpoint = originalRequest?.url?.includes('/login') || originalRequest?.url?.includes('/refresh')

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosClient(originalRequest)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // NOTE: Usamos axios puro para evitar loops de interceptação no endpoint de refresh.
                const response = await axios.post('/v1/user/refresh', {}, { withCredentials: true })
                const newUser = response.data.metadata
                const newToken = response.data.token

                if (!newToken) throw new Error('No token returned')

                // NOTE: Atualiza o estado global (isso também reinicia o agendador proativo!)
                useAuthStore.getState().setAuth(newToken, newUser)
                processQueue(null, newToken)

                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosClient(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null)
                useAuthStore.getState().clearAuth()

                toast.error(getErrorMessage(refreshError, 'Sessão expirada. Faça login novamente.'))

                // NOTE: Evita que a aplicação continue ativa com a sessão expirada.
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)
