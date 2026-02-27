// Reusing AuthenticationResponseDto because RegisterController returns it
import type { AuthenticationResponseDto } from '../../auth/molecule/auth.types'

export type RegisterRequestDto = {
    username: string
    email: string
    password: string
}

export type RegisterResponseDto = AuthenticationResponseDto
