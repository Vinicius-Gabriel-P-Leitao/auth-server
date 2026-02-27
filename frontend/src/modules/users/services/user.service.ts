import { axiosClient } from '../../../lib/axios-client.util'
import type { RegisterRequestDto, RegisterResponseDto } from '../molecule/user.types'

/**
 * Registra um novo administrador. Somente usuários com Role.ADMIN podem fazer isso.
 */
export async function registerAdminAttempt(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { data } = await axiosClient.post<RegisterResponseDto>('/v1/user/register/admin', payload)
    return data
}
