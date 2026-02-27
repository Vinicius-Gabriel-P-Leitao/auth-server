// Reusing MetadataUserResponseDto because RegisterController returns it directly now
import type { MetadataUserResponseDto } from '../../auth/molecule/auth.types'

export type RegisterRequestDto = {
    username: string
    email: string
    password: string
}

export type RegisterResponseDto = MetadataUserResponseDto
