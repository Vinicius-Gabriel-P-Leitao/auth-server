import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Loader2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

import { Input } from '../../components/ui/input.component'
import { Button } from '../../components/ui/button.component'
import { registerAdminSchema } from './molecule/user.schema'
import { registerAdminAttempt } from './services/user.service'
import { getErrorMessage } from '../../lib/api-error.util'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.component'

export function UserFormComponent() {
    const registerMutation = useMutation({
        mutationFn: registerAdminAttempt,
        onSuccess: () => {
            toast.success('Administrador cadastrado com sucesso!')
            form.reset()
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Erro ao cadastrar administrador. Tente novamente.'))
        },
    })

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
        validators: {
            onChange({ value }) {
                const result = registerAdminSchema.safeParse(value)
                if (result.success) return undefined

                // Extrai erros específicos se não passou
                const formatted = result.error.format()
                return formatted
            }
        },
        onSubmit: async ({ value }) => {
            await registerMutation.mutateAsync(value)
        },
    })

    return (
        <Card className="w-full max-w-lg shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-gray-500" />
                    Novo Administrador
                </CardTitle>
                <CardDescription>
                    Cadastre um novo usuário com privilégios de acesso total ao sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="username"
                        children={(field) => {
                            const errorMsg = field.state.meta.errors?.length ? 'Verifique os requisitos' : undefined
                            return (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700" htmlFor={field.name}>
                                        Nome de Usuário
                                    </label>
                                    <Input
                                        id={field.name}
                                        type="text"
                                        placeholder="ex: admin_master"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={errorMsg ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
                                </div>
                            )
                        }}
                    />

                    <form.Field
                        name="email"
                        children={(field) => {
                            const errorMsg = field.state.meta.errors?.length ? 'E-mail inválido' : undefined
                            return (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700" htmlFor={field.name}>
                                        E-mail
                                    </label>
                                    <Input
                                        id={field.name}
                                        type="email"
                                        placeholder="admin@exemplo.com"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={errorMsg ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
                                </div>
                            )
                        }}
                    />

                    <form.Field
                        name="password"
                        children={(field) => {
                            const errorMsg = field.state.meta.errors?.length ? 'Mínimo 6 caracteres' : undefined
                            return (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700" htmlFor={field.name}>
                                        Senha
                                    </label>
                                    <Input
                                        id={field.name}
                                        type="password"
                                        placeholder="••••••••"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={errorMsg ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
                                </div>
                            )
                        }}
                    />

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Administrador
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
