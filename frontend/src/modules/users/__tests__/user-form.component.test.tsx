import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserFormComponent } from '../user-form.component'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { axiosClient } from '../../../lib/axios-client.util'

// Mock axios implementation to not make real requests
vi.mock('../../../lib/axios-client.util', () => ({
    axiosClient: {
        post: vi.fn(),
    },
}))

describe('UserFormComponent UI Rendering', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        queryClient = new QueryClient()
    })

    const renderComponent = () =>
        render(
            <QueryClientProvider client={queryClient}>
                <UserFormComponent />
            </QueryClientProvider>
        )

    it('Deve renderizar os 3 campos e o botão de submit', () => {
        renderComponent()

        expect(screen.getByLabelText('Nome de Usuário')).toBeInTheDocument()
        expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
        expect(screen.getByLabelText('Senha')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /salvar administrador/i })).toBeInTheDocument()
    })

    // TanStack Form is async and can take a few ticks to flush the schema format
    it('Deve impedir a submissão com dados inválidos sem chamar a API', async () => {
        renderComponent()

        const submitButton = screen.getByRole('button', { name: /salvar administrador/i })

        // Clicking submit without filling anything should block the mutation
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(axiosClient.post).not.toHaveBeenCalled()
        })
    })
})
