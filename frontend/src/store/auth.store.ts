import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import type { MetadataUserResponseDto } from "../modules/auth/molecule/auth.types";
import axios from "axios";

type AuthState = {
  token: string | null;
  user: MetadataUserResponseDto | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  passwordResetRequired: boolean;
  setAuth: (
    token: string,
    user: MetadataUserResponseDto,
    passwordResetRequired: boolean,
  ) => void;
  clearAuth: () => void;
};

let refreshInterval: number | undefined;

const proactiveRefresh = async () => {
  try {
    const response = await axios.post<{
      token: string;
      metadata: MetadataUserResponseDto;
      password_reset_required: boolean;
    }>(
      "/v1/user/refresh",
      {},
      {
        withCredentials: true,
      },
    );
    if (response.data.token && response.data.metadata) {
      useAuthStore
        .getState()
        .setAuth(
          response.data.token,
          response.data.metadata,
          response.data.password_reset_required,
        );
    }
  } catch (error) {
    console.error("Proactive refresh failed", error);
    useAuthStore.getState().clearAuth();
  }
};

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        passwordResetRequired: false,

        setAuth: (token, user, passwordResetRequired) => {
          set({
            token,
            user,
            isAuthenticated: true,
            passwordResetRequired,
            isAdmin: user.role === "ADMIN",
          });

          if (refreshInterval) {
            window.clearInterval(refreshInterval);
          }

          refreshInterval = window.setInterval(proactiveRefresh, 9 * 60 * 1000);
        },

        clearAuth: () => {
          if (refreshInterval) {
            window.clearInterval(refreshInterval);
            refreshInterval = undefined;
          }
          set({
            user: null,
            token: null,
            isAdmin: false,
            isAuthenticated: false,
            passwordResetRequired: false,
          });
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => sessionStorage),
        onRehydrateStorage: () => (state) => {
          // Se sobrevivermos a um F5 e formos autenticados, precisamos registrar novamente o intervalo de atualização do token.
          if (state?.isAuthenticated) {
            if (refreshInterval) {
              window.clearInterval(refreshInterval);
            }

            refreshInterval = window.setInterval(
              proactiveRefresh,
              9 * 60 * 1000,
            );
          }
        },
      },
    ),
  ),
);
