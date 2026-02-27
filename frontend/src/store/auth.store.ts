import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MetadataUserResponseDto } from '../modules/auth/molecule/auth.types'
import axios from 'axios'

interface AuthState {
    token: string | null
    user: MetadataUserResponseDto | null
    isAuthenticated: boolean
    isAdmin: boolean
    setAuth: (token: string, user: MetadataUserResponseDto) => void
    clearAuth: () => void
}

let refreshInterval: number | undefined

// We use a standalone axios instance for the proactive refresh to avoid circular dependencies with our main axios client
const proactiveRefresh = async () => {
    try {
        const response = await axios.post<{ token: string; metadata: MetadataUserResponseDto }>(
            '/v1/user/refresh',
            {},
            {
                withCredentials: true,
            }
        )
        if (response.data.token && response.data.metadata) {
            useAuthStore.getState().setAuth(response.data.token, response.data.metadata)
        }
    } catch (error) {
        console.error('Proactive refresh failed', error)
        useAuthStore.getState().clearAuth()
    }
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false,

            setAuth: (token, user) => {
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isAdmin: user.role === 'ADMIN',
                })

                if (refreshInterval) {
                    window.clearInterval(refreshInterval)
                }
                // Proactive refresh: 9 minutes
                refreshInterval = window.setInterval(proactiveRefresh, 9 * 60 * 1000)
            },

            clearAuth: () => {
                if (refreshInterval) {
                    window.clearInterval(refreshInterval)
                    refreshInterval = undefined
                }
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                })
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                // If we survive an F5 and are authenticated, we need to re-register the token refresh interval
                if (state?.isAuthenticated) {
                    if (refreshInterval) {
                        window.clearInterval(refreshInterval)
                    }
                    refreshInterval = window.setInterval(proactiveRefresh, 9 * 60 * 1000)
                }
            }
        }
    )
)
