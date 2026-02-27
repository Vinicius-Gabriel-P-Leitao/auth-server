export type MetadataUserResponseDto = {
    username: string
    email: string
    role: string
    active: boolean
    created_at: string
    updated_at: string
}

export type AuthenticationResponseDto = {
    token: string
    refresh_token: string
    passwordResetRequired: boolean
    metadata: MetadataUserResponseDto
}

export type AuthenticationRequestDto = {
    email: string
    password: string
}
