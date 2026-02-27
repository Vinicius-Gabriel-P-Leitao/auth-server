export type MetadataUserResponseDto = {
    username: string
    email: string
    role: string
    active: boolean
    created_at: string
    updated_at: string
}

export type AuthenticationResponseDto = {
    readonly token: string
    readonly password_reset_required: boolean
    readonly metadata: MetadataUserResponseDto
}

export type AuthenticationRequestDto = {
    email: string
    password: string
}
