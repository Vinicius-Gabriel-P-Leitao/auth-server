import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "../../store/auth.store";

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("AppRouter Integration & Guards", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("Deve rejeitar sessão se usuario logado NÃO é ADMIN no layout protegido", () => {
    useAuthStore.getState().setAuth(
      "dummy",
      {
        id: "dummy-id",
        username: "common",
        email: "common@ok.com",
        role: "USER",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      false,
    );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAdmin).toBe(false);
  });
});
