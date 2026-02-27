import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth.store";

describe("Auth Store (Zustand)", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("Deve inicializar com os estados padrão nulos/falsos", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAdmin).toBe(false);
  });

  it("Deve reconhecer usuário ADMIN corretamente", () => {
    useAuthStore.getState().setAuth(
      "token_mock_123",
      {
        id: "dummy-id-admin",
        username: "admin_user",
        email: "admin@ok.com",
        role: "ADMIN",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      false,
    );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAdmin).toBe(true);
    expect(state.token).toBe("token_mock_123");
  });

  it("Deve reconhecer usuário comum corretamente rejeitando admin", () => {
    useAuthStore.getState().setAuth(
      "token_mock_123",
      {
        id: "dummy-id-user",
        username: "common_user",
        email: "user@ok.com",
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

  it("Deve limpar os dados ao executar clearAuth", () => {
    useAuthStore.getState().setAuth(
      "token_mock_123",
      {
        id: "dummy-id",
        username: "admin_user",
        email: "admin@ok.com",
        role: "ADMIN",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      false,
    );

    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();

    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAdmin).toBe(false);
  });
});
