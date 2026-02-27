import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table.component'
import { Button } from '../../../components/ui/button.component'
import { KeyRound, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog.component'

// Temporary mock user type matching backend MetadataUserResponseDto structure roughly
type MockUser = {
    id: string
    username: string
    email: string
    role: 'ADMIN' | 'USER'
    active: boolean
    createdAt: string
}

const mockUsers: Array<MockUser> = [
    {
        id: '1',
        username: 'admin_master',
        email: 'admin@auth.com',
        role: 'ADMIN',
        active: true,
        createdAt: '2026-02-26T22:24:58.979Z',
    },
    {
        id: '2',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'USER',
        active: true,
        createdAt: '2026-02-27T10:00:00.000Z',
    },
    {
        id: '3',
        username: 'jane_smith',
        email: 'jane@example.com',
        role: 'USER',
        active: false,
        createdAt: '2026-02-28T14:30:00.000Z',
    },
]

export function UsersTableComponent() {
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)

    // Simulate password reset logic for UI
    const handleResetPassword = (_user: MockUser) => {
        // In reality we would call the reset password endpoint: POST /v1/password/admin-reset with { email }
        // For now, mock a response showing the temporary password
        const fakeTempPassword = Math.random().toString(36).slice(-8)
        setTemporaryPassword(fakeTempPassword)
        setResetDialogOpen(true)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Usuários Cadastrados</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{mockUsers.length} usuários</span>
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
                    {mockUsers.map((user) => (
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
                                {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                                    onClick={() => handleResetPassword(user)}
                                    title="Resetar Senha"
                                >
                                    <KeyRound className="w-4 h-4 mr-1.5" />
                                    Resetar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Temporary Password Reset Dialog */}
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                            <ShieldAlert className="w-6 h-6 text-amber-600" />
                        </div>
                        <DialogTitle className="text-center">Senha Resetada com Sucesso</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            A senha do usuário foi resetada. Copie a senha temporária abaixo e envie para o usuário.
                            Ele será forçado a trocá-la no próximo acesso.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4 flex items-center justify-center flex-col gap-2">
                        <span className="text-sm font-medium text-gray-500">Senha Temporária</span>
                        <code className="text-2xl font-mono font-bold text-gray-900 tracking-wider bg-white px-4 py-2 rounded border border-gray-200 shadow-sm">
                            {temporaryPassword}
                        </code>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Button onClick={() => setResetDialogOpen(false)} className="w-full sm:w-auto min-w-[120px]">
                            Ok, copiado!
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
