import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { AppErrorBoundary } from './app-error-boundary.component'
import { useAuthStore } from '../store/auth.store'
import { LoginPage } from '../modules/auth/login.page'
import { ResetPasswordPage } from '../modules/auth/reset-password.page'
import { UsersPage } from '../modules/users/users.page'
import toast from 'react-hot-toast'

export const rootRoute = createRootRoute({
    component: () => (
        <AppErrorBoundary>
            <Outlet />
        </AppErrorBoundary>
    ),
})

export const loginRoute = createRoute({
    path: '/login',
    component: LoginPage,
    getParentRoute: () => rootRoute,
    beforeLoad: () => {
        if (useAuthStore.getState().isAuthenticated) {
            throw redirect({ to: '/' })
        }
    },
})

export const protectedLayout = createRoute({
    id: 'protected',
    getParentRoute: () => rootRoute,
    beforeLoad: ({ location }) => {
        const { isAuthenticated, isAdmin, passwordResetRequired, clearAuth } = useAuthStore.getState()

        if (!isAuthenticated) {
            throw redirect({ to: '/login', search: { redirect: location.href } })
        }

        // NOTE: Força o usuário a resetar a senha.
        const isResetPage = location.pathname === '/reset-password'

        if (passwordResetRequired && !isResetPage) {
            throw redirect({ to: '/reset-password' })
        }

        if (!passwordResetRequired && isResetPage) {
            throw redirect({ to: '/' })
        }

        if (!isAdmin && !passwordResetRequired) {
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
    path: '/',
    component: UsersPage,
    getParentRoute: () => protectedLayout,
})

export const resetPasswordRoute = createRoute({
    path: '/reset-password',
    component: ResetPasswordPage,
    getParentRoute: () => protectedLayout,
})

export const routeTree = rootRoute.addChildren([
    loginRoute,
    protectedLayout.addChildren([dashboardRoute, resetPasswordRoute])
])

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

// Registra as rotas para type safety.
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
