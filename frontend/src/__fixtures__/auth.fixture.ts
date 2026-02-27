import type { AuthenticationResponseDto, MetadataUserResponseDto } from "../modules/auth/molecule/auth.types";

export const mockAdminUser: MetadataUserResponseDto = {
  id: "019c9cf6-ff7d-7cd0-9050-fc0a6d4c3689",
  username: "admin_test",
  email: "admin@ok.com",
  role: "ADMIN",
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockCommonUser: MetadataUserResponseDto = {
  id: "019c9cf6-ff7d-7cd0-9050-fc0a6d4c3690",
  username: "common_test",
  email: "user@ok.com",
  role: "USER",
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockLoginResponseAdmin: AuthenticationResponseDto = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked_admin_token",
  password_reset_required: false,
  metadata: mockAdminUser,
};

export const mockLoginResponseCommon: AuthenticationResponseDto = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked_common_token",
  password_reset_required: false,
  metadata: mockCommonUser,
};
