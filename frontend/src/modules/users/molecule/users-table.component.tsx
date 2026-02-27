import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table.component'
import { Button } from '../../../components/ui/button.component'
import { KeyRound, ShieldAlert, Loader2, RefreshCw, Copy, Check, Info } from 'lucide-react'
import { format } from 'date-fns'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog.component'
import { getUsersList, resetPasswordAttempt } from '../services/user.service'
import type { MetadataUserResponseDto } from '../../auth/molecule/auth.types'
import { getErrorMessage } from '../../../lib/api-error.util'
import toast from 'react-hot-toast'

export function UsersTableComponent() {
    const [page, setPage] = useState(0)
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const [confirmResetOpen, setConfirmResetOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<MetadataUserResponseDto | null>(null)
    const [copied, setCopied] = useState(false)

    const { data: paginatedUsers, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['users', page],
        queryFn: () => getUsersList(page, 50),
    })

    const resetMutation = useMutation({
        mutationFn: (email: string) => resetPasswordAttempt(email),
        onSuccess: (data) => {
            setTemporaryPassword(data.temp_password)
            setResetDialogOpen(true)
            toast.success('Senha resetada com sucesso!')
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, 'Erro ao resetar senha do usuário.'))
        }
    })

    const handleResetPassword = (user: MetadataUserResponseDto) => {
        setSelectedUser(user)
        setConfirmResetOpen(true)
    }

    const confirmReset = () => {
        if (selectedUser) {
            resetMutation.mutate(selectedUser.email)
            setConfirmResetOpen(false)
        }
    }

    const copyToClipboard = () => {
        if (temporaryPassword) {
            navigator.clipboard.writeText(temporaryPassword)
            setCopied(true)
            toast.success('Senha copiada para a área de transferência!')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Carregando usuários...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 font-semibold mb-2">Erro ao carregar usuários</p>
                <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">
                    {getErrorMessage(error, 'Não foi possível buscar a lista de usuários no momento.')}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                    Tentar Novamente
                </Button>
            </div>
        )
    }

    const users = paginatedUsers?.data || []
    const pagination = paginatedUsers?.meta.pagination

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Usuários Cadastrados</h2>
                <div className="flex items-center gap-3">
                    {isRefetching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                    <Button variant="ghost" size="icon" onClick={() => refetch()} className="h-8 w-8 text-gray-400">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {pagination?.totalItems || 0} usuários
                    </span>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                Nenhum usuário encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium text-gray-900">{user.username}</TableCell>
                                <TableCell className="text-gray-500">{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {user.active ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            Ativo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Inativo
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                                        onClick={() => handleResetPassword(user)}
                                        disabled={resetMutation.isPending}
                                        title="Resetar Senha"
                                    >
                                        {resetMutation.isPending && resetMutation.variables === user.email ? (
                                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                        ) : (
                                            <KeyRound className="w-4 h-4 mr-1.5" />
                                        )}
                                        Resetar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasPrevious}
                            onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasNext}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <ShieldAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Confirmar Reset de Senha</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Você tem certeza que deseja resetar a senha de <span className="font-bold text-gray-900">{selectedUser?.username}</span>?
                            Esta ação forçará o usuário a definir uma nova senha no próximo acesso.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button variant="outline" onClick={() => setConfirmResetOpen(false)} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmReset} className="w-full sm:w-auto">
                            Sim, Resetar Senha
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Temporary Password Reset Dialog */}
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <Info className="w-6 h-6 text-primary-600" />
                        </div>
                        <DialogTitle className="text-center">Senha Resetada com Sucesso</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            A nova senha temporária de <span className="font-bold text-gray-900">{selectedUser?.username}</span> gerada pelo sistema está abaixo.
                            Clique no campo para copiar.
                        </DialogDescription>
                    </DialogHeader>

                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 rounded-2xl p-8 mt-4 flex items-center justify-center flex-col gap-3 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-2 right-2 p-2 rounded-lg bg-white shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Senha Temporária</span>
                        <code className="text-3xl font-mono font-bold text-gray-900 tracking-[0.2em] bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm group-hover:scale-105 transition-transform">
                            {temporaryPassword}
                        </code>
                        <span className="text-xs text-primary-600 font-medium flex items-center gap-1.5">
                            <Copy className="w-3 h-3" /> Clique para copiar
                        </span>
                    </button>

                    <div className="mt-8 flex justify-center">
                        <Button onClick={() => setResetDialogOpen(false)} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all hover:scale-[1.02] active:scale-95">
                            Ok, copiado!
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
