import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { AppErrorBoundary } from './app-error-boundary.component'
import { useAuthStore } from '../store/auth.store'
import { LoginPage } from '../modules/auth/login.page'
import { ResetPasswordPage } from '../modules/auth/reset-password.page'
import { UsersPage } from '../modules/users/users.page'
import toast from 'react-hot-toast'

// Root route that provides layout, error boundary and global guards
export const rootRoute = createRootRoute({
    component: () => (
        <AppErrorBoundary>
            <Outlet />
        </AppErrorBoundary>
    ),
})

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
    beforeLoad: () => {
        if (useAuthStore.getState().isAuthenticated) {
            throw redirect({ to: '/' })
        }
    },
})

export const protectedLayout = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    beforeLoad: ({ location }) => {
        const { isAuthenticated, isAdmin, passwordResetRequired, clearAuth } = useAuthStore.getState()

        if (!isAuthenticated) {
            throw redirect({ to: '/login', search: { redirect: location.href } })
        }

        // Forced Password Reset Guard
        const isResetPage = location.pathname === '/reset-password'
        if (passwordResetRequired && !isResetPage) {
            throw redirect({ to: '/reset-password' })
        }
        if (!passwordResetRequired && isResetPage) {
            throw redirect({ to: '/' })
        }

        if (!isAdmin && !passwordResetRequired) { // Only check admin if not in reset flow
            toast.error('Você não tem permissão para acessar este recurso.')
            clearAuth()
            throw redirect({ to: '/login' })
        }
    },
    component: () => (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    )
})

export const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayout,
    path: '/',
    component: UsersPage,
})

export const resetPasswordRoute = createRoute({
    getParentRoute: () => protectedLayout,
    path: '/reset-password',
    component: ResetPasswordPage,
})

export const routeTree = rootRoute.addChildren([
    loginRoute,
    protectedLayout.addChildren([dashboardRoute, resetPasswordRoute])
])

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
