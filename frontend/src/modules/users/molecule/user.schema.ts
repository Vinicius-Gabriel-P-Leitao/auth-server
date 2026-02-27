import { z } from 'zod'

export const registerAdminSchema = z.object({
    username: z.string()
        .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
        .max(30, 'O nome de usuário deve ter no máximo 30 caracteres')
        .nonempty('O nome de usuário não pode estar em branco'),
    email: z.string()
        .email('O e-mail deve ser válido')
        .nonempty('O e-mail não pode estar em branco'),
    password: z.string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .nonempty('A senha não pode estar em branco'),
})

export type RegisterAdminFormData = z.infer<typeof registerAdminSchema>
