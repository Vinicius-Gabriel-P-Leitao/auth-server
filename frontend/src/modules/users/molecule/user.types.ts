// Reusing MetadataUserResponseDto because RegisterController returns it directly now
import type { MetadataUserResponseDto } from '../../auth/molecule/auth.types'

export type RegisterRequestDto = {
    username: string
    email: string
    password: string
}

export type RegisterResponseDto = MetadataUserResponseDto

export type PaginationMetaDto = {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

export type PaginatedResponseDto<T> = {
    data: T[]
    meta: {
        pagination: PaginationMetaDto
    }
    links: {
        next: string
        prev: string
    }
}
