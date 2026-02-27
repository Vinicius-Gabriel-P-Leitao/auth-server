import type { AuthenticationResponseDto, MetadataUserResponseDto } from '../modules/auth/molecule/auth.types'

export const mockAdminUser: MetadataUserResponseDto = {
    username: 'admin_test',
    email: 'admin@ok.com',
    role: 'ADMIN',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

export const mockCommonUser: MetadataUserResponseDto = {
    username: 'common_test',
    email: 'user@ok.com',
    role: 'USER',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

export const mockLoginResponseAdmin: AuthenticationResponseDto = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked_admin_token',
    refresh_token: 'mocked_refresh_token_string',
    passwordResetRequired: false,
    metadata: mockAdminUser
}

export const mockLoginResponseCommon: AuthenticationResponseDto = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked_common_token',
    refresh_token: 'mocked_refresh_token_string',
    passwordResetRequired: false,
    metadata: mockCommonUser
}
